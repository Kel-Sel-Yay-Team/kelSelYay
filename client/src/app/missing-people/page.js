'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageToggle from '../component/LanguageToggleButton';

export default function MissingPeoplePage() {
  const [missingPeople, setMissingPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Missing People</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Back to Map
        </Link>
      </div>
      

      
      {loading && <p className="text-center py-10">Loading...</p>}
      
      {error && <p className="text-red-500 text-center py-10">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPeople.map((person) => (
            <div key={person._id || person.id} className="border rounded-lg overflow-hidden shadow-md">
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
                <p className="text-gray-600 mt-2">Last seen: {person.timeSinceMissing} days ago</p>
                <p className="text-gray-700 mt-2 line-clamp-3">{person.missingPersonDescription || 'No description available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

        <div className="fixed bottom-4 right-4 z-50">
            <LanguageToggle insideMenu={false} className="always-show" />
        </div>
      
      {!loading && !error && missingPeople.length === 0 && (
        <p className="text-center py-10">No missing people reports found.</p>
      )}
    </div>
  );
}