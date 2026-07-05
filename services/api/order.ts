import { fetcher } from "./fetcher";

// 商品快照結構
export interface OrderItemSnapshot {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

// 訂單完整資料結構 (對應 DB Schema)
export interface Order {
  id: string;
  user_id?: string;
  email: string;
  logistics: "home" | "711" | "family";
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  order_remark?: string;
  invoice_type: "personal" | "company";
  carrier_type?: string;
  carrier_code?: string;
  company_tax_id?: string;
  company_name?: string;
  invoice_address?: string;
  payment_method: "credit_card" | "line_pay";
  subtotal: number;
  shipping_fee: number;
  order_total: number;
  items: OrderItemSnapshot[]; // JSONB 資料
  status: string;
  created_at: Date;
}

// 建立訂單時的 Payload
export interface CreateOrderPayload {
  user_id?: string;
  email: string;
  logistics: "home" | "711" | "family";
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  order_remark?: string;
  invoice_type: "personal" | "company";
  carrier_type?: string;
  carrier_code?: string;
  company_tax_id?: string;
  company_name?: string;
  invoice_address?: string;
  payment_method: "credit_card" | "line_pay";
  subtotal: number;
  shipping_fee: number;
  order_total: number;
  items: OrderItemSnapshot[];
}

export const orderApi = {
  // 🔥 新增訂單
  create: (data: CreateOrderPayload) =>
    fetcher<{ id: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔥 獲取使用者訂單列表 (依據 user_id)
  getByUserId: (userId: string) =>
    fetcher<Order[]>(`/api/orders?user_id=${userId}`, {
      method: "GET",
    }),

  // 🔥 獲取單一訂單詳情 (選填，若後端有實作)
  getById: (id: string) =>
    fetcher<Order>(`/api/orders/${id}`, {
      method: "GET",
    }),
};
