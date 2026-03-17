import { StaticImageData } from "next/image";
import ImageContent from "./imageContent";
import TextContent from "./textContent";

import product1Img from "@/assets/store/image-product-1.jpg";
import product2Img from "@/assets/store/image-product-2.jpg";
import product3Img from "@/assets/store/image-product-3.jpg";
import product4Img from "@/assets/store/image-product-4.jpg";

import product1tImg from "@/assets/store/image-product-1-thumbnail.jpg";
import product2tImg from "@/assets/store/image-product-2-thumbnail.jpg";
import product3tImg from "@/assets/store/image-product-3-thumbnail.jpg";
import product4tImg from "@/assets/store/image-product-4-thumbnail.jpg";

export type Stores = {
  id: string;
  images: StaticImageData[];
  thumbnail: StaticImageData[];
  company: string;
  title: string;
  content: string;
  price: number;
  discount: number;
  amount: number;
};

const stores: Stores = {
  id: "gyjhkljkl123",
  images: [product1Img, product2Img, product3Img, product4Img],
  thumbnail: [product1tImg, product2tImg, product3tImg, product4tImg],
  company: "Sneaker Company",
  title: "Fall Limited Edition Sneakers",
  content: `These low-profile sneakers are your perfect casual wear companion. Featuring a 
  durable rubber outer sole, they’ll withstand everything the weather can offer.`,
  price: 125,
  discount: 50,
  amount: 0,
};

export default function Women() {
  return (
    <div className="w-full flex flex-col xl:flex-row">
      <div className="flex-1">
        <ImageContent {...stores} />
      </div>
      <div className="flex-1 flex justify-center xl:justify-start px-8 md:px-0">
        <TextContent {...stores} />
      </div>
    </div>
  );
}
