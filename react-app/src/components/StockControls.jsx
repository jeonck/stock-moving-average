import { useState } from 'react'

const StockControls = ({ onLoadData, loading, defaultTicker = 'QQQ' }) => {
  const [ticker, setTicker] = useState(defaultTicker)
  const [period, setPeriod] = useState('3')

  // 원본 yfiance-ma.py와 동일한 기간 옵션
  const periodOptions = [
    { value: '3', label: '3 years' },
    { value: '6', label: '6 years' },
    { value: '9', label: '9 years' },
    { value: '12', label: '12 years' },
    { value: 'max', label: 'Max' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ticker.trim() && !loading) {
      onLoadData(ticker.trim().toUpperCase(), period)
    }
  }

  const handleTickerChange = (e) => {
    // 자동으로 대문자 변환
    setTicker(e.target.value.toUpperCase())
  }

  const handleQuickSelect = (selectedTicker) => {
    setTicker(selectedTicker)
    if (!loading) {
      onLoadData(selectedTicker, period)
    }
  }

  // 원본과 동일한 추천 티커
  const suggestedTickers = [
    'MSFT', 'AAPL', 'NVDA', 'GOOGL', 'TSLA', 
    'AMZN', 'TSM', 'LLY', 'NOV', 'AVGO', 
    'ORCL', 'NFLX', 'META', 'QQQ', 'SPY'
  ]

  return (
    <div className="controls-container">
      <form onSubmit={handleSubmit} className="stock-controls">
        <div className="control-group">
          <label htmlFor="ticker" className="control-label">
            주식 티커:
          </label>
          <div className="ticker-input-container">
            <input
              id="ticker"
              type="text"
              value={ticker}
              onChange={handleTickerChange}
              placeholder="AAPL, MSFT, QQQ..."
              className="ticker-input"
              disabled={loading}
              maxLength={10}
            />
            <div className="input-hint">
              예시: {suggestedTickers.slice(0, 4).join(', ')}
            </div>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="period" className="control-label">
            기간:
          </label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
            disabled={loading}
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`load-button ${loading ? 'loading' : ''}`}
          disabled={loading || !ticker.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Loading...
            </>
          ) : (
            '📊 Load Data'
          )}
        </button>
      </form>

      {/* 빠른 선택 버튼들 */}
      <div className="quick-select">
        <h3>빠른 선택:</h3>
        <div className="quick-buttons">
          {suggestedTickers.map(suggestedTicker => (
            <button
              key={suggestedTicker}
              onClick={() => handleQuickSelect(suggestedTicker)}
              className={`quick-button ${ticker === suggestedTicker ? 'active' : ''}`}
              disabled={loading}
              title={`${suggestedTicker} 데이터 로드`}
            >
              {suggestedTicker}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StockControls