import { cookies } from "next/headers";
import { ok } from "@/lib/response";

export async function POST() {
  const cookieStore = await cookies();
  // 將 cookie 刪除
  cookieStore.delete("auth_token");
  return ok({ message: "登出成功" });
}