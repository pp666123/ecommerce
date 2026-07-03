// 檔案位置: components/ContactForm.tsx
"use client";

import { useRef, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContactForm } from "./contact"; // 引入剛剛寫的 Server Action

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  // 使用 useTransition 來處理非同步的 Loading 狀態
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      // 呼叫 Server Action
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success("發送成功！", { description: result.message });
        formRef.current?.reset(); // 成功後清空表單
      } else {
        toast.error("發送失敗", { description: result.message });
      }
    });
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">姓名</label>
          <input
            required
            type="text"
            name="name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            placeholder="請輸入姓名"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">信箱</label>
          <input
            required
            type="email"
            name="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            placeholder="email@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">主旨</label>
        <input
          type="text"
          name="subject"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          placeholder="諮詢項目"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">內容</label>
        <textarea
          required
          rows={4}
          name="message"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          placeholder="請輸入您的問題或建議..."
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> 傳送中...
          </>
        ) : (
          <>
            <Send size={18} /> 發送訊息
          </>
        )}
      </button>
    </form>
  );
}