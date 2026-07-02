import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ok, fail } from "@/lib/response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return fail("UNAUTHORIZED", "未登入");

    // 驗證並解碼 JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 回傳使用者資訊
    return ok({
      id: payload.id,
      username: payload.username,
      email: payload.email,
    });
  } catch (error) {
    return fail("UNAUTHORIZED", "憑證無效或已過期");
  }
}