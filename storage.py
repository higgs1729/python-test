# -*- coding: utf-8 -*-
"""学習データ(成績・マーク)の読み書き。

デスクトップアプリ(pywebview)から js_api として公開して使う。
保存先は「実行ファイル(または app.py)と同じフォルダ」の progress.json。
PyInstaller の onefile では実行時に一時フォルダへ展開されるため、
sys.frozen を見て .exe 本体の場所を保存先に使う(成績が消えないように)。
"""
import json
import os
import sys

EMPTY = {"stats": {}, "flags": {}}


def base_dir():
    """progress.json を置くフォルダ(exe本体 / スクリプトの場所)を返す。"""
    if getattr(sys, "frozen", False):
        # PyInstaller onefile: 実行ファイル本体の場所
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


def data_file():
    return os.path.join(base_dir(), "progress.json")


class Storage:
    """pywebview の js_api として公開するAPI。JSから load()/save() を呼ぶ。"""

    def load(self):
        path = data_file()
        if not os.path.exists(path):
            return dict(EMPTY)
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            return {"stats": data.get("stats", {}), "flags": data.get("flags", {})}
        except (OSError, json.JSONDecodeError):
            return dict(EMPTY)

    def save(self, data):
        if not isinstance(data, dict):
            return {"ok": False}
        out = {"stats": data.get("stats", {}), "flags": data.get("flags", {})}
        path = data_file()
        tmp = path + ".tmp"
        try:
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(out, f, ensure_ascii=False, indent=2)
            os.replace(tmp, path)  # アトミック更新
            return {"ok": True}
        except OSError:
            return {"ok": False}
