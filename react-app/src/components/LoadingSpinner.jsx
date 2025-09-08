const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>주식 데이터를 불러오는 중...</p>
      <small>잠시만 기다려주세요</small>
    </div>
  )
}

export default LoadingSpinner