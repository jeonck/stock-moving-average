const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <strong>⚠️ 오류 발생:</strong> {message}
    </div>
  )
}

export default ErrorMessage