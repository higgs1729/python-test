# -*- coding: utf-8 -*-
"""データ分析試験 模擬問題集 — デスクトップアプリ(pywebview)

ネイティブウィンドウに frontend のビルド成果物を表示する。学習データ
(progress.json)は js_api 経由で保存するため、外部のHTTPサーバやブラウザは不要。

画面は React(Vite)製で ES module を使うため、file:// では CORS により
読み込めない。pywebview 内蔵のHTTPサーバ(http_server=True)経由で配信する。

開発時の起動:  npm --prefix frontend run build && python app.py
配布用exe化 :  build.bat        (PyInstaller)
"""
import os
import sys

import webview

from storage import Storage


def webui_index():
    """表示する index.html のパス。

    exe(onefile)では同梱した webui/ を展開先(_MEIPASS)から、
    開発時は frontend/dist/ から読む。
    """
    if getattr(sys, "frozen", False):
        return os.path.join(sys._MEIPASS, "webui", "index.html")
    base = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base, "frontend", "dist", "index.html")


class Api(Storage):
    """JSに公開するAPI: load()/save()(Storage) に close() を追加。"""

    def __init__(self):
        # 先頭アンダースコアで pywebview のJS公開対象から除外する
        # (public だと Window オブジェクトが再帰的に展開されてエラーになる)
        self._window = None

    def close(self):
        if self._window is not None:
            self._window.destroy()


def main():
    html_path = webui_index()
    if not os.path.exists(html_path):
        sys.exit(
            "画面のビルド成果物が見つかりません:\n"
            f"  {html_path}\n"
            "先に `npm --prefix frontend run build` を実行してください。"
        )
    api = Api()
    window = webview.create_window(
        "データ分析試験 模擬問題集",
        url=html_path,
        js_api=api,
        width=880,
        height=1000,
        min_size=(600, 700),
    )
    api._window = window
    # ES module を読むため file:// ではなく内蔵HTTPサーバ経由で配信する
    webview.start(http_server=True)


if __name__ == "__main__":
    main()
