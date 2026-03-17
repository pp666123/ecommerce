# 👟 Sneakers E-commerce Store

一款基於 **Next.js 15**、**React 19** 與 **Tailwind CSS 4.0** 打造的現代化電商產品頁面。專注於極致的 UI 互動、響應式設計（RWD）以及流暢的使用者體驗。

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black?style=for-the-badge&logo=shadcnui)

---

## ✨ 核心功能與亮點

### 1. 介面切版

- 依照 [Frontend Mentor - E-commerce product page](https://www.frontendmentor.io/challenges/ecommerce-product-page-UPsZ9MJp6) 設計圖進行開發。
- 專案開發時程：共計 3 天。

### 2. 響應式設計 (RWD)

- **圖片展示**：
  - **電腦版**：大圖與四張縮圖連動切換。確保在不同螢幕比例下不變形，並於 Hover 時加入白色半透明遮罩效果。
  - **手機版**：優化觸控體驗的佈局設計，隱藏縮圖以最大化空間利用。
- **文字佈局**：
  - 全面適配手機、平板及電腦端顯示。

### 3. Shadcn UI

- 深度整合 Shadcn UI 組件庫，並針對專案需求進行樣式配置。

### 4. 狀態管理

- 採用 **Zustand** 進行全域購物車狀態管理，包含商品數量、金額計算及購物車清單的即時同步。

### 5. TypeScript

- 使用 TypeScript 嚴謹定義資料型別，提升程式碼健壯性並加速後端資料串接效率。

---

## 📁 專案架構

```text
├── app/
│   ├── icon.svg            # 支援深色模式的向量 Favicon
│   ├── layout.tsx          # 根佈局 (包含 Toaster 與 Navbar)
│   └── page.tsx            # 產品展示主頁面
├── components/
│   ├── ui/                 # shadcn/ui 基礎組件 (Button, Sheet, etc.)
│   ├── navbar.tsx          # 導覽列與購物車入口
│   ├── image-content.tsx   # 大圖與縮圖切換邏輯
│   └── text-content.tsx    # 產品描述與數量控制
├── store/
│   └── useCart.ts          # Zustand 購物車狀態庫
└── assets/                 # 產品靜態圖片資源
```

## 🛠️ 技術棧 (Tech Stack)

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Notifications**: [Sonner (Toast)](https://sonner.stevenly.me/)



## 🚀 快速啟動

### 安裝套件

```bash
npm install
```

### 啟動

```bash
npm run dev
```

### 建置

```bash
npm run build
```
