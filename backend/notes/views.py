from django.shortcuts import render

# Create your views here.
# ④ .gitignore 作成（超重要）

# プロジェクト直下に：

# .gitignore

# 作る。

# 中身
# venv/
# node_modules/
# __pycache__/
# db.sqlite3
# .env

# 。

# なぜ必要？

# これらをGitHubへ上げると：

# 重い
# 危険
# 不要

# だから。


# ⑤ GitHubで新しいRepository作成

# GitHubサイトで：

# New repository

# 押す。

# 例えば名前：

# memo-app

# 。

# README は無しでOK

# 最初は空でOK。


# ⑥ GitHubのURLコピー

# 例えば：

# https://github.com/あなた/memo-app.git

# 。

# ⑦ Gitへ接続

# VS Codeターミナル：

# git remote add origin GitHubのURL

# 。

# 例えば：

# git remote add origin https://github.com/uki/memo-app.git

# 。


# ⑧ 保存したいファイル追加
# git add .
# 。


# ⑨ commit
# git commit -m "initial setup"

# 。

# ⑩ GitHubへ送信
# git push -u origin main

# 。

# もし main エラーなら：

# git branch -M main
# git push -u origin main

# 。

# 以後の流れ

# コード書く
# ↓
# 保存したい

# git add .
# git commit -m "add note model"
# git push

# 。

# commitとは？
# セーブポイント

# みたいなもの。

# pushとは？
# GitHubへアップロード

# 。

# 実務でもほぼこれ
# コード書く
# ↓
# commit
# ↓
# push

# を繰り返す 👍
