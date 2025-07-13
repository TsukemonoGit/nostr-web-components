[[EN](./README.md)/JA]

# Nostr Web Components

Webアプリケーションに簡単にNostrプロトコル機能を統合できる、軽量で使いやすいWeb Componentsライブラリです。

## インストール

### 方法1: CDN（クイックスタートに推奨）

```html
<script src="https://cdn.jsdelivr.net/npm/@konemono/nostr-web-components@latest/dist/nostr-web-components.iife.min.js"></script>
```

### 方法2: NPMパッケージ

```bash
npm install @konemono/nostr-web-components
```

その後、JavaScriptでインポートします：

```javascript
import '@konemono/nostr-web-components';
```

## 使用方法

### `<nostr-container>`を使用した基本セットアップ

`<nostr-container>`コンポーネントは、子コンポーネントにリレー設定を共有する方法を提供します。

#### CDNを使用する場合

```html
<!DOCTYPE html>
<html>
	<head>
		<script src="https://cdn.jsdelivr.net/npm/@konemono/nostr-web-components@latest/dist/nostr-web-components.iife.min.js"></script>
	</head>
	<body>
		<nostr-container relays='["wss://relay.damus.io", "wss://nos.lol"]'>
			<nostr-note id="note1abc..."></nostr-note>
			<nostr-profile id="npub1xyz..."></nostr-profile>
			<nostr-list filters='[{"kinds":[1],"limit":10}]'></nostr-list>
		</nostr-container>
	</body>
</html>
```

#### NPMを使用する場合

```javascript
// main.js
import '@konemono/nostr-web-components';

// これでHTMLでコンポーネントを使用できます
```

```html
<nostr-container relays='["wss://relay.damus.io", "wss://nos.lol"]'>
	<nostr-note id="note1abc..."></nostr-note>
	<nostr-profile id="npub1xyz..."></nostr-profile>
	<nostr-list filters='[{"kinds":[1],"limit":10}]'></nostr-list>
</nostr-container>
```

### `<nostr-container>`を使用しない個別コンポーネントの使用

各コンポーネントは**共有されたグローバルクライアントインスタンス**に内部的にアクセスすることで独立して動作します。そのため、`<nostr-container>`は**オプション**です。例えば、単一のノートを表示する場合：

```html
<nostr-note id="note1abc..."></nostr-note>
```

この場合、ノートはグローバルクライアントが内部的に管理するデフォルトのリレーリストを使用して取得されます。

### コンポーネントごとのリレーの上書き

個別のコンポーネントでrelays属性を指定することで、コンテナやグローバルリレー設定を一時的に上書きできます：

```html
<nostr-note id="note1abc..." relays='["wss://relay.damus.io"]'></nostr-note>
<nostr-profile id="npub1xyz..." relays='["wss://nos.lol"]'></nostr-profile>
<nostr-list filters='[{"kinds":[1],"limit":10}]' relays='["wss://relay.damus.io"]'></nostr-list>
```

### `<nostr-container>`に関する重要な注意事項

- 複数の`<nostr-container>`インスタンスが存在できますが、**すべてのコンポーネントは内部的に単一のグローバルクライアントを共有します**。
- コンテナは主に子コンポーネントにコンテキスト経由でリレー設定を伝播するために使用されます。
- コンテナ内のリレー設定は、独立したまたは分離されたNostrクライアントを作成**しません**。
- 分離されたクライアントや複数のリレーセットが必要な高度なユースケースでは、JavaScript APIを使用してクライアントをプログラム的に管理することを検討してください。

---

## コンポーネント

### `<nostr-container>`

コンテキスト経由で子コンポーネントにリレー設定を提供するコンテナコンポーネントです。これは**オプション**で、主に複数の子コンポーネントでリレー設定を繰り返し記述することを避けるために使用されます。

属性：

- relays: リレーURLのJSON配列

### `<nostr-note>`

Nostrノートを表示します。

属性：

