'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageToggle from '../component/LanguageToggleButton';
import DetailModal from '../component/DetailModal';
import AddReportButton from '../component/AddReportButton';
import { useLanguage } from "../context/LanguageContext";

export default function MissingPeoplePage() {
  const { t } = useLanguage();
  const [missingPeople, setMissingPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    async function fetchMissingPeople() {
      try {
        setLoading(true);
        const response = await fetch("https://kelselyay.onrender.com/api/reports/notfound", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`API issue when trying to fetch reports: ${response.status}`);
        }
        
        const data = await response.json();
        setMissingPeople(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMissingPeople();
  }, []);

  // Function to handle card click
  const handlePersonClick = (person) => {
    try {
      // Make a deep copy and normalize the data structure
      const personData = {...person};
      
      // Ensure ID is available in both formats (like in Mapbox.jsx)
      personData.id = personData._id || personData.id;
      personData._id = personData._id || personData.id;
      
      // Ensure all required fields exist to prevent undefined errors
      personData.reporterName = personData.reporterName || '';
      personData.missingPersonName = personData.missingPersonName || '';
      personData.phoneNumber = personData.phoneNumber || '';
      personData.missingPersonDescription = personData.missingPersonDescription || '';
      personData.relationshipToReporter = personData.relationshipToReporter || '';
      personData.locationOfMissingPerson = personData.locationOfMissingPerson || '';
      personData.timeSinceMissing = personData.timeSinceMissing || '';
      personData.imageUrl = personData.imageUrl || '/testPic.png';
      
      console.log("Setting selected person:", personData);
      setSelectedPerson(personData);
    } catch (err) {
      console.error("Error in handlePersonClick:", err);
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setSelectedPerson(null);
  };

  // Handle successful update from modal
  const handleDetailUpdate = (updatedPerson) => {
    // If the person is marked as found, remove them from the list
    if (updatedPerson.found) {
      setMissingPeople(prevPeople => 
        prevPeople.filter(person => 
          (person._id || person.id) !== (updatedPerson._id || updatedPerson.id)
        )
      );
      setSelectedPerson(null);
      return;
    }
    
    // Update the person in the local state
    setMissingPeople(prevPeople => 
      prevPeople.map(person => 
        (person._id || person.id) === (updatedPerson._id || updatedPerson.id) 
          ? updatedPerson 
          : person
      )
    );
    
    // Update the selected person so modal shows updated data
    setSelectedPerson(updatedPerson);
  };

  // Handle successful deletion from modal
  const handleDetailDelete = (deletedId) => {
    // Remove the person from local state
    setMissingPeople(prevPeople => 
      prevPeople.filter(person => 
        (person._id || person.id) !== deletedId
      )
    );
    setSelectedPerson(null);
  };

  // Handle new report submission
  const handleNewReport = (newReport) => {
    // Add the new report to the top of the list
    setMissingPeople(prev => [newReport, ...prev]);
    
    // Scroll to the top to show the new report
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen pb-24">
      {/* Sticky header with back button */}
      <div className="sticky-header">
        {/* <h1 className="page-title">Missing People</h1> */}
        <Link href="/" className="back-to-map-button pl-14">
          ← {t("Back to Map")}
        </Link>
        <div className="header-actions">
          <AddReportButton onReportSubmitted={handleNewReport} />
        </div>
      </div>
      
      {loading && <p className="text-center py-10">Loading...</p>}
      
      {error && <p className="text-red-500 text-center py-10">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {missingPeople.map((person) => (
            <div 
              key={person._id || person.id} 
              className="border rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow bg-white"
              onClick={() => {
                console.log("Card clicked", person);
                handlePersonClick(person);
              }}
              style={{ transition: "transform 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={person.imageUrl || '/testPic.png'} 
                  alt={person.missingPersonName || 'Missing person'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.src = '/testPic.png'}}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{person.missingPersonName || 'Unknown'}</h2>
                <p className="text-gray-600 mt-2">{t('Last seen') + ': ' + person.timeSinceMissing + ' ' + t('days ago')}</p>
                <p className="text-gray-700 mt-2 line-clamp-3">{person.missingPersonDescription || 'No description available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Language toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <LanguageToggle insideMenu={false} className="always-show" />
      </div>
      
      {/* Render DetailModal when a person is selected */}
      {selectedPerson && (
        <div className="modal-debug">
          <DetailModal 
            detail={selectedPerson}
            onClose={handleCloseModal}
            onUpdateSuccess={handleDetailUpdate}
            onDeleteSuccess={handleDetailDelete}
          />
        </div>
      )}
      
      {!loading && !error && missingPeople.length === 0 && (
        <p className="text-center py-10">No missing people reports found.</p>
      )}

    <style jsx>{`
      /* Modal debug styling */
      .modal-debug {
        position: relative;
        z-index: 10000;
      }

      /* Sticky header styles with mobile improvements */
      .sticky-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        padding: 1rem;
        border-bottom: 1px solid #eaeaea;
        margin-bottom: 1rem;
        z-index: 100;
        flex-wrap: wrap;
        gap: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      /* Add padding to the top of the container to account for the fixed header */
      :global(.container) {
        padding-top: 70px !important;
      }

      .page-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-right: auto;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .back-to-map-button {
        background-color: rgb(246, 59, 59);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        transition: background-color 0.3s ease;
        white-space: nowrap;
        margin-left: 1rem;
      }

      .back-to-map-button:hover {
        background-color: #2563eb;
      }

      /* Mobile optimizations */
      @media (max-width: 640px) {
        .sticky-header {
          padding: 0.7rem;
        }

        
        :global(.container) {
          padding-top: 60px !important;
        }
        
        .page-title {
          font-size: 1.25rem;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        
        .header-actions {
          width: auto;
          margin-right: 1rem;
        }
        
        .back-to-map-button {
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
        }
      }

      /* Very small screens */
      @media (max-width: 380px) {
        .header-actions {
          flex-direction: row;
          align-items: center;
          gap: 6px;
        }
        
        .back-to-map-button {
          font-size: 0.8rem;
          width: auto;
          text-align: center;
        }
      }

      /* AddReportButton style overrides */
      :global(.add-report-button) {
        position: relative !important;
        top: unset !important;
        left: unset !important;
        transform: none !important;
        background-color: red !important;
      }
      
      /* Additional styling for mobile */
      @media (max-width: 640px) {
        :global(.add-report-button) {
          padding: 0.4rem 0.8rem !important;
          font-size: 0.9rem !important;
          max-width: 175px !important;
          width: auto !important;
        }
        
        :global(.add-report-button .label) {
          font-size: 0.9rem !important;
        }
        
        :global(.add-report-button .icon) {
          font-size: 0.9rem !important;
        }
      }
      
      @media (max-width: 380px) {
        :global(.add-report-button) {
          width: auto !important;
          max-width: none !important;
        }
      }
    `}</style>
    </div>
  );
}