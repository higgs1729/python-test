#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""データ分析試験 模擬問題集 ローカルサーバ

静的ファイル(index.html 等)を配信し、学習データ(成績・マーク)を
このフォルダ内の progress.json に保存する。
ブラウザの localStorage ではなく python-test フォルダに保存されるため、
バックアップやGit管理、別PCへの持ち運びが容易になる。

使い方:
    python server.py
    → ブラウザで http://localhost:8000/ を開く
    → 終了は Ctrl+C
"""
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "progress.json")
PORT = 8000
EMPTY = {"stats": {}, "flags": {}}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 配信ルートをこのスクリプトのあるフォルダに固定
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _load(self):
        if not os.path.exists(DATA_FILE):
            return dict(EMPTY)
        try:
            with open(DATA_FILE, encoding="utf-8") as f:
                data = json.load(f)
            return {"stats": data.get("stats", {}), "flags": data.get("flags", {})}
        except (OSError, json.JSONDecodeError):
            return dict(EMPTY)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/progress":
            self._send_json(self._load())
            return
        super().do_GET()

    def do_POST(self):
        path = self.path.split("?")[0]
        if path == "/api/shutdown":
            self._send_json({"ok": True})
            # ハンドラ内から直接 shutdown() するとデッドロックするため別スレッドで停止
            threading.Thread(target=self.server.shutdown, daemon=True).start()
            return
        if path != "/api/progress":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw.decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            self._send_json({"ok": False, "error": "invalid json"}, 400)
            return
        out = {"stats": data.get("stats", {}), "flags": data.get("flags", {})}
        # 一時ファイルに書いてから置換(書き込み途中の破損を防ぐアトミック更新)
        tmp = DATA_FILE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        os.replace(tmp, DATA_FILE)
        self._send_json({"ok": True})

    def log_message(self, *args):
        pass  # アクセスログは出さない


def main():
    os.chdir(BASE_DIR)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("データ分析試験 模擬問題集サーバを起動しました。")
    print(f"  → ブラウザで http://localhost:{PORT}/ を開いてください。")
    print(f"  → 学習データの保存先: {DATA_FILE}")
    print("  → 終了するには Ctrl+C を押してください。")
    try:
        server.serve_forever()
        # アプリの「終了」ボタンから shutdown された場合はここに到達する
        print("サーバを停止しました。この画面は閉じて構いません。")
    except KeyboardInterrupt:
        print("\nサーバを停止しました。")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
