# Note App

Google Keepを参考に、主要な機能やUIを再現したノートアプリです。

ReactとTypeScriptを使用したフロントエンドと、Django REST Frameworkを使用したバックエンドで構成しています。

## 主な機能

- ユーザー登録・ログイン・ログアウト
- ノートの作成・編集・削除
- ノートの検索
- ラベルによるノートの分類
- ノートのお気に入り登録・ピン留め
- ノートへの画像添付
- ノートの色変更
- ノートの変更履歴の確認
- ゴミ箱・ノートの復元
- ドラッグ＆ドロップによる並び替え
- カレンダーによるノートの確認

## 使用技術

### フロントエンド

- React
- TypeScript
- Zustand
- React Router
- dnd-kit
- Vitest
- Testing Library

### バックエンド

- Python
- Django
- Django REST Framework
- SQLite
- Pillow
- Simple JWT

### インフラ・開発環境

- Docker
- Docker Compose
- Nginx
- Gunicorn
- GitHub Actions
- Docker Hub

## システム構成

```text
Browser
   |
   v
Nginx (Frontend)
   |
   | API Request
   v
Django REST Framework (Backend)
   |
   v
SQLite (Database)
```

- フロントエンドはNginxで配信
- Nginxを経由してバックエンドのAPIにアクセス
- バックエンドはDjango REST FrameworkでAPIを提供
- データベースにはSQLiteを使用
- Docker Composeで各コンテナを管理
- Docker Hubで公開したDockerイメージを使用

## 起動方法

このアプリはDockerを使用して、各自のPC上で動作させる構成です。

### 必要なもの

- Git
- Docker Desktop（Docker Composeを含む）
- インターネット接続

### 起動手順

#### 1. リポジトリをクローン

```powershell
git clone https://github.com/ukitahide-dev/note-app.git
cd note-app
```

#### 2. 環境変数ファイルを作成

```powershell
Copy-Item .env.example .env
```

#### 3. Djangoの秘密鍵を生成

```powershell
docker run --rm python:3.12-slim python -c "import secrets; print(secrets.token_urlsafe(50))"
```

生成された秘密鍵を `.env` の `DJANGO_SECRET_KEY` に設定してください。

#### 4. データ保存用ファイル・ディレクトリを作成

```powershell
New-Item backend/db.sqlite3 -ItemType File
New-Item backend/media -ItemType Directory -Force
```

#### 5. Docker Hubからイメージを取得

```powershell
docker compose -f compose.prod.yaml pull
```

#### 6. コンテナを起動

```powershell
docker compose -f compose.prod.yaml up -d
```

#### 7. データベースのマイグレーションを実行

```powershell
docker compose -f compose.prod.yaml exec backend python manage.py migrate
```

#### 8. アプリにアクセス

ブラウザで以下のURLにアクセスしてください。

http://localhost

### 停止方法

コンテナを停止する場合は、以下を実行してください。

```powershell
docker compose -f compose.prod.yaml down
```

データベースや画像ファイルはPC側に保存されるため、コンテナを停止・削除しても保持されます。

## テスト

### フロントエンド

frontendディレクトリに移動して、依存パッケージをインストールします。

```powershell
cd frontend
npm ci
```

テストを実行します。

```powershell
npm run test -- --run
```

### バックエンド

リポジトリのルートディレクトリに戻り、backendディレクトリに移動します。

```powershell
cd ..
cd backend
```

依存パッケージをインストールします。

```powershell
pip install -r requirements.txt
```

テスト実行に必要な環境変数を設定します。

```powershell
$env:DJANGO_SECRET_KEY="ci-test-secret-key"
```

テストを実行します。

```powershell
python manage.py test
```

## CI/CD

GitHub Actionsを使用して、継続的インテグレーション（CI）とDockerイメージのビルド・公開を自動化しています。

GitHubへのPushをトリガーとして、以下を自動実行します。

- フロントエンドの依存パッケージのインストール
- フロントエンドのテスト（Vitest）
- フロントエンドのビルド
- バックエンドの依存パッケージのインストール
- バックエンドのテスト（Django）
- Dockerイメージのビルド
- Docker HubへのDockerイメージのPush

フロントエンドとバックエンドのテストが両方成功した場合のみ、DockerイメージのビルドとPushを実行します。

公開したDockerイメージは、Docker Hubから取得して利用できます。

## 環境変数

バックエンドの動作に必要な環境変数は、リポジトリのルートディレクトリにある `.env` ファイルで管理します。

| 環境変数 | 説明 |
| --- | --- |
| `DJANGO_SECRET_KEY` | Djangoで使用する秘密鍵 |
| `DJANGO_ALLOWED_HOSTS` | Djangoへのアクセスを許可するホスト |
| `DJANGO_CORS_ALLOWED_ORIGINS` | クロスオリジン通信を許可する接続元 |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | CSRF保護で信頼する接続元 |

`.env.example` をコピーして `.env` を作成し、`DJANGO_SECRET_KEY` には生成した秘密鍵を設定してください。

`.env` はGitの管理対象外です。秘密鍵などの機密情報をGitHubに公開しないようにしてください。
