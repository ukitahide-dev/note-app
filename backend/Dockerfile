# ---- pythonの土台を用意する----

# Python 3.12 が入った軽量なイメージを土台にする
FROM python:3.12-slim


# ---- 設定・作業場所を準備する -----

# Python が .pyc ファイルを作らないようにする。Python は実行時に .pyc というファイルを作ることがある。この設定は、そのファイルを作らないようにするもの
ENV PYTHONDONTWRITEBYTECODE=1

# Python のログをバッファにためず、すぐ出力する。Python の出力をすぐ表示できるようにする。
ENV PYTHONUNBUFFERED=1

# コンテナ内で作業するフォルダを /app にする。このあとの COPY や RUN などは、基本的にこのフォルダを基準に処理される。
WORKDIR /app


# ---- 必要なパッケージとアプリを入れる ----

# パソコン側の requirements.txt をコンテナ内の /app にコピーする。. は、ここでは WORKDIR で指定した /app を意味する。
COPY requirements.txt .

# requirements.txt に記載された Python パッケージをインストールする
RUN pip install --no-cache-dir -r requirements.txt

# backend フォルダのファイルをコンテナ内の /app にコピーする。COPY . . は「コピー元からコピー先へ」という命令。左が元、右が先。
# 左側の .：コピー元。今回なら backend フォルダ。右側の .：コピー先。WORKDIR /app で指定したコンテナ内の /app。
COPY . .


# ---- 起動方法を指定する ----

# このコンテナのアプリが、通常は 8000番ポートで通信を受け付ける想定だと宣言する。
EXPOSE 8000


# コンテナ起動時に Django の開発用サーバーを起動する。
# 0.0.0.0 はコンテナの外側(Windowsのパソコンやブラウザ)からも接続できるようにするための指定。127.0.0.1:8000は、Django が動いているコンテナ自身からの接続だけを受け付ける設定。今までパソコンで実行していた、python manage.py runserver。違いは、今回は、これをコンテナ内で実行すること。
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