- id: ノートID（note1...またはnevent1...形式）
- nevent: id属性の代わりに使用するnevent形式
- relays: オプションのリレー設定（コンテナを上書き）
- href: カスタムURLテンプレート（{id}プレースホルダーを使用）
- target: リンクのtarget属性（デフォルト: \_blank）
- noLink: リンク機能を無効にするブール値
- theme: テーマモード - light、dark、またはauto（デフォルト）
- height: ノートコンテナのカスタム高さ

例：

基本的なノート

```html
<nostr-note id="note1abc..."></nostr-note>
```

カスタムURLテンプレート

```html
<nostr-note id="note1abc..." href="https://njump.me/{id}"></nostr-note>
```

ダークテーマ

```html
<nostr-note id="note1abc..." theme="dark"></nostr-note>
```

リンク機能なし

```html
<nostr-note id="note1abc..." noLink="true"></nostr-note>
```

### `<nostr-profile>`

Nostrプロフィールを表示します。

属性：

- id: プロフィールID（npub1...形式）
- relays: オプションのリレー設定（コンテナを上書き）
- href: カスタムURLテンプレート（動的URLには{id}プレースホルダーを使用）
- target: リンクのtarget属性（デフォルト: \_blank）
- onclick: クリック時に実行するJavaScriptコード
- noLink: リンク機能を無効にするブール値
- display: 表示モード - card（デフォルト）、compact、またはname

例：

基本的なプロフィールカード

```html
<nostr-profile id="npub1xyz..."></nostr-profile>
```

カスタムURLテンプレート

```html
<nostr-profile id="npub1xyz..." href="https://primal.net/p/{id}"></nostr-profile>
```

異なる表示モード

```html
<nostr-profile id="npub1xyz..." display="compact"></nostr-profile>
<nostr-profile id="npub1xyz..." display="name"></nostr-profile>
```

リンク機能なし

```html
<nostr-profile id="npub1xyz..." noLink="true"></nostr-profile>
```

カスタムクリックハンドラー

```html
<nostr-profile id="npub1xyz..." onclick="console.log('Profile clicked')"></nostr-profile>
```

### `<nostr-list>`

フィルターに基づいてNostrイベントのリストを表示します。

属性：

- filters: Nostrフィルター配列のJSON文字列
- relays: オプションのリレー設定（コンテナを上書き）
- theme: テーマモード - light、dark、またはauto（デフォルト）
- limit: 取得するイベントの最大数（デフォルト: 50）

例：

基本的なタイムライン

```html
<nostr-list filters='[{"kinds":[1],"limit":10}]'></nostr-list>
```

特定の作者からの投稿

```html
<nostr-list filters='[{"kinds":[1],"authors":["npub1xyz..."],"limit":5}]'></nostr-list>
```

複数のフィルター

```html
<nostr-list filters='[{"kinds":[1],"limit":10},{"kinds":[6],"limit":5}]'> </nostr-list>
```

カスタムリレーとテーマ

```html
<nostr-list
	filters='[{"kinds":[1],"limit":20}]'
	relays='["wss://relay.damus.io"]'
	theme="dark"
	limit="30"
>
</nostr-list>
```

## フィルター例

`<nostr-list>`の一般的なフィルターパターン：

```js
// テキストノート（kind 1）
'[{"kinds":[1],"limit":10}]';

// 特定の作者からの投稿
'[{"kinds":[1],"authors":["npub1...","npub2..."],"limit":5}]';

// 特定のハッシュタグを含む投稿
'[{"kinds":[1],"#t":["nostr","bitcoin"],"limit":10}]';

// 過去1時間の投稿
'[{"kinds":[1],"since":' + (Math.floor(Date.now() / 1000) - 3600) + ',"limit":20}]';

// 特定のノートへの返信
('[{"kinds":[1],"#e":["note1abc..."],"limit":10}]');

// 複数のkind
('[{"kinds":[1,6,7],"limit":15}]');
```

## 開発

```bash
npm install
npm run build
npm run dev # ウォッチモード
npm run serve # 開発サーバー
```

## ライセンス

MIT
