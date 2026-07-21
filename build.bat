@echo off
rem データ分析試験 模擬問題集 — デスクトップアプリ(.exe)ビルド
rem 生成物: dist\データ分析試験.exe (Python未インストールのPCでも動作)
cd /d "%~dp0"

rem 画面(React/Vite)をビルドして frontend\dist を作る
call npm --prefix frontend run build
if errorlevel 1 (
  echo.
  echo 画面のビルドに失敗しました。frontend\node_modules があるか確認してください。
  pause
  exit /b 1
)

python -m PyInstaller --noconfirm --onefile --windowed ^
  --name "データ分析試験" ^
  --icon icon.ico ^
  --add-data "frontend\dist;webui" ^
  app.py

echo.
echo ==========================================================
echo 完了しました。dist\データ分析試験.exe を実行してください。
echo 学習データ(progress.json)は exe と同じフォルダに保存されます。
echo ==========================================================
pause
