"use client";

import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button 
      onClick={toggleLanguage}
      className="language-toggle"
    >
      {language === 'en' ? 'မြန်မာ' : 'English'}
      
      <style jsx>{`
        .language-toggle {
          background: rgba(100, 108, 255, 0.2);
          color: #646cff;
          border: 1px solid rgba(100, 108, 255, 0.4);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 999;
        }
        
        .language-toggle:hover {
          background: rgba(100, 108, 255, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </button>
  );
}