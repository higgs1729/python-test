# データ分析試験 模擬問題集アプリ

Python3エンジニア認定 **データ分析試験** 対策用の、ローカルで動く自習アプリです。

画面は React + shadcn/ui（隣リポジトリ `react-shadcn` のデザインシステムに準拠）で作られており、
`frontend/` を Vite でビルドした成果物 `frontend/dist` を、デスクトップアプリまたはローカルサーバが表示します。
学習データ（成績・マーク）はいずれも `progress.json` に保存され、環境をまたいで共有できます
（ブラウザ直開き時のみ localStorage）。

## 準備（初回のみ）

```
npm --prefix frontend ci     # 依存の導入
npm --prefix frontend run build
```

`frontend/dist` が無い状態で `app.py` / `server.py` を起動すると、ビルドを促して終了します。
画面のコードを変更したら都度 `npm --prefix frontend run build` を実行してください
（開発中は `npm --prefix frontend run dev` で http://localhost:5173 のホットリロードも使えます。
このとき `/api/*` は起動中の `server.py` にプロキシされます）。

## 使い方

### A. デスクトップアプリ（推奨・配布可）
ネイティブウィンドウで起動します。外部のブラウザは不要。

- **開発時に動かす**：`pip install -r requirements.txt` の後、`python app.py`
- **配布用の単一exeを作る**：`build.bat` をダブルクリック → 画面をビルドしたうえで
  `dist\データ分析試験.exe` が生成されます。
  この exe は **Python / Node 未インストールのPCでもそのまま動作**します（Windows 10/11 標準の Edge WebView2 を使用）。
  学習データ `progress.json` は **exe と同じフォルダ**に保存されます。
- 終了は画面右上の「⏻ 終了」ボタン、またはウィンドウを閉じるだけ。

### B. ブラウザ運用（テスト用）: `start.vbs` をダブルクリック
- `server.py` が起動し、既定ブラウザで開きます。成績はフォルダ内 `progress.json` に保存。
- 終了は画面右上の「⏻ 終了」ボタン（サーバも停止します）。

## 問題の追加方法
`frontend/src/data/questions.js` の `QUESTIONS` 配列に、次の形式で追記します。
```js
{
  id: 46,               // 一意の番号
  cat: "pandas",        // 分野キー(下表)
  level: "A",           // 難易度 A(基礎) / B(応用) / C(発展)
  q: "問題文",
  choices: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
  answer: 0,            // 正解の選択肢インデックス(0〜3)
  exp: "解説文",
  choiceExp: ["Aの解説", "Bの解説", "Cの解説", "Dの解説"]  // 任意
}
```
分野キー: `role / env / pybase / math / numpy / pandas / plot / ml / data`

追記後は `npm --prefix frontend run build` で反映されます。

## 構成

| パス | 役割 |
| --- | --- |
| `app.py` | デスクトップアプリ本体（pywebview。内蔵HTTPサーバで `frontend/dist` を表示） |
| `server.py` | ブラウザ運用用のローカルサーバ（静的配信 + `/api/progress`） |
| `storage.py` | `progress.json` の読み書き（pywebview の js_api として公開） |
| `frontend/src/data/questions.js` | 問題データ |
| `frontend/src/components/ui/` | shadcn/ui（`react-shadcn` からのコピー。**編集しない**） |
| `frontend/src/globals.css` | デザイントークン（`react-shadcn` の `app/globals.css` 由来） |
| `frontend/src/features/` | 画面（ホーム / 出題 / 一覧 / 結果 / 解答履歴） |

## 注意・免責
- 本アプリの問題は **すべて学習用のオリジナル問題** です。公式の過去問や各社模擬試験の複製ではありません。
- 出題範囲は『Pythonによるあたらしいデータ分析の教科書 第2版』（翔泳社）に準拠しています。
- 本番形式の腕試しには、無料の公式・準公式模擬試験サイト（PRIME STUDY / PyQ / ExamApp / DIVE INTO EXAM）の併用を推奨します。
