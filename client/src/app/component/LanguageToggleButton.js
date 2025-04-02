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
        background: rgb(238, 65, 65);
        color: black;
        border: 1px solid rgba(5, 5, 5, 0.4);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        position: fixed;
        z-index: 999;

        /* default for small screens */
        bottom: 1rem;
        right: 1rem;
      }

      /* for tablets and up */
      @media (min-width: 640px) {
        .language-toggle {
          top: 2.75rem;
          bottom: auto;
          right: 1rem;
        }
      }

      .language-toggle:hover {
        background: rgba(100, 108, 255, 0.3);
        transform: translateY(-2px);
      }
    `}</style>

    </button>
  );
}