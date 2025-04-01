"use client";

import { useState } from "react";

function ValidationModal({ 
  isOpen, 
  onClose, 
  onValidate, 
  title = "Verify Identity",
  message = "Please enter your verification information:", 
  placeholder = "Enter name",
  errorMessage = "",
  buttonText = "Verify"
}) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onValidate(inputValue);
  };

  if (!isOpen) return null;

  return (
    <div className="validation-modal">
      <div className="validation-content">
        <h2>{title}</h2>
        <p>{message}</p>
        
        <div className="input-group">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="reporter-input"
          />
          {errorMessage && (
            <div className="validation-error">{errorMessage}</div>
          )}
        </div>
        
        <div className="validation-actions">
          <button 
            className="action-button verify-button"
            onClick={handleSubmit}
          >
            {buttonText}
          </button>
          <button 
            className="action-button cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        .validation-modal {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1100;
          backdrop-filter: blur(10px);
        }
        
        .validation-content {
          width: 90%;
          max-width: 500px;
          background: rgba(30, 30, 30, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          color: #fff;
        }
        
        .validation-content h2 {
          margin-top: 0;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #646cff;
        }
        
        .input-group {
          margin: 1.5rem 0;
        }
        
        .reporter-input {
          width: 100%;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          padding: 12px 16px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .reporter-input:focus {
          outline: none;
          border-color: #646cff;
          box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
        }
        
        .validation-error {
          color: #ff6b6b;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        
        .validation-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .action-button {
          background: rgba(100, 108, 255, 0.2);
          color: #646cff;
          border: 1px solid rgba(100, 108, 255, 0.4);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .action-button:hover {
          background: rgba(100, 108, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .verify-button {
          background: rgba(22, 163, 74, 0.2);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.4);
        }
        
        .verify-button:hover {
          background: rgba(22, 163, 74, 0.3);
        }
      `}</style>
    </div>
  );
}

export default ValidationModal;