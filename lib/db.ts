// ============================================================
// lib/db.ts
// 資料庫連線池
//
// 建立一個 PostgreSQL 連線池（Pool），讓整個專案共用同一組連線。
// 使用 Pool 而不是單一 Client 的原因是：Pool 會自動管理多條連線，
// 當 API 同時收到多個請求時，不需要排隊等同一條連線釋放，
// 效能更好也更穩定。
//
// connectionString 從環境變數讀取，格式為：
// postgresql://root:root@localhost:5434/vector_db
// ============================================================

import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default pool