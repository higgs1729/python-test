// 学習データ(成績・マーク)の永続化。
//
// 旧 index.html のロジックをそのまま移植している。保存先の優先順位は
//   1. デスクトップアプリ(pywebview の js_api) → exe と同じフォルダの progress.json
//   2. server.py の /api/progress            → python-test フォルダの progress.json
//   3. localStorage                          → ブラウザ直開き時のフォールバック
// 環境判定は初回 load() 時に一度だけ行い、以降の save は同じ経路を使う。

export type Stat = { seen: number; correct: number }
export type Stats = Record<string, Stat>
/** 問題IDごとのマーク付与履歴(付けた順に色が並ぶ) */
export type Flags = Record<string, MarkColor[]>
export type MarkColor = "check" | "green" | "yellow" | "red"

export type Progress = { stats: Stats; flags: Flags }

export const MARK_COLORS: MarkColor[] = ["check", "green", "yellow", "red"]
export const MARK_LABEL: Record<MarkColor, string> = {
  check: "チェック",
  green: "緑",
  yellow: "黄",
  red: "赤",
}

const LS_STATS = "da_exam_stats_v1"
const LS_FLAGS = "da_exam_flags_v1"
const API = "/api/progress"

type PywebviewApi = {
  load: () => Promise<Partial<Progress>>
  save: (data: Progress) => Promise<unknown>
  close: () => Promise<unknown>
}
declare global {
  interface Window {
    pywebview?: { api?: PywebviewApi }
  }
}

let apiAvailable = false // server.py 経由(ブラウザ運用)で保存できるか
let desktopApi = false // pywebview(デスクトップアプリ)で保存できるか

export const isDesktop = () => desktopApi
export const isServerApi = () => apiAvailable

// pywebview 環境なら window.pywebview.api が使えるようになるまで待つ。
// ブラウザでは window.pywebview が無いので即 false を返す(待たない)。
function pywebviewReady(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.pywebview) return resolve(false)
    if (window.pywebview.api?.load) return resolve(true)
    window.addEventListener("pywebviewready", () => resolve(true), { once: true })
    setTimeout(() => resolve(!!window.pywebview?.api?.load), 1500)
  })
}

/** 旧形式(マークが文字列1つ)を配列へ移行する。 */
function migrateFlags(raw: unknown): Flags {
  const flags = (raw ?? {}) as Record<string, MarkColor | MarkColor[]>
  const out: Flags = {}
  for (const k in flags) {
    const v = flags[k]
    out[k] = typeof v === "string" ? [v] : v
  }
  return out
}

/** 学習データを読み込む。デスクトップ(pywebview) → server.py → localStorage の順。 */
export async function loadProgress(): Promise<Progress> {
  if (await pywebviewReady()) {
    try {
      const d = await window.pywebview!.api!.load()
      desktopApi = true
      return { stats: d.stats ?? {}, flags: migrateFlags(d.flags) }
    } catch {
      /* 失敗時は下へフォールバック */
    }
  }
  try {
    const r = await fetch(API, { cache: "no-store" })
    if (r.ok) {
      const d = (await r.json()) as Partial<Progress>
      apiAvailable = true
      return { stats: d.stats ?? {}, flags: migrateFlags(d.flags) }
    }
  } catch {
    /* サーバ未起動 → localStorage */
  }
  return {
    stats: JSON.parse(localStorage.getItem(LS_STATS) || "{}") as Stats,
    flags: migrateFlags(JSON.parse(localStorage.getItem(LS_FLAGS) || "{}")),
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

/** 変更を保存する(書き込みは 250ms デバウンス)。 */
export function persistProgress(data: Progress) {
  if (desktopApi) {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        void window.pywebview?.api?.save(data)
      } catch {
        /* ウィンドウ破棄中などは無視 */
      }
    }, 250)
  } else if (apiAvailable) {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      void fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {})
    }, 250)
  } else {
    localStorage.setItem(LS_STATS, JSON.stringify(data.stats))
    localStorage.setItem(LS_FLAGS, JSON.stringify(data.flags))
  }
}

export function clearLocalStorage() {
  localStorage.removeItem(LS_STATS)
  localStorage.removeItem(LS_FLAGS)
}

/**
 * 終了処理。デバウンス中の保存を確定させてから、
 * デスクトップならウィンドウを閉じ、server.py 運用ならサーバを停止する。
 * @returns ブラウザ運用で「終了しました」画面を出すべきなら true
 */
export async function shutdown(data: Progress): Promise<boolean> {
  if (saveTimer) clearTimeout(saveTimer)
  if (desktopApi) {
    try {
      await window.pywebview!.api!.save(data)
    } catch {
      /* 保存できなくても閉じる */
    }
    try {
      await window.pywebview!.api!.close()
    } catch {
      /* すでに閉じている可能性 */
    }
    return false
  }
  if (apiAvailable) {
    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      await fetch("/api/shutdown", { method: "POST" })
    } catch {
      /* 既に停止済みの可能性 */
    }
  }
  return true
}
