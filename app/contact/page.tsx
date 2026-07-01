"use client";

import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 text-slate-900 dark:text-white mt-6 md:mt-12">
      
      {/* 1. 頁面標題區塊 (維持風格統一) */}
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

      {/* 2. 聯絡區域 (兩欄式佈局：左表單、右資訊) */}
      <section className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
        
        {/* 左側：聯絡表單 */}
        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-orange-500/5 border border-slate-100 dark:border-slate-700">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
            發送訊息給我們
          </h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">姓名</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="請輸入姓名" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">信箱</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="email@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">主旨</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="諮詢項目" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">內容</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="請輸入您的問題或建議..."></textarea>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/40 transition-all">
              <Send size={18} /> 發送訊息
            </button>
          </form>
        </div>

        {/* 右側：詳細聯絡資訊 */}
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
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}