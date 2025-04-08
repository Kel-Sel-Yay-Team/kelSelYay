"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";

export default function FilterButton({ onApplyFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("all");
  const { t } = useLanguage();

  const applyFilter = () => {
    onApplyFilter(selected);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="filter-button">
        <FontAwesomeIcon icon={faFilter} />
      </button>

      {isOpen && (
        <div className="filter-modal">
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={selected === "all"}
              onChange={() => setSelected("all")}
            />{" "}
            {t("All")}
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="found"
              checked={selected === "found"}
              onChange={() => setSelected("found")}
            />{" "}
            {t("Found")}
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="notfound"
              checked={selected === "notfound"}
              onChange={() => setSelected("notfound")}
            />{" "}
            {t("Missing")}
          </label>
          <button className="apply-button" onClick={applyFilter}>{t("Apply")}</button>
        </div>
      )}

      <style jsx>{`
        .filter-button {
          padding: 0.25rem;
          border-radius: 999px;
          background-color: white;
          border: 1px solid #ddd;
        }

        .filter-modal {
          position: absolute;
          top: 4rem;
          left : 8rem;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 9999;
        }

        .apply-button {
            border: 1px solid red;
            padding: 0.5rem 1rem;
            background: none;
            border-radius: 10px;
            cursor: pointer;
            }
      `}</style>
    </>
  );
}
