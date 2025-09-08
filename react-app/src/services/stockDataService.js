import axios from 'axios'

// 무료 API 설정
const FREE_APIS = {
  // Alpha Vantage (추천) - 무료 500 calls/day
  ALPHA_VANTAGE: {
    baseURL: 'https://www.alphavantage.co/query',
    key: 'demo', // 실제 사용시 https://www.alphavantage.co/support/#api-key 에서 무료 키 발급
    function: 'TIME_SERIES_DAILY'
  },
  
  // Finnhub - 무료 60 calls/minute  
  FINNHUB: {
    baseURL: 'https://finnhub.io/api/v1',
    key: 'demo', // 실제 사용시 https://finnhub.io 에서 무료 키 발급
  },

  // Polygon.io - 무료 5 calls/minute
  POLYGON: {
    baseURL: 'https://api.polygon.io/v2',
    key: 'demo' // 실제 사용시 polygon.io에서 무료 키 발급
  }
}

class StockDataService {
  constructor() {
    this.currentAPI = 'YAHOO_DIRECT' // 원본과 동일한 데이터 소스 사용
    this.cache = new Map() // 간단한 캐싱
    this.rateLimitDelay = 1000 // 1초 딜레이
  }

  // API 키 설정 (사용자가 직접 입력)
  setAPIKey(api, key) {
    FREE_APIS[api].key = key
  }

  // 원본 yfiance-ma.py와 동일한 데이터 구조로 변환
  async fetchStockData(ticker, period = '3') {
    const cacheKey = `${ticker}_${period}`
    
    if (this.cache.has(cacheKey)) {
      console.log('📦 Using cached data for', cacheKey)
      return this.cache.get(cacheKey)
    }

    try {
      let rawData
      
      switch (this.currentAPI) {
        case 'YAHOO_DIRECT':
          rawData = await this.fetchFromYahooDirect(ticker, period)
          break
        case 'ALPHA_VANTAGE':
          rawData = await this.fetchFromAlphaVantage(ticker, period)
          break
        case 'FINNHUB':
          rawData = await this.fetchFromFinnhub(ticker, period)
          break
        default:
          throw new Error(`Unsupported API: ${this.currentAPI}`)
      }

      // 원본 Python 로직과 동일하게 처리
      const processedData = this.processStockData(rawData, ticker, period)
      
      // 캐싱 (10분)
      this.cache.set(cacheKey, processedData)
      setTimeout(() => this.cache.delete(cacheKey), 10 * 60 * 1000)
      
      return processedData

    } catch (error) {
      console.error('Error fetching stock data:', error)
      throw this.handleAPIError(error)
    }
  }

  async fetchFromYahooDirect(ticker, period) {
    // CORS 우회를 위한 공개 프록시 사용 (원본 yfinance와 동일한 데이터)
    const now = new Date()
    const startDate = new Date()
    
    if (period === 'max') {
      // 최대한 오래된 데이터 (20년 전)
      startDate.setFullYear(startDate.getFullYear() - 20)
    } else {
      const years = parseInt(period)
      // 이동평균 계산을 위해 추가 기간 확보
      startDate.setFullYear(startDate.getFullYear() - years - 1)
    }
    
    const startTimestamp = Math.floor(startDate.getTime() / 1000)
    const endTimestamp = Math.floor(now.getTime() / 1000)
    
    // Yahoo Finance CSV URL 구성
    const yahooURL = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startTimestamp}&period2=${endTimestamp}&interval=1d&events=history&includeAdjustedClose=true`
    
    // CORS 프록시 사용
    const proxyURL = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooURL)}`
    
    console.log(`🚀 Fetching from Yahoo Finance via CORS proxy for ${ticker} (period: ${period})`)
    console.log(`📅 Date range: ${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`)
    console.log(`🔗 Using proxy: ${proxyURL}`)
    
