"use client";

import { useState } from "react";
import ReportMissingPerson from "./ReportMissingPerson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="add-report-button"
        onClick={() => setIsOpen(true)}
        aria-label="Add Report"
      >
        <span className="icon-stack">
          <FontAwesomeIcon icon={faFile} className="base-icon" />
          <span className="plus-icon-wrapper">
            <FontAwesomeIcon icon={faPlus} className="plus-icon" />
          </span>
        </span>
      </button>

      {isOpen && <ReportMissingPerson onClose={() => setIsOpen(false)} />}

      <style jsx>{`
        .add-report-button {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 9999px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          z-index: 999;
          transition: background-color 0.3s ease;
        }

        .add-report-button:hover {
          background-color: #4338ca;
        }

        .icon-stack {
          position: relative;
          display: inline-block;
          width: 24px;
          height: 24px;
        }

        .base-icon {
          font-size: 24px;
          position: relative;
        }

        .plus-icon-wrapper {
          position: absolute;
          bottom: -5px;
          right: -4px;
          background-color: ;
          border-radius: 9999px;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .plus-icon {
          font-size: 10px;
          color: #4f46e5;
        }
      `}</style>
    </>
  );
}
