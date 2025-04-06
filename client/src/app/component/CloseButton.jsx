"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import MissingListModal from "./MissingListModal";
import DetailModal from "./DetailModal";

export default function CloseButton({ onClose }) {
    return (
    <>
      <div className="search-button open" onClick={onClose} role="button" tabIndex={0}>
        <FontAwesomeIcon icon={faTimes} className="search-icon" />
        <span className="search-text">Close</span>
      </div>
      <style jsx>{`
          .search-button {
              position: fixed;
              bottom: 1.5rem;
              left: 1.5rem;
              background-color: red;
              color: white;
              border-radius: 9999px;
              width: 56px;
              height: 56px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
              cursor: pointer;
              font-size: 0.75rem;
              padding: 0.2rem;
              text-align: center;
              z-index: 999;
          }
      
          .search-icon {
              font-size: 1.2rem;
          }
      
          .search-text {
              margin-top: 0.2rem;
              font-size: 0.6rem;
          }  
          .search-button.open {
              background-color: white;
              color: red;
          }
      
          @media (max-width: 767px) {
              .search-button {
              width: 44px;
              height: 44px;
              font-size: 0.65rem;
              padding: 0.15rem;
              }
              .search-icon {
              font-size: 1rem;
              }
      
              .search-text {
              font-size: 0.5rem;
              margin-top: 0.15rem;
              }
          }
      `}</style>
    </>
    )
}

