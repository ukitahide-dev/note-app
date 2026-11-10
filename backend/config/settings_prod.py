# Djangoの開発用設定を引き継いで、本番環境で必要な設定だけを変更するファイル。

"""
Production settings.
Inherit the base settings and override production-specific values.
"""

import os

from .settings import *    # 同じ config フォルダにある settings.py から、設定をまとめて読み込む。


# ---- Core security ----

DEBUG = False  # 本番では詳細なデバッグ情報を表示しない。本番では情報漏えいを防ぐため、通常 False にする。


ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ["DJANGO_ALLOWED_HOSTS"].split(",")
    if host.strip()
]


# ---- CORS / CSRF ----

CORS_ALLOWED_ORIGINS = [   # ブラウザが別オリジンのAPIレスポンスを利用できるようにするための許可設定。CORS: Cross-Origin Resource Sharing。オリジン間リソース共有。CORS_ALLOWED_ORIGINS。どこから来たアクセスを許可するか。Django側が「このオリジンからブラウザ経由で来たリクエストについては、CORS上のアクセスを許可する」と指定する。リクエスト元のReactのオリジンを書く。
    origin.strip()
    for origin in os.environ["DJANGO_CORS_ALLOWED_ORIGINS"].split(",")
    if origin.strip()
]

CSRF_TRUSTED_ORIGINS = [   # CSRF保護において、信頼する送信元のオリジンを指定する設定。
    origin.strip()
    for origin in os.environ["DJANGO_CSRF_TRUSTED_ORIGINS"].split(",")
    if origin.strip()
]


# ---- Static files ----
# Djangoが本番環境で使用する静的ファイル（CSS・JavaScript・画像など）を、どこに集めて保存するかを指定する設定

STATIC_URL = "/static/"    # 静的ファイルにアクセスするときに使うURLの先頭部分を指定している。例えば、CSSファイルが css/style.css なら、URLは、/static/css/style.cssになる。


# STATIC_ROOT は、Djangoが本番環境で使用する静的ファイルを一か所に集めて保存するフォルダの場所を指定する設定。
STATIC_ROOT = BASE_DIR / "staticfiles"   # Djangoが静的ファイルを集めて保存するフォルダの場所を指定している設定。Djangoプロジェクトがコンテナ内で /app に置かれているとする。この場合、BASE_DIRは /app を表す。だから、BASE_DIR / "staticfiles"は、/app/staticfilesというフォルダの場所になる。Djangoに「静的ファイルを /app/staticfiles に保存してね」と指定している。
