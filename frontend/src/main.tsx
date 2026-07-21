import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./globals.css"
import { App } from "./App"

// デザインシステムは .dark クラス方式。旧 index.html は prefers-color-scheme
// だけで切り替えていたので、その挙動を <html> のクラスに翻訳する。
const mq = window.matchMedia("(prefers-color-scheme: dark)")
const applyTheme = () =>
  document.documentElement.classList.toggle("dark", mq.matches)
applyTheme()
mq.addEventListener("change", applyTheme)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
