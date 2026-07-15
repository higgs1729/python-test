@echo off
rem データ分析試験 模擬問題集 — デスクトップアプリ(.exe)ビルド
rem 生成物: dist\データ分析試験.exe (Python未インストールのPCでも動作)
cd /d "%~dp0"

python -m PyInstaller --noconfirm --onefile --windowed ^
  --name "データ分析試験" ^
  --icon icon.ico ^
  --add-data "index.html;." ^
  --add-data "questions.js;." ^
  app.py

echo.
echo ==========================================================
echo 完了しました。dist\データ分析試験.exe を実行してください。
echo 学習データ(progress.json)は exe と同じフォルダに保存されます。
echo ==========================================================
pause
