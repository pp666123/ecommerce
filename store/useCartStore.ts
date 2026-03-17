import { StaticImageData } from "next/image";
import { create } from "zustand";

export type Cart = {
  id: string;
  title: string;
  images: StaticImageData[];
  price: number;
  amount: number;
};

interface CartState {
  cartData: Cart[];
  postCartData: (data: Cart) => void;
  delCartData: (id: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartData: [],
  postCartData: (newItem) =>
    set((state) => {
      // 2. 尋找購物車是否已有相同 ID
      const isExist = state.cartData.find((item) => item.id === newItem.id);

      if (isExist) {
        // 3. 若存在：透過 map 找到該 ID，累加數量
        return {
          cartData: state.cartData.map((item) =>
            item.id === newItem.id
              ? { ...item, amount: item.amount + newItem.amount }
              : item,
          ),
        };
      }
      // 4. 若不存在：將新項目放入陣列末端
      return { cartData: [...state.cartData, newItem] };
    }),
  delCartData: (targetId) =>
    set((state) => ({
      // 留下所有 ID 「不等於」目標 ID 的商品
      cartData: state.cartData.filter((item) => item.id !== targetId),
    })),
}));
