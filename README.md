# Tokyo Weather | 東京天気

[![Live Site]([https://shields.io)](https://github.io](https://aakash-codex.github.io/Tokyo-Weather/))

A beautiful, real-time weather application for Tokyo, Japan with hyper-local weather data and world clock functionality.
日本・東京のリアルタイムな気象データと世界時計機能を備えた、美しいお天気アプリケーションです。

## 🔗 Live Demo / ライブデモ
You can view the live application here / こちらのリンクからライブデモをご覧いただけます:  
👉 https://aakash-codex.github.io/Tokyo-Weather/

---

## 🇺🇸 English Description

### Features
- **Real-time Weather Data**: Displays current temperature, humidity, wind speed, pressure, visibility, UV index, sunrise/sunset times.
- **Weather Animations**: Dynamic particle effects for different weather conditions (rain, snow, sun, clouds, thunderstorm, mist) using Canvas API.
- **World Clock**: Add and track multiple city clocks with real-time updates.
- **Bilingual Support**: Toggle between English and Japanese (日本語).
- **Temperature Units**: Switch between Celsius and Fahrenheit.
- **Hourly & Daily Forecasts**: Interactive charts showing 24-hour temperature and rain probability.
- **Smart Tips**: Weather-specific suggestions for activities and preparations.
- **Beautiful UI**: Modern glassmorphism design with weather-themed gradients.

### Tech Stack
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Canvas API** - Weather particle animations
- **CSS** - Styling with glassmorphism effects

---

## 🇯🇵 日本語説明

### 主な機能
- **リアルタイム気象データ**: 現在の気温、湿度、風速、気圧、視程、UV指数、日の出/日の入り時刻を表示します。
- **お天気アニメーション**: Canvas APIを使用し、天候（雨、雪、晴れ、曇り、雷雨、霧）に応じた動的なパーティクルエフェクトを表示します。
- **世界時計**: 複数の都市の時計を追加し、リアルタイムで時間を追跡できます。
- **バイリンガル対応**: 英語と日本語（日本語）をワンタップで切り替え可能です。
- **温度単位切り替え**: 摂氏（°C）と華氏（°F）を切り替えられます。
- **時間別・日別予報**: 24時間の気温推移と降水確率をインタラクティブなチャートで表示します。
- **スマートアドバイス**: その日の天候に合わせたお出かけの準備やアクティビティの提案を表示します。
- **美しいUI**: 気象テーマに連動したグラデーションと、洗練されたグラスモーフィズム（すりガラス調）デザイン。

### 技術スタック
- **React 19** - UIフレームワーク
- **Vite** - ビルドツール・開発サーバー
- **Canvas API** - 天気パーティクルアニメーション
- **CSS** - グラスモーフィズムエフェクトを用いたスタイリング

---

## 🚀 Getting Started / 始め方

### Installation / インストール
```bash
npm install
```

### Development / 開発環境の起動
```bash
npm run dev
```
The application will be available at / ブラウザで以下にアクセスしてください: `http://localhost:5173`

### Build / 本番用ビルド
```bash
npm run build
```

### Preview / ビルドのプレビュー
```bash
npm run preview
```

### Deployment / デプロイ
```bash
npm run deploy
```

---

## 💡 Usage / 使い方
- Click the weather change button to cycle through different weather conditions.  
  (天候変更ボタンをクリックすると、様々な天候のエフェクトをテストできます。)
- Use the language toggle (top-right) to switch between English and Japanese.  
  (右上の言語トグルを使用して、英語と日本語を切り替えます。)
- Add cities to the world clock using the search bar.  
  (検索バーを使って世界時計に都市を追加できます。)
- Toggle temperature units with the °C/°F button.  
  (°C/°Fボタンで温度の単位を切り替えます。)
- Switch between hourly and daily forecast views using the tabs.  
  (タブを使用して、時間別予報と日別予報の表示を切り替えます。)

## Project Structure / プロジェクト構成
- `src/App.jsx` - Main application component (メインアプリケーションコンポーネント)
- `src/index.css` - Global styles (グローバルスタイル)
- `public/` - Static assets (静的アセット)

## License / ライセンス
MIT
