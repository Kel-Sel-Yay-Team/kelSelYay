'use client';

import { useState, useEffect } from 'react';
import LanguageToggle from './LanguageToggleButton';
import Link from 'next/link';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to detect mobile/desktop view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    };
    
    // Check initially
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Menu */}
      <div className="desktop-menu">
        <Link href="/missing-people" className="desktop-menu-link">
          Missing People
        </Link>
      </div>

      {/* Mobile Menu Button & Panel */}
      <div className="mobile-menu-container">
        {/* Hamburger button */}
        <button 
          className={`hamburger-button ${isOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu content that shows when open */}
        {isOpen && (
          <div className="mobile-menu">
            <div className='menu-item'>
              <Link href="/missing-people" className="missing-people-page-button">
                Missing People Page
              </Link>
              <LanguageToggle insideMenu={true} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Desktop Menu Styles */
        .desktop-menu {
          position: fixed;
          right: 0.5rem;
          bottom: 25px;
          z-index: 1000;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          padding: 0.8rem 1.2rem;
          display: block;
        }

        .desktop-menu-link {
          color: #333;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .desktop-menu-link:hover {
          color: #ef4444;
        }

        /* Mobile Menu Styles */
        .mobile-menu-container {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 1000;
          display: none; /* Hidden by default */
        }

        /* Responsive Behavior */
        @media (max-width: 700px) {
          .desktop-menu {
            display: none; /* Hide desktop menu on mobile */
          }
          
          .mobile-menu-container {
            display: block; /* Show mobile menu on mobile */
          }
        }

        /* Mobile Menu Button Styles */
        .hamburger-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: none;
          outline: none;
          cursor: pointer;
          z-index: 1001;
        }

        .hamburger-button span {
          display: block;
          width: 24px;
          height: 3px;
          margin: 2px 0;
          background-color: #333;
          transition: all 0.3s ease;
        }

        .hamburger-button.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-button.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-button.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Mobile Menu Panel Styles */
        .mobile-menu {
          position: absolute;
          bottom: 60px;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          padding: 1rem;
          z-index: 1000;
          min-width: 180px;
        }

        /* Menu Items Styling */
        .menu-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .missing-people-page-button {
          background: #f5f5f5;
          color: #333;
          border: 1px solid rgba(5, 5, 5, 0.1);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          width: 100%;
        }

        .missing-people-page-button:hover {
          background: rgba(239, 68, 68, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}