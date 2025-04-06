"use client";

import { useLanguage } from "../context/LanguageContext";

export default function MissingListModal({ data = [], showTitle = true , onSelectPerson}) {
  const { t } = useLanguage();

  return (
    // <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 backdrop-blur-sm pt-22">

      <div className="modal-container">
        {showTitle && <span className="top-label">{t("All Missing People")}</span>}

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
        
            @media (max-width: 321px) {
                .modal-content {
                  max-height: 60vh;
                }

            .top-label{
              top: -1.1rem;
              left: 0.65rem;
              font-size: 0.65rem;
              font-weight: 600;
              color: white;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
