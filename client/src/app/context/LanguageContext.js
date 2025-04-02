"use client";

import { createContext, useState, useContext, useCallback } from 'react';
import { translate } from '../component/LanguageConversion';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en'); // Default language is English
  
  // Translation function
  const t = useCallback((text) => translate(text, language), [language]);
  
  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'my' : 'en');
  }, []);
  
  // Set a specific language
  const changeLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'my') {
      setLanguage(lang);
    }
  }, []);
  
  const value = { 
    language, 
    t, 
    toggleLanguage, 
    changeLanguage 
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}