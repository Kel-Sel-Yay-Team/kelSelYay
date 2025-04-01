'use client';

import { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DetailModal from "./DetailModal";


const mapbox_accesstoken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function Mapbox() {
    const mapContainerRef = useRef(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [missingPeopleList, setMissingPeopleList] = useState([]);
    const mapRef = useRef(null); // Store map reference

    // Function to handle marker click
    const handleMarkerClick = (person) => {
        console.log("Marker clicked:", person);
        setSelectedPerson(person);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setSelectedPerson(null);
    };

    // Generate coordinates from a location string (simple random coordinates for demo)
    const generateCoordinates = (location) => {
        // For a real app, you would use a geocoding service here
        // For now, we'll generate random coordinates around Pittsburgh
        const baseLat = 40.44; // Pittsburgh
        const baseLng = -79.99;
        
        // Add some randomness to spread markers around
        const lat = baseLat + (Math.random() - 0.5) * 0.1;
        const lng = baseLng + (Math.random() - 0.5) * 0.1;
        
        return [lng, lat]; // Mapbox expects [longitude, latitude]
    };

    // Format time to match test data format
    const formatTimeSinceMissing = (hours) => {
        if (!hours && hours !== 0) return "Unknown";
        
        if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(hours / 24);
            const date = new Date();
            date.setDate(date.getDate() - days);
            const month = date.toLocaleString('default', { month: 'long' });
            return `${month} ${date.getDate()}, 2025 (${days} days ago)`;
        }
    };

    const fetchMissingPeople = async() => {
        try {
            const response = await fetch("http://localhost:3001/api/reports", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                mode: 'cors'
            });

            if(!response.ok) {
                throw new Error(`API issue when trying to fetch reports: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API data:", data);
            
            return data;
        } catch (error) {
            console.error("Error fetching missing people:", error);
            return [];
        }
    };

    // Function to add markers to the map
    const addMarkersToMap = (map, people) => {
        // Clear existing markers (if implementing refresh functionality)
        
        // Add markers for missing persons
        people.forEach((person) => {
            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'missing-person-marker';
            el.style.backgroundImage = `url(${person.imageUrl})`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid red'; // Add red border
            el.style.boxSizing = 'border-box'; // Ensure border is included in width/height
            el.style.cursor = 'pointer';
            
            // Add data attribute for identification
            el.dataset.personId = person.id;
            const lat = person.lat ? person.lat : 21.9162;
            const lng = person.lng ? person.lng : 95.9560;
            // Create marker
            const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .addTo(map);
            
            // Add click event
            el.addEventListener('click', () => {
                handleMarkerClick(person);
            });
        });
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Initialize map
        mapboxgl.accessToken = mapbox_accesstoken;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [95.9560, 21.9162],
            zoom: 5
        });
        
        // Store map reference
        mapRef.current = map;

        map.on('load', async () => {
            try {
                // Fetch missing people data from API
                const peopleData = await fetchMissingPeople();
                
                
                // Add markers to map
                addMarkersToMap(map, peopleData);
                
            } catch (error) {
                console.error("Error loading data:", error);
                // Fall back to test data if there's an error
                addMarkersToMap(map, test_data_detail);
            }

        });

        // Add geolocation control
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            })
        );

        return () => map.remove();
    }, []);

    return (
        <>
            <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
            
            {/* Render modal when a person is selected */}
            {selectedPerson && (
                <DetailModal 
                    detail={selectedPerson}
                    onClose={handleCloseModal}
                />
            )}
            
            {/* Add some basic styling for the markers */}
            <style jsx global>{`
                .missing-person-marker {
                    cursor: pointer;
                    z-index: 2;
                }
                
                .custom-marker {
                    z-index: 1;
                }
            `}</style>
        </>
    );
}

export default Mapbox;