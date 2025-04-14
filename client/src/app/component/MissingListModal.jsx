"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../context/LanguageContext";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function MissingListModal({ data = [], showTitle = true , titleMessage, onSelectPerson, onClose}) {
  const { t } = useLanguage();

  // console.log("Modal rendering!");
  // console.log("Modal data:", data);

  return (
    // <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 backdrop-blur-sm pt-20">
      <div className="modal-container">
      <button className="close-button" onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {showTitle && <span className="top-label">{titleMessage || t("Default Missing People")}</span>}
        <button className="close-button" onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="modal-content">
          <div className="scroll-area">
            {data.length === 0 ? (
              <p className="no-data">{t("No results found.")}</p>
            ) : (
              <ul className="people-list">
                {data.map((person) => (
                    <li 
                      key={person._id || person.id} 
                      className="person-card"
                      onClick={() => onSelectPerson?.(person)} // 🪄 add this line
                    >
                    <img
                      src={person.imageUrl || "/placeholder.jpg"}
                      alt={person.missingPersonName || "Missing"}
                      className="person-image"
                      loading="lazy"
                    />
                    <div className="person-info">
                      <strong>{person.missingPersonName || t("Unknown Name")}</strong>
                      {/* <p className="desc">
                        {person.description || t("No description provided")}
                      </p> */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <style jsx>{`
          .modal-container {
            position: relative;
            width: 90%;
            max-width: 640px;
            max-height: calc(63vh + 2rem); /* extra height to accommodate label */
            display: flex;
            flex-direction: column;
            align-items: stretch;

          }

          .top-label {
            position: absolute;
            top: -1.2rem;
            left: 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
          }

          .modal-content {
            width: 100%;
            max-height: 75vh;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            padding: 1rem;
            color: #000;
            display: flex;
            flex-direction: column;
          }

          .scroll-area {
            overflow-y: auto;
            flex: 1;
          }

          .people-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .person-card {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.25rem;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.04);
          }

          .person-image {
            border-radius: 9999px;
            border: 2px solid red;
            object-fit: cover;
            width: 48px;
            height: 48px;
          }

          .person-info {
            display: flex;
            flex-direction: column;
            font-size: 0.95rem;
          }

          .desc {
            font-size: 0.85rem;
            color: #555;
          }

          .no-data {
            text-align: center;
            // margin-top: 2rem;
            font-size: 1rem;
            color: #666;
          }
          
          .close-button {
            position: absolute;
            top: -15px;
            right: -15px;
            width: 30px;
            height: 30px;
            background-color: red;
            border: none;
            border-radius: 50%;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 10;
            font-size: 1rem;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }
                  
          .close-button:hover {
            background-color: #b71c1c;
          }

          @media (max-width: 768px) {
            .close-button{  
              top: -11px;
              right: -11px;
              width: 22px;
              height: 22px;
            }
          }
  
          @media (max-width: 425px) {
            .modal-content {
                  max-height: 60vh;
            }

            .top-label{
              top: -1.1rem;
              left: 0.5rem;
              font-size: 0.65rem;
              font-weight: 600;
              color: white;
            }
          }
        
          @media (max-width: 375px) {

            .top-label{
              top: -1.0rem;
              font-size: 0.6rem;
            }
          }
        
          @media (max-width: 321px) {

            .top-label{
              top: -1.0rem;
              left: 0.5rem;
              font-size: 0.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
