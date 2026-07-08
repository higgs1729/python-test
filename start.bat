@echo off
rem データ分析試験 模擬問題集 起動用
rem ブラウザを開いてローカルサーバを起動する。終了はこの画面で Ctrl+C。
cd /d "%~dp0"
start "" http://localhost:8000/
python server.py
pause
