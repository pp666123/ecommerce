import { test, expect } from "@playwright/test";

test.describe("結帳頁面完整功能測試", () => {
  test.beforeEach(async ({ page }) => {
    // 確保購物車有商品 (根據你的應用邏輯)
    await page.goto("/collections");

    await page.getByRole("main").click();
    await page
      .getByRole("link", { name: "小探險家 舒適防風外套 快速加入" })
      .getByRole("button")
      .click();

    // await page.getByRole("button", { name: "快速加入" }).first().click();
    await page.getByRole("button", { name: "加入購物車" }).first().click();
    // 點擊購物車圖示 (利用我們確認過的 locator)
    await page.locator("button:has(.lucide-shopping-cart)").click();
    await page.getByRole("button", { name: "前往結帳" }).click();
  });

  test("測試所有欄位輸入與個人發票 (手機載具) 結帳", async ({ page }) => {
    // 填寫基本資料
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="shipping_name"]', "王小明");
    await page.fill('input[name="shipping_phone"]', "0912345678");
    await page.fill('input[name="shipping_address"]', "台北市信義區");
    await page.fill('textarea[name="order_remark"]', "請準時送達");

    // 切換物流
    await page.getByText("7-11 超商取貨").click();

    // 發票：選擇個人 -> 手機條碼
    await page.getByRole("button", { name: "個人發票" }).click();
    await page.getByRole("button", { name: "手機條碼" }).click();
    await page.fill('input[name="carrier_code"]', "/TEST888");

    // 付款
    await page.getByRole("button", { name: "信用卡 / 金融卡" }).click();

    // 填寫信用卡假欄位 (透過 placeholder 定位)
    await page.getByPlaceholder(/卡號/).fill("4311 1111 1111 1111");
    await page.getByPlaceholder(/到期日/).fill("12/28");
    await page.getByPlaceholder(/安全碼/).fill("123");

    // 送出

    await page.getByRole("button", { name: "確認付款" }).click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*order-success/);
  });
});