    try {
      const response = await axios.get(proxyURL, { 
        timeout: 30000,
        responseType: 'text',  // CSV 응답
        headers: {
          'Accept': 'text/csv'
        }
      })
      
      if (!response.data || response.data.includes('error') || !response.data.includes('Date')) {
        throw new Error('Invalid CSV response from Yahoo Finance')
      }
      
      console.log(`📊 Got ${response.data.split('\n').length - 1} lines from Yahoo Finance`)
      
      return this.parseYahooCSV(response.data, period)
      
    } catch (error) {
      console.error('Yahoo Finance Direct API failed:', error)
      console.log('🔄 Fallback to Alpha Vantage...')
      
      // Yahoo Finance 실패시 Alpha Vantage로 폴백
      this.currentAPI = 'ALPHA_VANTAGE'
      return await this.fetchFromAlphaVantage(ticker, period)
    }
  }

  parseYahooCSV(csvData, period) {
    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',')
    
    console.log(`📊 CSV Headers: ${headers.join(', ')}`)
    
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      
      // 유효하지 않은 데이터 스킵
      if (values.length < 6 || values[4] === 'null') continue
      
      data.push({
        date: values[0],
        open: parseFloat(values[1]),
        high: parseFloat(values[2]),
        low: parseFloat(values[3]),
        close: parseFloat(values[4]),
        volume: parseInt(values[6] || values[5])
      })
    }
    
    // 날짜순 정렬
    data.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // 기간별 필터링 (표시용)
    if (period !== 'max') {
      const years = parseInt(period)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setFullYear(startDate.getFullYear() - years)
      
      // 표시 범위 정보 저장
      data.displayStartDate = startDate
      data.displayEndDate = endDate
      
      console.log(`🎯 Display period will be: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`)
    }
    
    console.log(`📈 Parsed ${data.length} days from Yahoo Finance CSV`)
    console.log(`📅 Full data range: ${data[0]?.date} to ${data[data.length - 1]?.date}`)
    
    return data
  }

  async fetchFromAlphaVantage(ticker, period) {
    const { baseURL, key, function: func } = FREE_APIS.ALPHA_VANTAGE
    
    // 이동평균 계산을 위해 항상 full 데이터 요청
    // compact는 최근 100일만 제공하므로 200일 이동평균 계산 불가
    const params = {
      function: func,
      symbol: ticker,
      outputsize: 'full', // 항상 full로 충분한 데이터 확보
      apikey: key
    }

    console.log(`🚀 Fetching FULL data from Alpha Vantage for ${ticker} (period: ${period})`)
    console.log('📊 Using outputsize=full to ensure sufficient data for 200-day MA')
    
    const response = await axios.get(baseURL, { params, timeout: 30000 })
    
    if (response.data['Error Message']) {
      throw new Error(`Invalid symbol: ${ticker}`)
    }
    
    if (response.data['Note']) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }

    const timeSeries = response.data['Time Series (Daily)']
    if (!timeSeries) {
      throw new Error('No data received from API')
    }

    const fullData = this.convertAlphaVantageData(timeSeries, period)
    console.log(`📈 Fetched ${fullData.length} days of data`)
    
    return fullData
  }

  convertAlphaVantageData(timeSeries, period) {
    // 전체 데이터를 날짜순으로 정렬
    const allData = Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        close: parseFloat(values['4. close']),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        volume: parseInt(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    console.log(`📅 Full data range: ${allData[0]?.date} to ${allData[allData.length - 1]?.date}`)

    // 기간별 필터링 (하지만 이동평균 계산을 위해 추가 데이터 확보)
    if (period !== 'max') {
      const years = parseInt(period)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setFullYear(startDate.getFullYear() - years)
      
      // 200일 이동평균 계산을 위해 시작일에서 200일 더 이전부터 데이터 가져오기
      const bufferStartDate = new Date(startDate)
      bufferStartDate.setDate(bufferStartDate.getDate() - 250) // 200일 + 버퍼
      
      console.log(`📊 Filtering data: ${bufferStartDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`)
      console.log(`🎯 Target period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]} (${years} years)`)
      
      const filteredData = allData.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= bufferStartDate && itemDate <= endDate
      })
      
      console.log(`📈 Filtered to ${filteredData.length} days (includes buffer for moving averages)`)
      
      // 실제 표시할 기간 정보를 저장
      filteredData.displayStartDate = startDate
      filteredData.displayEndDate = endDate
      
      return filteredData
    }

    console.log(`📈 Using all ${allData.length} days (Max period)`)
    return allData
  }

  // 원본 yfiance-ma.py와 완전히 동일한 데이터 처리
  processStockData(rawData, ticker, period) {
    if (!rawData || rawData.length === 0) {
      throw new Error('No data available')
    }

    console.log(`📊 Processing ${rawData.length} days of data for ${ticker}`)
    console.log(`📅 Data date range: ${rawData[0]?.date} to ${rawData[rawData.length - 1]?.date}`)

    // 데이터 충분성 검사
    if (rawData.length < 200) {
      console.warn(`⚠️ Warning: Only ${rawData.length} days of data available. 200-day MA may be incomplete.`)
    }

    // 1단계: 이동평균 계산 (원본과 동일)
    const processedData = rawData.map((item, index) => {
      const processed = { ...item }

      // 120일 이동평균 (원본: yf_data['120_MA'] = yf_data['Close'].rolling(window=120).mean())
      if (index >= 119) {
        const sum120 = rawData.slice(index - 119, index + 1)
          .reduce((sum, item) => sum + item.close, 0)
        processed.ma120 = sum120 / 120
      } else {
        processed.ma120 = null // NaN과 동일
      }

      // 200일 이동평균 (원본: yf_data['200_MA'] = yf_data['Close'].rolling(window=200).mean())
      if (index >= 199) {
        const sum200 = rawData.slice(index - 199, index + 1)
          .reduce((sum, item) => sum + item.close, 0)
        processed.ma200 = sum200 / 200
      } else {
        processed.ma200 = null // NaN과 동일
      }

      return processed
    })

    // 2단계: 기울기 계산 (원본과 동일)
    // 원본: yf_data['120_MA_Slope'] = yf_data['120_MA'].diff()
    // 원본: yf_data['200_MA_Slope'] = yf_data['200_MA'].diff()
    processedData.forEach((item, index) => {
      if (index > 0) {
        // 120일 이동평균 기울기
        if (item.ma120 !== null && processedData[index - 1].ma120 !== null) {
          item.ma120Slope = item.ma120 - processedData[index - 1].ma120
        } else {
          item.ma120Slope = null
        }
        
        // 200일 이동평균 기울기
        if (item.ma200 !== null && processedData[index - 1].ma200 !== null) {
          item.ma200Slope = item.ma200 - processedData[index - 1].ma200
        } else {
          item.ma200Slope = null
        }
      } else {
        item.ma120Slope = null
        item.ma200Slope = null
      }
    })

    // 3단계: 최저 기울기 지점 찾기 (원본과 동일)
    // 원본: min_slope_120_idx = yf_data['120_MA_Slope'].idxmin()
    // 원본: min_slope_200_idx = yf_data['200_MA_Slope'].idxmin()
    const validMA120Slopes = processedData.filter(item => item.ma120Slope !== null && !isNaN(item.ma120Slope))
    const validMA200Slopes = processedData.filter(item => item.ma200Slope !== null && !isNaN(item.ma200Slope))

    let minSlope120 = null
    let minSlope200 = null

    if (validMA120Slopes.length > 0) {
      minSlope120 = validMA120Slopes.reduce((min, item) => 
        item.ma120Slope < min.ma120Slope ? item : min
      )
      console.log(`🔴 120일 최저 기울기: ${minSlope120.date} = ${minSlope120.ma120Slope.toFixed(6)}`)
    }

    if (validMA200Slopes.length > 0) {
      minSlope200 = validMA200Slopes.reduce((min, item) => 
        item.ma200Slope < min.ma200Slope ? item : min
      )
      console.log(`🔵 200일 최저 기울기: ${minSlope200.date} = ${minSlope200.ma200Slope.toFixed(6)}`)
    }

    return {
      ticker: ticker.toUpperCase(),
      period,
      data: processedData,
      analysis: {
        minSlope120,
        minSlope200,
        totalDays: processedData.length,
        ma120Days: validMA120Slopes.length,
        ma200Days: validMA200Slopes.length
      }
    }
  }

  handleAPIError(error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new Error('Request timeout. Please try again.')
    }
    
    if (error.response?.status === 429) {
      return new Error('API rate limit exceeded. Please wait a moment and try again.')
    }
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      return new Error('API key invalid or expired. Please check your API configuration.')
    }
    
    return error
  }

  // API 상태 확인
  async checkAPIStatus() {
    try {
      await this.fetchStockData('AAPL', '1') // 테스트 호출
      return { status: 'ok', api: this.currentAPI }
    } catch (error) {
      return { status: 'error', error: error.message, api: this.currentAPI }
    }
  }
}

export default new StockDataService()