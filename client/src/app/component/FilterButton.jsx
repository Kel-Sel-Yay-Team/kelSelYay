"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export default function FilterButton({ onApplyFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("all");

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
            All
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="found"
              checked={selected === "found"}
              onChange={() => setSelected("found")}
            />{" "}
            Found
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="notfound"
              checked={selected === "notfound"}
              onChange={() => setSelected("notfound")}
            />{" "}
            Not Found
          </label>
          <button className="apply-button" onClick={applyFilter}>Apply</button>
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
