// src/lib/products.ts

export type ProductItem = {
  id: number;
  name: string;
  // 擴充類別類型以包含童裝與配件
  category: "男款鞋" | "女款鞋" | "男女同款" | "童裝" | "配件";
  price: string;
  image: string;
  isNew: boolean;
};

// 模擬的商品資料庫 (擴充資料)
export const allProducts: ProductItem[] = [
  { id: 101, name: "橘流 城市機能跑鞋", category: "男款鞋", price: "185.00", image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=800", isNew: true },
  { id: 102, name: "復古 80s 經典板鞋", category: "男女同款", price: "130.00", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800", isNew: false },
  { id: 103, name: "極限 氣墊訓練鞋", category: "男款鞋", price: "210.00", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800", isNew: true },
  { id: 104, name: "街頭 帆布百搭款", category: "女款鞋", price: "85.00", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800", isNew: false },
  { id: 105, name: "未來感 粗獷老爹鞋", category: "男款鞋", price: "165.00", image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800", isNew: false },
  { id: 106, name: "夜跑 反光輕量鞋", category: "女款鞋", price: "145.00", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=800", isNew: true },
  // 新增童裝
  { id: 201, name: "小探險家 彈性休閒鞋", category: "童裝", price: "65.00", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800", isNew: true },
  // 新增配件
  { id: 301, name: "機能 城市工裝帽", category: "配件", price: "45.00", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800", isNew: false },
];

// 過濾函式
export const getProductsByCategory = (slug: string) => {
  if (slug === "men") return allProducts.filter((p) => p.category === "男款鞋");
  if (slug === "women") return allProducts.filter((p) => p.category === "女款鞋");
  if (slug === "kids") return allProducts.filter((p) => p.category === "童裝");
  if (slug === "accessories") return allProducts.filter((p) => p.category === "配件");
  
  return allProducts; // 如果沒有匹配，回傳全部
};