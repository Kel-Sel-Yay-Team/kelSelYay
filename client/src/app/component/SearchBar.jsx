"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import FilterButton from "./FilterButton";

export default function SearchBar({ onInputChange, onApplyFilter }) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onInputChange(value);
  };

  return (
    <>
      <div className="add-report-button">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder={t("Search...")}
          className="label"
        />
        <FontAwesomeIcon icon={faSearch} className="icon" />
        <FilterButton onApplyFilter={onApplyFilter}/>
      </div>

      <style jsx>{`
        .add-report-button {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          color: red;
          border: none;
          border-radius: 9999px;
          padding: 0.6rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 999;
          width: 80%;
          max-width: 240px;
        }

        .icon {
          font-size: 1.1rem;
        }

        .label {
          background: transparent;
          border: none;
          color: red;
          font-size: inherit;
          font-weight: inherit;
          width: 100%;
          outline: none;
          line-height: 1;
        }

        .label::placeholder {
          color: red;
        }

        @media (min-width: 640px) {
          .add-report-button {
            padding: 0.7rem 1.4rem;
            font-size: 0.9rem;
            max-width: 260px;
          }
        }

        @media (min-width: 1024px) {
          .add-report-button {
            padding: 0.8rem 1.6rem;
            font-size: 0.95rem;
            max-width: 280px;
          }
        }

        @media (max-width: 320px) {
          .add-report-button {
            padding: 0.8rem 0.4rem;
            font-size: 0.7rem;
            max-width: 180px;
          }

          .icon {
            font-size: 0.6rem;
          }

          .label {
            line-height: 0.8;
          }
        }
      `}</style>
    </>
  );
}
