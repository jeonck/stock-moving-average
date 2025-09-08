import { useMemo } from 'react'
import Plot from 'react-plotly.js'

const StockChart = ({ data, ticker, period }) => {
  const chartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null

    const stockData = data.data
    const { minSlope120, minSlope200 } = data.analysis

    // 선택된 기간에 맞게 데이터 필터링 (차트 표시용)
    let displayData = stockData
    if (period !== 'max' && stockData.displayStartDate) {
      displayData = stockData.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= stockData.displayStartDate
      })
      console.log(`🎯 Display data filtered: ${displayData.length} days for chart (${period} years)`)
    }

    // 차트 데이터 구조
    const dates = displayData.map(item => item.date)
    const prices = displayData.map(item => item.close)
    const ma120 = displayData.map(item => item.ma120 || null)
    const ma200 = displayData.map(item => item.ma200 || null)

    console.log(`📊 Chart data: ${dates.length} points`)
    console.log(`📈 Price range: $${Math.min(...prices.filter(p => p)).toFixed(2)} - $${Math.max(...prices).toFixed(2)}`)
    console.log(`🔴 120일 이평 유효 포인트: ${ma120.filter(v => v !== null).length}개`)
    console.log(`🔵 200일 이평 유효 포인트: ${ma200.filter(v => v !== null).length}개`)

    const traces = [
      // 주식 가격 (원본과 동일)
      {
        x: dates,
        y: prices,
        type: 'scatter',
        mode: 'lines',
        name: 'Close Price',
        line: { color: 'darkgray', width: 1 },
        hovertemplate: '<b>%{x}</b><br>Close: $%{y:.2f}<extra></extra>'
      },
      
      // 120일 이동평균 (원본과 동일 - 빨간색)
      {
        x: dates,
        y: ma120,
        type: 'scatter',
        mode: 'lines',
        name: '120-day MA',
        line: { color: 'red', width: 2 },
        hovertemplate: '<b>%{x}</b><br>120-day MA: $%{y:.2f}<extra></extra>'
      },
      
      // 200일 이동평균 (원본과 동일 - 파란색)
      {
        x: dates,
        y: ma200,
        type: 'scatter',
        mode: 'lines',
        name: '200-day MA',
        line: { color: 'blue', width: 2 },
        hovertemplate: '<b>%{x}</b><br>200-day MA: $%{y:.2f}<extra></extra>'
      }
    ]

    // 원본 Streamlit과 완전히 동일한 최저 기울기 지점 표시
    // 신호 지점이 차트 표시 범위에 포함되는지 확인
    if (minSlope120 && minSlope120.ma120 !== null) {
      const signalDate = new Date(minSlope120.date)
      const chartStartDate = new Date(dates[0])
      const chartEndDate = new Date(dates[dates.length - 1])
      const isInRange = signalDate >= chartStartDate && signalDate <= chartEndDate
      
      console.log(`🔴 120일 신호 지점: ${minSlope120.date}`)
      console.log(`📊 차트 범위: ${dates[0]} ~ ${dates[dates.length - 1]}`)
      console.log(`✅ 신호 지점 차트 내 포함: ${isInRange ? 'YES' : 'NO'}`)
      
      if (isInRange) {
        console.log(`🔴 Adding 120일 마커: ${minSlope120.date} at $${minSlope120.ma120.toFixed(2)} (기울기: ${minSlope120.ma120Slope?.toFixed(6)})`)
        
        traces.push({
          x: [minSlope120.date],
          y: [minSlope120.ma120],
          type: 'scatter',
          mode: 'markers+text',
          name: 'Lowest Slope Point 120 MA',
          marker: { 
            color: 'red',          // 원본과 동일: color='red'
            size: 12,              // 원본과 동일: size=12
            symbol: 'circle',      // 원본과 동일: symbol='circle'
            line: { color: 'white', width: 2 }
          },
          text: ['Lowest Slope 120 MA'],        // 원본과 동일: text=["Lowest Slope 120 MA"]
          textposition: 'top center',           // 원본과 동일: textposition="top center"
          textfont: { size: 10, color: 'red', family: 'Arial' },
          hovertemplate: `<b>🔴 120일 최저 기울기 지점</b><br><b>날짜:</b> %{x}<br><b>120일 이평:</b> $%{y:.2f}<br><b>기울기:</b> ${minSlope120.ma120Slope?.toFixed(6)}<extra></extra>`,
          showlegend: true
        })
      } else {
        console.log(`⚠️ 120일 신호 지점이 차트 범위 밖에 있음`)
      }
    }

    if (minSlope200 && minSlope200.ma200 !== null) {
      const signalDate = new Date(minSlope200.date)
      const chartStartDate = new Date(dates[0])
      const chartEndDate = new Date(dates[dates.length - 1])
      const isInRange = signalDate >= chartStartDate && signalDate <= chartEndDate
      
      console.log(`🔵 200일 신호 지점: ${minSlope200.date}`)
      console.log(`📊 차트 범위: ${dates[0]} ~ ${dates[dates.length - 1]}`)
      console.log(`✅ 신호 지점 차트 내 포함: ${isInRange ? 'YES' : 'NO'}`)
      
      if (isInRange) {
        console.log(`🔵 Adding 200일 마커: ${minSlope200.date} at $${minSlope200.ma200.toFixed(2)} (기울기: ${minSlope200.ma200Slope?.toFixed(6)})`)
        
        traces.push({
          x: [minSlope200.date],
          y: [minSlope200.ma200],
          type: 'scatter',
          mode: 'markers+text',
          name: 'Lowest Slope Point 200 MA',
          marker: { 
            color: 'blue',         // 원본과 동일: color='blue'
            size: 12,              // 원본과 동일: size=12
            symbol: 'star',        // 원본과 동일: symbol='star'
            line: { color: 'white', width: 2 }
          },
          text: ['Lowest Slope 200 MA'],        // 원본과 동일: text=["Lowest Slope 200 MA"]
          textposition: 'top center',           // 원본과 동일: textposition="top center"
          textfont: { size: 10, color: 'blue', family: 'Arial' },
          hovertemplate: `<b>🔵 200일 최저 기울기 지점</b><br><b>날짜:</b> %{x}<br><b>200일 이평:</b> $%{y:.2f}<br><b>기울기:</b> ${minSlope200.ma200Slope?.toFixed(6)}<extra></extra>`,
          showlegend: true
        })
      } else {
        console.log(`⚠️ 200일 신호 지점이 차트 범위 밖에 있음`)
      }
    }

    // 디버깅 정보
    console.log(`📊 Chart traces generated: ${traces.length} traces`)
    console.log(`📈 Data points: ${dates.length}`)
    console.log(`🔴 120일 신호 표시: ${minSlope120 ? 'YES' : 'NO'}`)
    console.log(`🔵 200일 신호 표시: ${minSlope200 ? 'YES' : 'NO'}`)

    return traces
  }, [data])

  // 원본 Streamlit 앱과 동일한 차트 레이아웃
  const layout = {
    title: {
      text: `${ticker} Stock Price and Moving Averages (${period === 'max' ? 'Max' : period + ' years'})`,
      font: { size: 18, family: 'Arial, sans-serif' }
    },
    xaxis: { 
      title: 'Date',
      type: 'date',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: { 
      title: 'Price ($)',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    hovermode: 'x unified',
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#ddd',
      borderwidth: 1
    },
    plot_bgcolor: '#fafafa',
    paper_bgcolor: 'white',
    margin: { t: 80, r: 30, b: 60, l: 80 },
    height: 600 // 원본과 동일한 높이
  }

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'lasso2d', 
      'select2d',
      'autoScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: `${ticker}_moving_averages_${period}y`,
      height: 600,
      width: 1000,
      scale: 1
    }
  }

  if (!chartData) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>차트 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>📊 {ticker} 주식 차트</h2>
        <div className="chart-info">
          <span>📈 총 {data.data.length}일 데이터</span>
          <span>🔴 120일 이평 {data.analysis.ma120Days}개</span>
          <span>🔵 200일 이평 {data.analysis.ma200Days}개</span>
        </div>
      </div>
      
      <Plot
        data={chartData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '600px' }}
        useResizeHandler={true}
      />
    </div>
  )
}

export default StockChart