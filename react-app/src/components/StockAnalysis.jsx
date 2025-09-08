import { useMemo } from 'react'

const StockAnalysis = ({ data, ticker }) => {
  const analysisResults = useMemo(() => {
    if (!data?.data || !data.analysis) return null

    const { minSlope120, minSlope200 } = data.analysis
    const stockData = data.data
    const latestData = stockData[stockData.length - 1]

    return {
      minSlope120,
      minSlope200,
      latestData,
      totalDays: stockData.length,
      ma120Days: data.analysis.ma120Days,
      ma200Days: data.analysis.ma200Days
    }
  }, [data])

  if (!analysisResults) {
    return <div className="analysis-placeholder">분석 데이터가 없습니다.</div>
  }

  const { minSlope120, minSlope200, latestData } = analysisResults

  // 현재 트렌드 계산
  const getCurrentTrend = (slope) => {
    if (!slope) return { text: 'N/A', emoji: '❓', className: 'neutral' }
    
    if (slope > 0.5) return { text: '강한 상승', emoji: '🚀', className: 'strong-up' }
    if (slope > 0) return { text: '상승', emoji: '📈', className: 'up' }
    if (slope < -0.5) return { text: '강한 하락', emoji: '📉', className: 'strong-down' }
    if (slope < 0) return { text: '하락', emoji: '📉', className: 'down' }
    return { text: '보합', emoji: '➡️', className: 'neutral' }
  }

  const trend120 = getCurrentTrend(latestData.ma120Slope)
  const trend200 = getCurrentTrend(latestData.ma200Slope)

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>📊 {ticker} 이동평균선 분석</h2>
        <div className="analysis-summary">
          <span>총 {analysisResults.totalDays}일 데이터</span>
          <span>|</span>
          <span>120일 이평: {analysisResults.ma120Days}개</span>
          <span>|</span>
          <span>200일 이평: {analysisResults.ma200Days}개</span>
        </div>
      </div>

      <div className="analysis-grid">
        {/* 120일 이동평균 최저 기울기 지점 */}
        {minSlope120 && (
          <div className="analysis-card slope-analysis">
            <div className="card-header">
              <h3>🔴 120일 이동평균 최저 기울기 지점</h3>
              <span className="signal-marker">● 원형 마커</span>
            </div>
            <div className="card-content">
              <div className="metric-row">
                <span className="metric-label">📅 날짜:</span>
                <span className="metric-value">{minSlope120.date}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">💰 120일 이평가:</span>
                <span className="metric-value">${minSlope120.ma120?.toFixed(2)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">📉 기울기:</span>
                <span className="metric-value negative">{minSlope120.ma120Slope?.toFixed(6)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">📊 차트 표시:</span>
                <span className="signal-indicator">
                  <span className="signal-dot red"></span>
                  빨간 원형 마커로 표시됨
                </span>
              </div>
              <p className="analysis-note">
                <strong>📍 차트에서 빨간색 원형(●) 마커를 확인하세요!</strong><br/>
                이 지점은 120일 이동평균선의 기울기가 가장 급격하게 하락한 시점으로, 
                시장 조정이나 하락 트렌드의 가속화를 나타냅니다.
              </p>
            </div>
          </div>
        )}

        {/* 200일 이동평균 최저 기울기 지점 */}
        {minSlope200 && (
          <div className="analysis-card slope-analysis">
            <div className="card-header">
              <h3>🔵 200일 이동평균 최저 기울기 지점</h3>
              <span className="signal-marker">★ 별 마커</span>
            </div>
            <div className="card-content">
              <div className="metric-row">
                <span className="metric-label">📅 날짜:</span>
                <span className="metric-value">{minSlope200.date}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">💰 200일 이평가:</span>
                <span className="metric-value">${minSlope200.ma200?.toFixed(2)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">📉 기울기:</span>
                <span className="metric-value negative">{minSlope200.ma200Slope?.toFixed(6)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">📊 차트 표시:</span>
                <span className="signal-indicator">
                  <span className="signal-dot blue">★</span>
                  파란 별형 마커로 표시됨
                </span>
              </div>
              <p className="analysis-note">
                <strong>📍 차트에서 파란색 별형(★) 마커를 확인하세요!</strong><br/>
                이 지점은 200일 이동평균선의 기울기가 가장 급격하게 하락한 시점으로, 
                장기 트렌드 전환점을 나타낼 가능성이 높습니다.
              </p>
            </div>
          </div>
        )}

        {/* 현재 트렌드 분석 */}
        {latestData.ma120 && latestData.ma200 && (
          <div className="analysis-card current-trend">
            <div className="card-header">
              <h3>📈 현재 트렌드 분석</h3>
              <span className="latest-date">{latestData.date}</span>
            </div>
            <div className="card-content">
              <div className="trend-row">
                <span className="trend-label">120일 이평 트렌드:</span>
                <span className={`trend-value ${trend120.className}`}>
                  {trend120.emoji} {trend120.text}
                  <small>({latestData.ma120Slope > 0 ? '+' : ''}{latestData.ma120Slope?.toFixed(4)})</small>
                </span>
              </div>
              
              <div className="trend-row">
                <span className="trend-label">200일 이평 트렌드:</span>
                <span className={`trend-value ${trend200.className}`}>
                  {trend200.emoji} {trend200.text}
                  <small>({latestData.ma200Slope > 0 ? '+' : ''}{latestData.ma200Slope?.toFixed(4)})</small>
                </span>
              </div>

              <div className="separator"></div>

              <div className="price-position">
                <h4>💰 현재 주가 포지션</h4>
                <div className="position-row">
                  <span>현재가:</span>
                  <span className="current-price">${latestData.close.toFixed(2)}</span>
                </div>
                <div className="position-row">
                  <span>120일 이평 대비:</span>
                  <span className={latestData.close > latestData.ma120 ? 'above' : 'below'}>
                    {latestData.close > latestData.ma120 ? '✅ 상회' : '❌ 하회'}
                    <small>({((latestData.close / latestData.ma120 - 1) * 100).toFixed(1)}%)</small>
                  </span>
                </div>
                <div className="position-row">
                  <span>200일 이평 대비:</span>
                  <span className={latestData.close > latestData.ma200 ? 'above' : 'below'}>
                    {latestData.close > latestData.ma200 ? '✅ 상회' : '❌ 하회'}
                    <small>({((latestData.close / latestData.ma200 - 1) * 100).toFixed(1)}%)</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 기술적 신호 */}
        <div className="analysis-card technical-signals">
          <div className="card-header">
            <h3>🎯 기술적 신호</h3>
          </div>
          <div className="card-content">
            {latestData.ma120 && latestData.ma200 && (
              <div className="signal-item">
                <span className="signal-label">골든 크로스/데드 크로스:</span>
                <span className={`signal-value ${latestData.ma120 > latestData.ma200 ? 'bullish' : 'bearish'}`}>
                  {latestData.ma120 > latestData.ma200 ? 
                    '🌟 골든 크로스 (강세)' : 
                    '💀 데드 크로스 (약세)'
                  }
                </span>
              </div>
            )}
            
            <div className="signal-item">
              <span className="signal-label">120일 이평 모멘텀:</span>
              <span className={`signal-value ${trend120.className}`}>
                {trend120.emoji} {trend120.text}
              </span>
            </div>
            
            <div className="signal-item">
              <span className="signal-label">200일 이평 모멘텀:</span>
              <span className={`signal-value ${trend200.className}`}>
                {trend200.emoji} {trend200.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAnalysis