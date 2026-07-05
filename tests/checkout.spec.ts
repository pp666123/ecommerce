import { test, expect } from "@playwright/test";

test.describe("結帳頁面完整功能與分支測試", () => {
  // 每個測試前，先準備好購物車資料並進入結帳頁
  test.beforeEach(async ({ page }) => {
    await page.goto("/collections");
    await expect(page).toHaveURL(/.*collections/);

    await page
      .getByRole("link", { name: "小探險家 舒適防風外套 快速加入" })
      .click();

    await page.getByRole("button", { name: "加入購物車" }).first().click();

    await page.locator("button:has(.lucide-shopping-cart)").click();
    await page.getByRole("button", { name: "前往結帳" }).click();
    await expect(page).toHaveURL(/.*checkout/);
  });

  test("測試一：購物車數量增減、刪除商品與空購物車阻擋", async ({ page }) => {
    // 測試增加數量 (+)
    const plusBtn = page.locator("button:has(.lucide-plus)");
    await plusBtn.click();

    // 測試減少數量 (-)
    const minusBtn = page.locator("button:has(.lucide-minus)");
    await minusBtn.click();

    // 測試刪除商品 (垃圾桶)
    const deleteBtn = page.locator("button:has(.lucide-trash2)");
    await deleteBtn.click();

    // 商品被清空，確認付款按鈕此時必須是停用狀態
    const submitBtn = page.getByRole("button", { name: "確認付款" });
    await expect(submitBtn).toBeDisabled();
  });

  test("測試二：個人發票(各種載具切換)、7-11 物流與信用卡付款", async ({
    page,
  }) => {
    // 填寫基本資料
    await page.fill('input[name="email"]', "personal@example.com");
    await page.fill('input[name="shipping_name"]', "王小明");
    await page.fill('input[name="shipping_phone"]', "0912345678");
    await page.fill('input[name="shipping_address"]', "信義門市 / 123456");
    await page.fill('textarea[name="order_remark"]', "請在晚上取件");

    // 切換物流：7-11
    await page.getByRole("button", { name: /7-11 超商取貨/ }).click();

    await expect(
      page
        .locator("text=運費 (超商)")
        .locator("..")
        .locator("span.font-medium.text-zinc-900"),
    ).toContainText("$10");

    // 發票：個人發票 -> 點擊紙本 -> 點擊會員 -> 點擊手機條碼
    await page.getByRole("button", { name: "個人發票" }).click();
    await page.getByRole("button", { name: "紙本發票" }).click();
    // await page.getByRole("button", { name: "會員載具" }).click();
    await page.getByRole("button", { name: "手機條碼" }).click();
    await page.fill('input[name="carrier_code"]', "/TEST888");

    // 付款：預設就是信用卡，但確保點擊過
    await page.getByRole("button", { name: "信用卡 / 金融卡" }).click();
    await page.getByPlaceholder(/卡號/).fill("4311 1111 1111 1111");
    await page.getByPlaceholder(/到期日/).fill("12/28");
    await page.getByPlaceholder(/安全碼/).fill("123");

    // 送出
    await page.getByRole("button", { name: "確認付款" }).click();
    await expect(page).toHaveURL(/.*order-success/);
  });

  test("測試三：公司發票(統編)、同收件地址切換、全家物流與 LINE Pay", async ({
    page,
  }) => {
    // 填寫基本資料
    await page.fill('input[name="email"]', "company@example.com");
    await page.fill('input[name="shipping_name"]', "陳大頭");
    await page.fill('input[name="shipping_phone"]', "0987654321");
    await page.fill('input[name="shipping_address"]', "全家大安店");

    // 切換物流：全家 (宅配 home 預設已被涵蓋，這裡測全家)
    await page.getByRole("button", { name: /全家 超商取貨/ }).click();

    // 發票：切換為公司發票
    await page.getByRole("button", { name: "公司發票 (統編)" }).click();
    await page.fill('input[name="company_tax_id"]', "12345678");
    await page.fill('input[name="company_name"]', "自動化測試股份有限公司");

    // 測試「發票寄送地址」：未勾選同收件人時，填寫地址
    const invoiceAddressInput = page.locator('input[name="invoice_address"]');
    await invoiceAddressInput.fill("台北市大安區獨立地址 1 號");

    // 測試「同收件資訊地址」勾選框
    const sameAsShippingCheckbox = page.locator('input[type="checkbox"]');
    await sameAsShippingCheckbox.check();

    // 驗證勾選後，發票地址輸入框應變為 disabled
    await expect(invoiceAddressInput).toBeDisabled();

    // 取消勾選再填一次確保功能來回切換正常
    await sameAsShippingCheckbox.uncheck();
    await invoiceAddressInput.fill("高雄市前鎮區測試路 99 號");

    // 付款：LINE Pay
    await page.getByRole("button", { name: "LINE Pay" }).click();

    // 送出：按鈕名稱應隨之變成 "使用 LINE Pay 付款"
    await page.getByRole("button", { name: "使用 LINE Pay 付款" }).click();
    await page.waitForTimeout(1000);

    // 驗證跳轉
    await expect(page).toHaveURL(/.*order-success/);
  });
});
