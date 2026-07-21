feat:teamT-appのテーマをライト/ダーク/ミッドナイトの3種へ復活

外観の適用先をラッパーdivのクラスから<html>のdata-team-t-theme属性へ移し、
モバイルサイドバー(Sheetポータル)が親テーマを継承せずライト色になる不具合を解消した。
併せてcomponents/ui/*のdark:バリアントもmidnight/darkで有効になる。

- 3themeともゴールドの意匠を残し、明度トークンのみ差し替え。ライトはゴールドを
  濃色化してコントラストを確保し、紫の塗り上用に--team-t-gold-on-primaryを新設
- preferencesにtheme(既定=midnight)/accent/emphasizeBordersを追加。既存の保存
  データにキーが無い場合は既定へフォールバックする
- 設定モーダルの外観に(studio)を参考としたテーマカード3枚・アクセント5色・枠線
  強調を追加。ミッドナイト選択中はアクセントをdisabledにする
- <html>はルートのnext-themesと共有するため、mount時の状態を控えてunmountで復元
- ゲームdialogは演出上ミッドナイト固定を維持
- コイン進捗トラックが黒背景に埋もれていたのをbg-foreground/15へ修正

型チェック・lint・Storybook・実描画は未検証(node_modules不在のため実行不可)。

テキストを選択してClaudeにコメントを残してください
データ分析試験アプリの React + shadcn/ui 移行
Context
python-test は pywebview デスクトップアプリ（および server.py 経由のブラウザ運用）で動く
自習アプリで、UI は単一の index.html（1005行・CSS/HTML/JS 全部入り）で構成されている。
デザインは独自の CSS 変数（--primary:#2563eb 等）で、隣の react-shadcn リポジトリが持つ
デザインシステム（Tailwind v4 + base-ui ベースの shadcn/ui、OKLCH トークン）とは無関係。

目的は index.html を React + react-shadcn のデザインシステムに移行し、機能を完全維持したまま
見た目と部品をデザインシステムに準拠させること。

調査で判明した前提（重要）
react-shadcn/node_modules は実質空（next/dist/esm の空ディレクトリのみ・280KB）。
当初想定していた「react-shadcn から node_modules をコピー」は不可能。
ただし npm キャッシュ C:\Users\253207\AppData\Local\npm-cache\_cacache（205MB）に
react 19.2.4 / vite 8 / tailwindcss 4 / @base-ui/react / next 16.2.6 の tarball が存在を確認済み。
→ npm install --offline はネットワーク接続なしで成立する（ユーザー承認済みの方針）。
react-shadcn/components/ui/*.tsx は Next.js 非依存（next/* の import ゼロ）。
依存は @base-ui/react / cva / clsx / tailwind-merge / lucide-react / @/lib/utils のみ。
→ Vite の SPA にそのまま移植できる。
@vitejs/plugin-react は lock に無いが、不要。Vite の esbuild が tsconfig の
"jsx": "react-jsx" を読んで .tsx を変換する（React Fast Refresh が効かず全リロードになるだけ）。
file:// では ES module が CORS で読めないため、デスクトップ版は
**pywebview 内蔵 HTTP サーバ（webview.start(http_server=True)）**で配信する（ユーザー承認済み）。
この環境には pywebview が未インストール（ModuleNotFoundError: No module named 'webview'）。
デスクトップ経路の動作確認はユーザー側で行う必要がある。
成果物の構成
python-test/
├─ app.py            改修: webui/index.html を http_server=True で配信
├─ server.py         改修: 静的ルートを frontend/dist に変更（/api/progress は無変更）
├─ storage.py        無変更
├─ build.bat         改修: --add-data "frontend\dist;webui"
├─ index.html        削除（git 履歴に残る）
├─ questions.js      → frontend/src/data/questions.js へ移動
└─ frontend/
   ├─ package.json / package-lock.json / vite.config.ts / postcss.config.mjs
   ├─ tsconfig.json / components.json / index.html
   ├─ src/
   │  ├─ main.tsx, App.tsx, globals.css
   │  ├─ lib/utils.ts, lib/progress.ts
   │  ├─ components/ui/*.tsx      ← react-shadcn からコピー（下記17点）
   │  ├─ data/questions.js, data/questions.ts
   │  ├─ hooks/use-progress.ts
   │  └─ features/{home,quiz,browse,result,shared}/
   └─ dist/                        ビルド生成物（.gitignore）
手順
1. 依存の導入（frontend/）
react-shadcn/package.json からバージョンを転写した最小の package.json を作る。
@vitejs/plugin-react は入れない（不要かつキャッシュに無い）。

dependencies: react@19.2.4 react-dom@19.2.4 @base-ui/react@^1.6.0
class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^3.6.0
lucide-react@^1.23.0 tw-animate-css@^1.4.0 shadcn@^4.13.0
devDependencies: vite@^8.1.3 tailwindcss@^4 @tailwindcss/postcss@^4
typescript@^5 @types/react@^19 @types/react-dom@^19 @types/node@^20
cd frontend && npm install --offline
フォールバック（--offline が resolve に失敗した場合）:
react-shadcn/package-lock.json と package.json をそのまま frontend/ にコピーして
npm ci --offline。lock 全ツリーはキャッシュ済みなので確実に通る（next/storybook も入るが未使用）。

2. react-shadcn からのコピー（無改変）
コピー元	コピー先
lib/utils.ts	frontend/src/lib/utils.ts
postcss.config.mjs	frontend/postcss.config.mjs
components.json	frontend/components.json（rsc: false、css パスを src/globals.css に）
components/ui/{button,card,badge,progress,toggle,toggle-group,checkbox,label,native-select,input,collapsible,alert-dialog,dialog,table,separator,item,alert}.tsx	frontend/src/components/ui/
この17点で import 閉包は完結する（@/hooks/* などへの外部依存なし・検証済み）。
*.stories.tsx はコピーしない。components/ui/* の本体は編集禁止（react-shadcn の規約 AGENTS.md）。

app/globals.css → frontend/src/globals.css にコピーし、この2箇所だけ削除:

html[data-team-t-theme=...] / .team-t-midnight-surface の各ブロック（119–228行付近）
html[data-emphasize-borders="true"] .inventory-preview ルール
@theme inline / :root / .dark / @layer base / reduce-motion はそのまま維持する。

3. ビルド設定
frontend/vite.config.ts — base: './'、resolve.alias で @ → src、build.outDir: 'dist'
frontend/tsconfig.json — react-shadcn の tsconfig をベースに、plugins:[{name:"next"}] と
next-env.d.ts / .next/types を除去。"jsx": "react-jsx" "paths": {"@/*": ["./src/*"]} を維持
frontend/index.html — <html lang="ja"> / <title>データ分析試験 模擬問題集</title> /
<div id="root"> / <script type="module" src="/src/main.tsx">
Tailwind のクラス検出が漏れる場合は globals.css 先頭に @source "../src"; を追加
4. データ層の移植
questions.js を frontend/src/data/questions.js へ移動し、2行だけ書き換える:
window.QUESTIONS = [ → export const QUESTIONS = [、window.CATEGORIES = { → export const CATEGORIES = {。
README の「問題の追加方法」の手順（配列に追記）はそのまま使えるようにパスだけ更新する。

frontend/src/data/questions.ts で Question 型（id,cat,level,q,choices,answer,exp,choiceExp?）を定義し、
型付きで再エクスポートする。

frontend/src/lib/progress.ts — 既存 index.html:407-473 の3段フォールバックを
そのまま関数化して移植する（ロジックを変えない）:
pywebviewReady() → window.pywebview.api.load/save → fetch("/api/progress") → localStorage。
250ms デバウンス保存、exitApp() の desktop/browser 分岐、旧形式マーク移行
（index.html:996 の typeof flags[k] === "string" → 配列化）も含める。

frontend/src/hooks/use-progress.ts — stats / flags を React state で保持し、
addFlag / undoFlag / recordAnswer / resetAll を公開する。

5. UI の移植（コンポーネント対応表）
現行画面を App.tsx の view: "home" | "quiz" | "browse" | "browseDetail" | "result" 状態で切り替える
（ルータは不要。現行の classList.toggle("hide") と同じ遷移）。

現行	移行先
.card	Card / CardHeader / CardContent
.chip（分野・難易度の複数選択）	ToggleGroup + ToggleGroupItem（多選択）+ 件数は Badge
button / .btn-primary / .btn-ghost / .btn-danger	Button の variant="default" / "ghost" / "destructive"、size="sm" / "lg"
select	NativeSelect + NativeSelectOption
input[type=number]	Input type="number"
input[type=checkbox] + .opt	Checkbox + Label
details.sec（詳細な絞り込み・成績）	Collapsible / CollapsibleTrigger / CollapsibleContent
.progress-bar	Progress + ProgressTrack + ProgressIndicator
.choice（選択肢）	Button variant="outline" を全幅に。正誤は data-state 属性 + Tailwind の data-[state=correct]:…
.exp（解説）	Alert + AlertTitle / AlertDescription、各選択肢解説は Collapsible
.tag	Badge variant="secondary"
.qlist-item（問題一覧の行）	Item + ItemContent / ItemTitle / ItemActions
table（分野別正答率）	Table / TableHeader / TableRow / TableCell
#historyModal	Dialog + DialogContent
#confirmModal（リセット・中断・終了）	AlertDialog + AlertDialogAction / AlertDialogCancel
.flag-bar の4色ドット	Button variant="outline" + Badge で回数。色は --chart-* ではなくマーク固有色を globals.css に追記（--mark-check/green/yellow/red。既存トークンは触らない）
prefers-color-scheme によるダークモード	main.tsx で matchMedia("(prefers-color-scheme: dark)") を監視し <html> に .dark を付け外し（react-shadcn の .dark クラス方式に合わせる）。next-themes は導入しない
base-ui の注意（AGENTS.md の規約）: asChild や type="single" は存在しない。
合成は render={<... />} プロップを使う。API に迷ったら components/ui/*.tsx のソースを読む。

6. 機能パリティのチェックリスト
移行漏れを防ぐため、以下を全て満たすこと。

ホーム: 分野9チップ / 難易度A・B・Cチップ（件数付き）/ すべて選択・解除 /
出題数（10・20・40・全問）/ シャッフル / 誤答のみ / 試験を開始 / 問題一覧を見る
詳細な絞り込み: 回答回数・間違えた回数・4色マーク回数 ×（指定なし／以上／以下）+ 一致件数のライブ表示
成績: 延べ解答数・累計正答率・出題済み問題数 / リセット（確認ダイアログ）
出題: 第n問/全m問・カテゴリタグ・進捗バー・セッション正答率・解答履歴ダイアログ・
問題文・選択肢A〜D・正誤配色・「あなたの解答」・解説・各選択肢解説（折りたたみ）・
マークバー（4色 + 取消 + 回数 + 付与順ドット）・中断（確認）・次へ
結果: 正答率の大表示 / 合格ライン70%判定 / 分野別正答率テーブル / ホームへ戻る / 誤答した問題だけ復習
一覧: 分野・難易度セレクト / 件数 / 各行にマーク回数 / 詳細（正解ハイライト・解説・マーク編集）
終了ボタン: desktop は save→close、browser は save→/api/shutdown→終了画面
旧形式マーク（文字列）の配列への自動移行、localStorage フォールバック
7. Python 側の改修
app.py — html_path を webui/index.html（frozen 時）/ frontend/dist/index.html（開発時）
の順に解決し、webview.start(http_server=True) に変更。Api / storage.py は無変更。
server.py — Handler.__init__ の directory= を frontend/dist に変更。
/api/progress と /api/shutdown、DATA_FILE（= BASE_DIR/progress.json）は無変更。
build.bat — --add-data "index.html;." --add-data "questions.js;." を
--add-data "frontend\dist;webui" に置換。冒頭に npm --prefix frontend run build を追加。
.gitignore — frontend/node_modules/ frontend/dist/ を追加。
README.md — 起動手順に npm --prefix frontend run build を追記、
「問題の追加方法」のパスを frontend/src/data/questions.js に更新。