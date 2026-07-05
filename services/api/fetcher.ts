interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function fetcher<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result: ApiResponse<T> = await res.json();

  // 若 success 為 false，直接拋出後端定義的錯誤訊息
  if (!result.success) {
    throw new Error(result.error?.message || "發生未知錯誤");
  }

  // 斷言 data 必定存在，因為 success 為 true
  return result.data as T;
}
