
# どんな環境を土台にして Docker 環境を作るかを指定。
FROM node:22-alpine

# Docker 内で作業するディレクトリを /app に決める。ここで決める /app は Windows 側のフォルダではなく、Docker 内のフォルダ。この後の COPY や RUN などは、基本的にこの /app を作業場所として進んでいく。
WORKDIR /app

# Windows 側のフロントエンドにある package.json などを、Docker 内の /app にコピーする命令。COPY コピー元 コピー先。　./ ： コピー先。現在の作業ディレクトリである /app を指す。
COPY package*.json ./

# Docker イメージを作る途中で npm install を実行する命令。必要なパッケージをインストールする。
RUN npm install

# ビルド時のコピー元ディレクトリにあるファイルを、Docker 内の作業ディレクトリへコピーする。最初の .	ビルド対象のディレクトリ（今回なら frontend）。2つ目の .	Docker 内の現在の作業ディレクトリ（/app）。
COPY . .

# このコンテナのアプリが 5173 番ポートを使う想定であることを示す命令。外部からアクセスできるようにするには、後で compose.yaml などにポートの対応関係を設定する必要がある。
EXPOSE 5173

# コンテナを起動したときに、どのコマンドを実行するかを指定するもの。
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
