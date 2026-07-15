# -*- coding: utf-8 -*-
"""データ分析試験 模擬問題集 — デスクトップアプリ(pywebview)

ネイティブウィンドウに index.html を表示する。学習データ(progress.json)は
js_api 経由で保存するため、HTTPサーバやブラウザは不要。

開発時の起動:  python app.py   (要 pip install pywebview)
配布用exe化 :  build.bat        (PyInstaller)
"""
import os
import sys

import webview

from storage import Storage


def resource_dir():
    """同梱リソース(index.html 等)のフォルダ。onefileでは展開先(_MEIPASS)。"""
    if getattr(sys, "frozen", False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))


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
    html_path = os.path.join(resource_dir(), "index.html")
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
    webview.start()


if __name__ == "__main__":
    main()
