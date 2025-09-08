# 📈 Stock Moving Averages - React App

원본 `yfiance-ma.py` Streamlit 앱을 **Vite + React + 무료 API**로 완전히 리팩토링한 버전입니다.

## 🌟 주요 특징

### ✅ 원본 기능 100% 구현
- **동일한 이동평균 로직**: 120일, 200일 이동평균 계산
- **동일한 기울기 분석**: 최저 기울기 지점 찾기 및 표시
- **동일한 시각화**: Plotly.js로 원본과 동일한 차트
- **동일한 기간 옵션**: 3, 6, 9, 12년, Max 선택

### 🆙 개선된 기능
- **GitHub Pages 배포 가능**: 완전한 클라이언트 사이드
- **실제 주식 데이터**: Alpha Vantage API (무료)
- **현대적 UI/UX**: React 컴포넌트 + 반응형 디자인
- **빠른 성능**: Vite 빌드 시스템
- **확장 가능**: 새로운 기능 쉽게 추가

## 🚀 빠른 시작

### 1. 프로젝트 설치
```bash
# 의존성 설치
cd react-app
npm install

# 개발 서버 실행
npm run dev
```

### 2. API 키 설정 (선택사항)
```bash
# Alpha Vantage에서 무료 API 키 발급
# https://www.alphavantage.co/support/#api-key

# 앱에서 ⚙️ API 설정 버튼 클릭하여 키 입력
```

### 3. GitHub Pages 배포
```bash
# GitHub 저장소 생성 후
git add .
git commit -m "Initial commit"
git push origin main

# GitHub Actions가 자동으로 배포
# Settings > Pages에서 확인
```

## 📊 데이터 플로우

```
원본 yfiance-ma.py 로직 ➜ React 컴포넌트 ➜ 무료 API ➜ GitHub Pages
```

1. **Alpha Vantage API**에서 실제 주식 데이터 가져오기
2. **원본과 동일한 계산 로직** 적용
3. **Plotly.js**로 인터랙티브 차트 렌더링
4. **GitHub Pages**에서 정적 호스팅

## 🗂️ 프로젝트 구조

```
react-app/
├── src/
│   ├── App.jsx                    # 메인 앱 컴포넌트
│   ├── App.css                    # 전역 스타일
│   ├── services/
│   │   └── stockDataService.js    # API 연동 + 원본 로직
│   └── components/
│       ├── StockChart.jsx         # 차트 컴포넌트 (Plotly)
│       ├── StockControls.jsx      # 입력 컨트롤
│       ├── StockAnalysis.jsx      # 분석 결과 표시
│       ├── LoadingSpinner.jsx     # 로딩 상태
│       ├── ErrorMessage.jsx       # 에러 처리
│       └── APISettings.jsx        # API 설정
├── .github/workflows/deploy.yml   # GitHub Actions 배포
├── package.json                   # 의존성 설정
├── vite.config.js                # Vite 설정
└── README.md                      # 이 파일
```

## 🔧 개발 명령어

```bash
# 개발 서버 (HMR 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 린팅
npm run lint

# GitHub Pages 배포
npm run deploy
```

## 🎯 사용법

### 기본 사용
1. 주식 티커 입력 (예: AAPL, MSFT, QQQ)
2. 분석 기간 선택 (3-12년 또는 최대)
3. "📊 Load Data" 버튼 클릭
4. 차트와 분석 결과 확인

### 고급 기능
- **빠른 선택**: 추천 티커 버튼으로 원클릭 로드
- **상세 분석**: 트렌드, 기술적 신호, 포지션 분석
- **차트 다운로드**: PNG 형태로 차트 내보내기
- **반응형**: 모바일/태블릿에서도 최적화

## 📈 분석 기능

### 원본 Python 로직과 동일
```javascript
// 120일 이동평균 계산
const sum120 = data.slice(index - 119, index + 1)
  .reduce((sum, item) => sum + item.close, 0)
processed.ma120 = sum120 / 120

// 기울기 계산
item.ma120Slope = item.ma120 - previousMA120

// 최저 기울기 찾기
const minSlope = validData.reduce((min, item) => 
  item.slope < min.slope ? item : min
)
```

### 추가된 분석 기능
- **트렌드 강도 분석**: 강한 상승/하락 구분
- **골든크로스/데드크로스**: 120일/200일 이평선 교차
- **가격 포지션**: 이평선 대비 현재가 위치
- **기술적 신호**: 모멘텀 및 트렌드 신호

## 🔌 API 설정

### Alpha Vantage (추천)
- **무료 제한**: 500 calls/day
- **장점**: 안정적, 정확한 데이터
- **설정**: https://www.alphavantage.co/support/#api-key

### Finnhub (대안)
- **무료 제한**: 60 calls/minute  
- **장점**: 더 많은 데이터
- **설정**: https://finnhub.io

## 🚀 배포 옵션

### 1. GitHub Pages (추천)
```bash
# 자동 배포 (GitHub Actions)
git push origin main
```

### 2. Vercel
```bash
npm i -g vercel
vercel --prod
```

### 3. Netlify
```bash
# 드래그 앤 드롭으로 dist 폴더 업로드
npm run build
```

## 🔄 원본 vs React 비교

| 기능 | 원본 Streamlit | React 버전 |
|------|----------------|------------|
| 데이터 소스 | yfinance | Alpha Vantage API |
| 이동평균 계산 | ✅ 동일 | ✅ 동일 |
| 기울기 분석 | ✅ 동일 | ✅ 동일 |
| 차트 라이브러리 | Plotly | Plotly.js |
| 배포 | 서버 필요 | GitHub Pages |
| 성능 | 서버 렌더링 | 클라이언트 렌더링 |
| 확장성 | 제한적 | 컴포넌트 기반 |

## 🎨 커스터마이징

### 새로운 지표 추가
```javascript
// stockDataService.js에서
processStockData(rawData) {
  // RSI, MACD 등 추가 계산
  processed.rsi = calculateRSI(data)
  return processed
}
```

### UI 테마 변경
```css
/* App.css에서 색상 변경 */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

## 🐛 문제 해결

### API 에러
- API 키 확인
- 요청 한도 확인
- 네트워크 연결 확인

### 빌드 에러  
- Node.js 버전 확인 (18+ 권장)
- 의존성 재설치: `rm -rf node_modules && npm install`

### 배포 문제
- GitHub Pages 설정 확인
- 빌드 경로 확인 (`vite.config.js`)

## 📞 지원

- **Issues**: GitHub Issues 탭에서 버그 리포트
- **문서**: 이 README와 코드 주석 참고
- **예제**: src/components/ 폴더의 컴포넌트들

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**🎉 이제 원본 Streamlit 앱의 모든 기능을 GitHub Pages에서 무료로 호스팅할 수 있습니다!**