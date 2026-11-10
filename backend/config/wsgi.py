# wsgi.py は、GunicornとDjangoを接続するためのファイル。
# GunicornはDjango専用のサーバーではないので、
# 「どのDjangoアプリケーションを動かせばいいのか」を教える必要がある。
# その接続口になるのが、この wsgi.py 。
# WSGI（Web Server Gateway Interface）は、WebサーバーとPythonのWebアプリケーションを接続するための共通ルール。


"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')    # 環境変数 DJANGO_SETTINGS_MODULE がまだ設定されていなければ、config.settings を設定するという意味。つまり、Djangoに対して、「どの設定ファイルを使って起動するのか？」を教えている。

application = get_wsgi_application()    # DjangoのWSGIアプリケーションを取得して、application という変数に代入している。
