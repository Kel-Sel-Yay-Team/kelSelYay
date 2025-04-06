"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import MissingListModal from "./MissingListModal";
import DetailModal from "./DetailModal";

export default function SearchButton({ data, isOpen, setIsOpen }) {

  const {t} = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const toggleButton = () => {
    setIsOpen(!isOpen);
    setQuery(""); // Reset query on toggle
    // You can later handle popup logic here
    // if (isOpen) closePopup(); else openPopup();
  };

  const handleSearchInput = (text) => {
    setQuery(text.toLowerCase());
  };

//   const filteredData = useMemo(() => {
//     if (!query) return data;
//     return data.filter((person) => {
//       const name = person.missingPersonName || "";
//       const description = person.description?.toLowerCase() || "";
//       return name.includes(query) || description.includes(query);
//     });
//   }, [query, data]);

  const filteredData = useMemo(() => {
    if (!query) return data;
    
    const normalizedQuery = query.toLowerCase().trim();
  
    return data.filter((person) => {
      const name = person.missingPersonName?.toLowerCase().trim() || "";
      return name.includes(normalizedQuery);
    });
  }, [query, data]);

  return (
    <>
        <div className={`search-button ${isOpen ? "open" : ""}`} onClick={toggleButton} role="button" tabIndex={0}>
            <FontAwesomeIcon icon={ isOpen? faTimes: faSearch } className="search-icon" />
            <span className="search-text">{isOpen? t("Close") : t("Search")}</span>

            {/* Debug or test the data prop */}
            {/*
            {isOpen && (
            <div className="search-data-preview">
                <p>Total People: {data?.length || 0}</p>
                {/* Render a sample name or ID if you want */}
                {/* <pre>{JSON.stringify(data[0], null, 2)}</pre>
            </div>
            )}*/} 
        </div>
        {isOpen && (
            <div>
                <SearchBar onInputChange={handleSearchInput} />
                <MissingListModal data={filteredData} 
                showTitle={!query} 
                titleMessage={t("All Missing People")}
                onSelectPerson={(person) => setSelectedPerson(person)}/>
            </div>
        )}
        {selectedPerson && (
          <DetailModal
            detail={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            onUpdateSuccess={(updated) => {
              // Handle updates
              setSelectedPerson(null);
            }}
            onDeleteSuccess={(deletedId) => {
              // Handle deletion
              setSelectedPerson(null);
            }}
          />
        )}

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
  );
}
