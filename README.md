# Stock Moving Averages Visualization

A React-based web application for visualizing stock moving averages and detecting lowest slope points, converted from the original Streamlit application.

## 🚀 Features

- **Real-time Stock Data**: Fetches data from Yahoo Finance API
- **Moving Averages**: Calculates and displays 120-day and 200-day moving averages
- **Slope Analysis**: Identifies and marks lowest slope points for trend analysis
- **Interactive Charts**: Built with Plotly.js for responsive data visualization
- **Multiple Time Periods**: Support for 1, 3, 5, 10 years, or maximum historical data
- **Quick Stock Selection**: Popular tickers (AAPL, GOOGL, MSFT, TSLA, QQQ, SPY)

## 📊 Live Demo

Visit: [https://jeonck.github.io/stock-moving-average/](https://jeonck.github.io/stock-moving-average/)

## 🛠 Technology Stack

- **Frontend**: React 18 + Vite
- **Charts**: Plotly.js + react-plotly.js
- **Data**: Yahoo Finance API with CORS proxy fallback
- **Styling**: Pure CSS with responsive design
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
├── yfiance-ma.py          # Original Streamlit application
├── requirement.txt        # Python dependencies for original app
├── CLAUDE.md             # Development documentation
└── react-app/           # React application
    ├── src/
    │   ├── components/   # React components
    │   ├── services/     # Data fetching logic
    │   └── assets/       # Static assets
    ├── public/           # Public files
    └── dist/            # Production build
```

## 🚀 Quick Start

### Development

```bash
cd react-app
npm install
npm run dev
```

### Production Build

```bash
cd react-app
npm run build
npm run preview
```

## 📈 Usage

1. Enter a stock ticker (e.g., AAPL, GOOGL, MSFT)
2. Select the time period (1-10 years or max)
3. Click "Load Data" to fetch and display the chart
4. View moving averages and lowest slope points marked on the chart

## 🔧 Data Sources

- **Primary**: Yahoo Finance API (direct CSV access via CORS proxy)
- **Fallback**: Alpha Vantage API (requires free API key)

## 📊 Technical Analysis Features

- **120-day Moving Average**: Red line with lowest slope point marked as circle
- **200-day Moving Average**: Blue line with lowest slope point marked as star
- **Price Action**: Gray line showing closing prices
- **Signal Detection**: Automatically identifies and marks trend reversal points

## 🚀 Deployment

This application is configured for GitHub Pages deployment with GitHub Actions:

1. Push code to `main` branch
2. GitHub Actions automatically builds and deploys to `gh-pages` branch
3. Application is available at your GitHub Pages URL

## 📄 License

MIT License - see original Streamlit application for reference implementation.

## 🔄 Version History

- **v1.0**: React conversion with full feature parity to Streamlit original
- **Original**: Python Streamlit application with yfinance integration