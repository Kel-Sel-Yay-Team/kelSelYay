"use client";

import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle({ insideMenu, className }) {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button 
      onClick={toggleLanguage}
      className={`language-toggle ${insideMenu ? 'inside-menu' : ''} ${className || ''}`}
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
        z-index: 1001;

        /* default for small screens */
        bottom: 1rem;
        right: 1rem;
      }

      /* Special styling for when inside the mobile menu */
      .language-toggle.inside-menu {
        position: static;
        width: 100%;
        display: block !important;
      }
      
      /* Override for pages where we always want to show it */
      .language-toggle.always-show {
        display: block !important;
        position: static;
      }

      /* for tablets and up */
      @media (min-width: 640px) {
        .language-toggle:not(.inside-menu):not(.always-show) {
          top: 2.75rem;
          bottom: auto;
          right: 1rem;
        }
      }

      /* Hide on mobile - it will be shown in the mobile menu instead */
      @media (max-width: 700px) {
        .language-toggle:not(.inside-menu):not(.always-show) {
          display: none;
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