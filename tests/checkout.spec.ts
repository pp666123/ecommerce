import { test, expect } from "@playwright/test";

test("完整購物流程：加入購物車並結帳成功", async ({ page }) => {
  // 1. 準備：前往購物
  await page.goto("/collections");
  await page.getByRole("button", { name: "快速加入" }).first().click();
  
  const addBtn = page.getByRole("button", { name: "加入購物車" }).first();
  await expect(addBtn).toBeVisible();
  await addBtn.click();
  await expect(page.getByText("已加入購物車")).toBeVisible();

  // 2. 導航：點擊購物車圖示並前往結帳
  // 使用之前確認過的 locator
  await page.locator('button:has(.lucide-shopping-cart)').click();
  
  // 增加等待，確保購物車側邊欄/彈窗展開
  await page.getByRole("button", { name: "前往結帳" }).first().click();

  // 3. 驗證頁面載入
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.locator("h1")).toHaveText("結帳");

  // 4. 填寫表單
  await page.fill('input[name="email"]', "test@playwright.dev");
  await page.fill('input[name="shipping_name"]', "測試機器人");
  await page.fill('input[name="shipping_phone"]', "0912345678");
  await page.fill('input[name="shipping_address"]', "台北市信義區測試路 1 號");
  await page.fill('textarea[name="order_remark"]', "測試訂單");

  // 5. 發票與付款
  await page.getByRole("button", { name: "公司發票" }).click();
  await page.fill('input[name="company_tax_id"]', "12345678");
  await page.fill('input[name="company_name"]', "自動化測試有限公司");
  await page.check('input[type="checkbox"]');
  await page.getByRole("button", { name: "LINE Pay" }).click();

  // 6. 送出並監聽 API (下面會說明)
  await page.getByRole("button", { name: "使用 LINE Pay 付款" }).click();

  await expect(page).toHaveURL(/\/order-success/);
});