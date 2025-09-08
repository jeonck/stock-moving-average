import { useState, useCallback, useEffect } from 'react'
import StockChart from './components/StockChart'
import StockControls from './components/StockControls'
import StockAnalysis from './components/StockAnalysis'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import APISettings from './components/APISettings'
import stockDataService from './services/stockDataService'
import './App.css'

function App() {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTicker, setCurrentTicker] = useState('')
  const [currentPeriod, setCurrentPeriod] = useState('')
  const [showAPISettings, setShowAPISettings] = useState(false)

  // 앱 초기화
  useEffect(() => {
    checkAPIStatus()
  }, [])

  const checkAPIStatus = async () => {
    try {
      const status = await stockDataService.checkAPIStatus()
      if (status.status === 'error') {
        console.warn('API Status:', status.error)
      }
    } catch (err) {
      console.warn('Failed to check API status:', err.message)
    }
  }

  const loadStockData = useCallback(async (ticker, period) => {
    if (!ticker?.trim()) {
      setError('주식 티커 심볼을 입력해주세요')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log(`📈 Loading data for ${ticker.toUpperCase()}, period: ${period}`)
      
      // 원본 yfiance-ma.py와 동일한 데이터 처리
      const data = await stockDataService.fetchStockData(ticker, period)
      
      if (data && data.data && data.data.length > 0) {
        setStockData(data)
        setCurrentTicker(ticker.toUpperCase())
        setCurrentPeriod(period)
        
        console.log(`✅ Successfully loaded ${data.data.length} days of data`)
        console.log(`📊 120-day MA points: ${data.analysis.ma120Days}`)
        console.log(`📊 200-day MA points: ${data.analysis.ma200Days}`)
        
      } else {
        setError('입력한 티커에 대한 데이터를 찾을 수 없습니다')
        setStockData(null)
      }
    } catch (err) {
      console.error('Error loading stock data:', err)
      setError(err.message || '주식 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.')
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📈 Stock Moving Averages Visualization</h1>
          <p>원본 yfiance-ma.py와 동일한 분석 로직 | React + 무료 API</p>
          
          <button 
            className="api-settings-btn"
            onClick={() => setShowAPISettings(!showAPISettings)}
          >
            ⚙️ API 설정
          </button>
        </div>
      </header>
      
      <main className="app-main">
        {showAPISettings && (
          <APISettings onClose={() => setShowAPISettings(false)} />
        )}
        
        <StockControls 
          onLoadData={loadStockData} 
          loading={loading}
          defaultTicker="QQQ"
        />
        
        {error && <ErrorMessage message={error} />}
        {loading && <LoadingSpinner />}
        
        {stockData && !loading && (
          <>
            <StockChart 
              data={stockData} 
              ticker={currentTicker}
              period={currentPeriod}
            />
            <StockAnalysis 
              data={stockData} 
              ticker={currentTicker}
            />
          </>
        )}
        
        {!stockData && !loading && !error && (
          <div className="welcome-message">
            <div className="welcome-card">
              <h2>📊 주식 이동평균선 분석</h2>
              <p>주식 티커를 입력하고 "Load Data" 버튼을 클릭하세요.</p>
              
              <div className="suggested-tickers">
                <h3>추천 티커:</h3>
                <div className="ticker-tags">
                  {['MSFT', 'AAPL', 'NVDA', 'GOOGL', 'TSLA', 'AMZN', 'QQQ', 'SPY'].map(ticker => (
                    <span key={ticker} className="ticker-tag">{ticker}</span>
                  ))}
                </div>
              </div>
              
              <div className="features">
                <h3>주요 기능:</h3>
                <ul>
                  <li>📈 실시간 주식 데이터 (무료 API)</li>
                  <li>📊 120일 & 200일 이동평균선</li>
                  <li>🎯 최저 기울기 지점 분석</li>
                  <li>📱 반응형 디자인</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>
          Made with React + Vite | 
          <a href="https://github.com/yourusername/stock-app" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App