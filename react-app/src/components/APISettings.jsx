import { useState } from 'react'
import stockDataService from '../services/stockDataService'

const APISettings = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('')
  const [selectedAPI, setSelectedAPI] = useState('ALPHA_VANTAGE')

  const handleSave = () => {
    if (apiKey.trim()) {
      stockDataService.setAPIKey(selectedAPI, apiKey.trim())
      alert('API 키가 저장되었습니다!')
      onClose()
    } else {
      alert('API 키를 입력해주세요.')
    }
  }

  return (
    <div className="api-settings">
      <div className="settings-header">
        <h3>⚙️ API 설정</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      
      <div className="settings-content">
        <div className="setting-group">
          <label>API 선택:</label>
          <select 
            value={selectedAPI} 
            onChange={(e) => setSelectedAPI(e.target.value)}
          >
            <option value="ALPHA_VANTAGE">Alpha Vantage (추천)</option>
            <option value="FINNHUB">Finnhub</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label>API 키:</label>
          <input 
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API 키를 입력하세요"
          />
        </div>
        
        <div className="api-info">
          {selectedAPI === 'ALPHA_VANTAGE' && (
            <p>
              무료 키: <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">
                alphavantage.co
              </a> (500 calls/day)
            </p>
          )}
          {selectedAPI === 'FINNHUB' && (
            <p>
              무료 키: <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer">
                finnhub.io
              </a> (60 calls/minute)
            </p>
          )}
        </div>
        
        <div className="settings-actions">
          <button onClick={handleSave} className="save-btn">저장</button>
          <button onClick={onClose} className="cancel-btn">취소</button>
        </div>
      </div>
      
      <style jsx>{`
        .api-settings {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid #e1e8ed;
        }
        
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #666;
        }
        
        .setting-group {
          margin-bottom: 1rem;
        }
        
        .setting-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }
        
        .setting-group input,
        .setting-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        
        .api-info {
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .api-info a {
          color: #667eea;
          text-decoration: none;
        }
        
        .settings-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }
        
        .save-btn, .cancel-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .save-btn {
          background: #667eea;
          color: white;
        }
        
        .cancel-btn {
          background: #e9ecef;
          color: #555;
        }
      `}</style>
    </div>
  )
}

export default APISettings