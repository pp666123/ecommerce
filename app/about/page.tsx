import { Instagram, Facebook, MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 text-slate-900 dark:text-white mt-6 md:mt-12 overflow-hidden">
      
      {/* 1. 頁面標題區塊 */}
      <section className="w-full py-10 md:py-14 flex flex-col items-center justify-center text-center mb-8 px-4">
        <div className="space-y-2 md:space-y-3">
          <div className="text-orange-500 font-bold uppercase tracking-widest text-xs md:text-sm">
            About Us
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            關於我們
          </h1>
        </div>
      </section>

      {/* 2. 交錯式圖文區塊 (Z-Pattern Layout) */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mb-24 space-y-20 md:space-y-32">
        
        {/* 區塊 A: 公司介紹 (左文字、右圖片) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* 文字端 */}
          <div className="order-2 lg:order-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
              <span className="w-10 h-1 bg-orange-500 rounded-full"></span>
              公司介紹
            </h2>
            <div className="text-slate-500 dark:text-slate-400 leading-loose text-justify space-y-4 text-sm md:text-base">
              <p>
                我們誕生於喧囂的水泥叢林之中，不僅僅是一個鞋履品牌，更是一群熱愛街頭文化與機能美學的探索者。幾位深諳潮流與工業設計的創辦人，決定親自打破「機能」與「百搭」間的界線。
              </p>
              <p>
                從第一雙概念鞋的草圖開始，團隊耗時無數個日夜，走訪全球頂尖材質實驗室，獨創出標誌性的高回彈氣墊中底。我們的目標很簡單：為穿梭於城市巷弄的你，打造一雙能展現無畏態度的終極裝備。
              </p>
            </div>
          </div>
          
          {/* 圖片端 (帶有橘色錯位裝飾的潮流感設計) */}
          <div className="order-1 lg:order-2 relative w-full group">
            {/* 橘色背景錯位方塊 */}
            <div className="absolute inset-0 bg-orange-500 translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 rounded-3xl opacity-20 dark:opacity-40 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            {/* 圖片本體 */}
            <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl shadow-orange-500/10">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
                alt="公司介紹情境圖" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* 區塊 B: 經營理念 (左圖片、右文字) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* 圖片端 */}
          <div className="order-2 lg:order-1 relative w-full group">
            {/* 橘色背景錯位方塊 (換邊錯位) */}
            <div className="absolute inset-0 bg-orange-500 -translate-x-4 translate-y-4 md:-translate-x-6 md:translate-y-6 rounded-3xl opacity-20 dark:opacity-40 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl shadow-orange-500/10">
              <Image 
                src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1000" 
                alt="經營理念情境圖" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* 文字端 */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
              <span className="w-10 h-1 bg-orange-500 rounded-full"></span>
              經營理念
            </h2>
            <div className="text-slate-500 dark:text-slate-400 leading-loose text-justify space-y-5 text-sm md:text-base">
              <p>
                「拒絕妥協，定義自我。」我們深信，一雙好鞋是個人風格的延伸。在這個瞬息萬變的時代，我們始終堅持三大核心理念：
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 mt-1 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 shrink-0 font-bold text-xs">1</div>
                  <p><strong className="text-slate-800 dark:text-slate-200">極致追求：</strong>嚴格的人體工學測試，確保腳感與外觀完美平衡。</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 mt-1 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 shrink-0 font-bold text-xs">2</div>
                  <p><strong className="text-slate-800 dark:text-slate-200">社群共創：</strong>將街頭玩家的真實需求，轉化為產品進化的養分。</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 mt-1 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 shrink-0 font-bold text-xs">3</div>
                  <p><strong className="text-slate-800 dark:text-slate-200">創新科技：</strong>從環保材質到未來結構，不斷探索製鞋工藝極限。</p>
                </li>
              </ul>
              <p className="font-bold text-orange-500 text-lg pt-2">
                我們賣的不只是一雙鞋，而是一份陪你踩破規則的勇氣。
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 3. 官方社群與通路 (保持不變) */}
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Join Our Community</h3>
          <p className="text-slate-500 mt-2">追蹤我們的最新動態</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { id: "ig", icon: Instagram, title: "Instagram", desc: "@品牌官方IG", href: "#", bgAccent: "group-hover:bg-pink-50" },
            { id: "threads", icon: MessageCircle, title: "Threads", desc: "日常潮流話題", href: "#", bgAccent: "group-hover:bg-slate-50" },
            { id: "fb", icon: Facebook, title: "Facebook", desc: "官方粉絲專頁", href: "#", bgAccent: "group-hover:bg-blue-50" },
            { id: "shopee", icon: ShoppingBag, title: "蝦皮購物", desc: "官方直營商城", href: "#", bgAccent: "group-hover:bg-orange-50" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-orange-500/5 border border-slate-100 dark:border-slate-700 hover:ring-2 hover:ring-orange-500 transition-all duration-300 ${item.bgAccent} dark:group-hover:bg-slate-800`}
            >
              <item.icon className="w-8 h-8 md:w-10 md:h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h4 className="font-bold text-lg mb-1 text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{item.title}</h4>
              <p className="text-slate-500 text-xs md:text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}