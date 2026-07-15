# インストーラー化 実装手順書（保留中タスク）

デスクトップアプリ（`app.py` / pywebview）を Windows インストーラー（`setup.exe`）化するための
確定手順。**いま着手する必要はなく、必要になったらこの文書どおりに進める。**

## 確定した方針
| 項目 | 決定 |
|---|---|
| インストーラーツール | **Inno Setup**（無料・`.iss`スクリプト） |
| 実装範囲 | **一式**（コード変更＋ `.iss` 作成＋コンパイル・検証まで） |
| インストール範囲 | **per-user**（管理者権限不要・`%LOCALAPPDATA%` にインストール） |
| 学習データ保存先 | **`%LOCALAPPDATA%\データ分析試験\progress.json`**（Program Filesではないが、per-userでも統一して外出しにする） |
| PyInstaller形式 | **onedir**（`--onedir`。起動が速くインストーラー向き） |
| コード署名 | 当面**なし**（初回起動のSmartScreenは「詳細情報→実行」で回避）。広く配布する場合のみ後日検討 |

## 前提
- 既存の `app.py` / `storage.py` / `index.html` / `questions.js` / `icon.ico` が揃っていること
- `pip install pywebview pyinstaller`（`requirements.txt`）済み
- Inno Setup 本体（未導入。導入は下記ステップ4）

---

## ステップ

### 1. `storage.py` の保存先を APPDATA 対応にする
インストール版はexe隣接に書けない場合があるため、`%LOCALAPPDATA%` へ保存する。
**開発時（未フリーズ）は従来どおりスクリプト隣接**、という分岐にすると安全。

`storage.py` の `base_dir()` を以下に置き換える想定：

```python
def base_dir():
    """progress.json を置くフォルダを返す。
    - PyInstaller で凍結(インストール版など): %LOCALAPPDATA%\データ分析試験
    - 開発時(python app.py): このスクリプトの場所
    """
    if getattr(sys, "frozen", False):
        root = os.environ.get("LOCALAPPDATA") or os.path.expanduser("~")
        d = os.path.join(root, "データ分析試験")
        os.makedirs(d, exist_ok=True)
        return d
    return os.path.dirname(os.path.abspath(__file__))
```

> 注意: 現状の `storage.py` は frozen 時に `os.path.dirname(sys.executable)`（exe隣接）に保存する。
> インストーラー化する際に上記へ差し替える。単一exe(onefile)運用を残したい場合は、
> onefile用と分ける／環境変数で切替、等の検討が必要。

### 2. `build.bat` を onedir 化
`--onefile` を `--onedir` に変更（他はほぼ同じ）。生成物は `dist\データ分析試験\`（フォルダ一式）。

```bat
python -m PyInstaller --noconfirm --onedir --windowed ^
  --name "データ分析試験" ^
  --icon icon.ico ^
  --add-data "index.html;." ^
  --add-data "questions.js;." ^
  app.py
```

ビルド後、`dist\データ分析試験\データ分析試験.exe` が単体で起動することを確認する。

### 3. WebView2 ランタイム対応（任意だが推奨）
Win10/11はほぼ標準搭載。確実にするなら WebView2 Bootstrapper を「未導入時のみ」実行する。
- 方式A（オンライン）: Microsoft配布の `MicrosoftEdgeWebview2Setup.exe` を同梱し、`.iss` の `[Run]` で実行
- 方式B（判定）: レジストリ `HKCU\Software\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}` の有無で判定してから実行
- 未対応でも大半の環境では動くため、初版では省略可

### 4. Inno Setup の導入
- https://jrsoftware.org/isdl.php から Inno Setup をインストール（GUIインストーラー）
- インストール後、`ISCC.exe`（コンパイラ）が使えるようになる（例: `C:\Program Files (x86)\Inno Setup 6\ISCC.exe`）

### 5. `installer.iss` を作成（per-user 版テンプレート）
プロジェクト直下に `installer.iss` を置く。ポイントは
`PrivilegesRequired=lowest`（管理者不要）と `{userpf}` / `{autopf}` ではなく per-user 既定を使うこと。

```ini
[Setup]
AppName=データ分析試験 模擬問題集
AppVersion=1.0.0
AppPublisher=（発行者名）
DefaultDirName={userappdata}\Programs\データ分析試験
DefaultGroupName=データ分析試験
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputBaseFilename=データ分析試験_setup
SetupIconFile=icon.ico
Compression=lzma2
SolidCompression=yes
WizardStyle=modern

[Files]
; onedir 出力フォルダを丸ごと取り込む
Source: "dist\データ分析試験\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\データ分析試験"; Filename: "{app}\データ分析試験.exe"
Name: "{userdesktop}\データ分析試験"; Filename: "{app}\データ分析試験.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "デスクトップにショートカットを作成"; GroupDescription: "追加タスク:"

[Run]
Filename: "{app}\データ分析試験.exe"; Description: "起動する"; Flags: nowait postinstall skipifsilent
```

補足:
- 学習データは `%LOCALAPPDATA%\データ分析試験\progress.json`（ステップ1）に保存されるため、
  アンインストールしても成績は残る。完全削除したい場合は `[UninstallDelete]` で消す設計も可能。

### 6. コンパイル → `setup.exe` 生成
```bat
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
```
→ `Output\データ分析試験_setup.exe` が生成される。

### 7. 検証チェックリスト
- [ ] `setup.exe` を実行 → 管理者権限を求められず（per-user）インストールできる
- [ ] スタートメニュー／デスクトップのショートカットから起動できる
- [ ] 問題を解く → 終了 → 再起動で成績が復元される（APPDATAに保存）
- [ ] `%LOCALAPPDATA%\データ分析試験\progress.json` が生成されている
- [ ] コントロールパネル／設定からアンインストールできる
- [ ] （任意）別のクリーンなPCでも起動する（WebView2の有無を確認）

### 8.（任意）コード署名
未署名だと初回起動で SmartScreen 警告。広く配布するなら、コードサイニング証明書（有償）で
`データ分析試験.exe` と `setup.exe` に署名する。個人利用なら省略可。

---

## .gitignore への追記（実施時）
インストーラー生成物を除外する:
```
Output/
*.exe
```
（ただし配布物としてexeを含めたい場合は個別に管理）

## 参考: 関連ファイル
- `app.py` … pywebview 起動役
- `storage.py` … 保存ロジック（ステップ1で改修）
- `build.bat` … PyInstaller ビルド（ステップ2で onedir 化）
- `installer.iss` … Inno Setup スクリプト（ステップ5で新規作成）
- `icon.ico` … アイコン
