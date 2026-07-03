// 檔案位置: app/contact/page.tsx (或你的頁面位置)
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm"; // 🔥 引入互動表單元件

export default async function ContactPage() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 text-slate-900 dark:text-white mt-6 md:mt-12">
      {/* 1. 頁面標題區塊 */}
      <section className="w-full py-10 md:py-14 flex flex-col items-center justify-center text-center mb-8 px-4">
        <div className="space-y-2 md:space-y-3">
          <div className="text-orange-500 font-bold uppercase tracking-widest text-xs md:text-sm">
            Contact Us
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            與我們聯繫
          </h1>
        </div>
      </section>

      {/* 2. 聯絡區域 */}
      <section className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
        
        {/* 左側：聯絡表單 */}
        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-orange-500/5 border border-slate-100 dark:border-slate-700">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
            發送訊息給我們
          </h3>
          
          {/* 🔥 放入獨立出來的 Client Component 表單 */}
          <ContactForm />
          
        </div>

        {/* 右側：詳細聯絡資訊 (維持原樣) */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
            服務資訊
          </h3>
          {[
            { icon: MapPin, title: "實體展示中心", desc: "台北市信義區潮流大道 101 號" },
            { icon: Phone, title: "客戶服務專線", desc: "02-1234-5678" },
            { icon: Mail, title: "商務合作信箱", desc: "service@urbanexplorer.com" },
            { icon: Clock, title: "營業服務時間", desc: "週一至週五 10:00 - 19:00" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-orange-500/5 border border-slate-100 dark:border-slate-700 hover:border-orange-500 transition-colors"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                <item.icon size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 break-all">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}