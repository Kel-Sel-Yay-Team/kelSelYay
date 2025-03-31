'use client';

import { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DetailModal from "./DetailModal";

const test_data_detail = [
    {
      id: 1,
      missingPersonName: "Sarah Johnson",
      phoneNumber: "412-555-0123",
      missingPersonDescription: "18-year-old female, 5'6\", blonde hair, blue eyes. Last seen wearing a red hoodie and jeans.",
      relationshipToReporter: "Sister",
      locationOfMissingPerson: "Oakland area near University of Pittsburgh",
      timeSinceMissing: "March 25, 2025 (6 days ago)",
      imageUrl: "/missing-person-1.jpg",
      coordinates: [-79.94606, 40.44961]
    },
    {
      id: 2,
      missingPersonName: "Michael Rodriguez",
      phoneNumber: "412-555-0187",
      missingPersonDescription: "32-year-old male, 6'0\", brown hair, brown eyes. Has a compass tattoo on right forearm.",
      relationshipToReporter: "Friend",
      locationOfMissingPerson: "Downtown Pittsburgh, near Point State Park",
      timeSinceMissing: "March 28, 2025 (3 days ago)",
      imageUrl: "/missing-person-2.jpg",
      coordinates: [-79.99732, 40.4374]
    },
    {
      id: 3,
      missingPersonName: "Emily Chen",
      phoneNumber: "412-555-0199",
      missingPersonDescription: "25-year-old female, 5'4\", black hair with purple highlights. Wearing glasses and a gray jacket.",
      relationshipToReporter: "Roommate",
      locationOfMissingPerson: "Shadyside neighborhood",
      timeSinceMissing: "March 29, 2025 (2 days ago)",
      imageUrl: "/missing-person-3.jpg",
      coordinates: [-79.93244, 40.43484]
    },
    {
      id: 4,
      missingPersonName: "David Williams",
      phoneNumber: "412-555-0144",
      missingPersonDescription: "45-year-old male, 5'11\", gray hair and beard. Has a limp in right leg.",
      relationshipToReporter: "Son",
      locationOfMissingPerson: "Strip District area",
      timeSinceMissing: "March 27, 2025 (4 days ago)",
      imageUrl: "/missing-person-4.jpg",
      coordinates: [-79.97294, 40.40908]
    }
];

const mapbox_accesstoken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function Mapbox() {
    const mapContainerRef = useRef(null);
    const [selectedPerson, setSelectedPerson] = useState(null);

    // Function to handle marker click
    const handleMarkerClick = (person) => {
        console.log("Marker clicked:", person);
        setSelectedPerson(person);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setSelectedPerson(null);
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        mapboxgl.accessToken = mapbox_accesstoken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [95.9560, 21.9162],
            zoom: 5
        });

        map.on('load', () => {
            // Add markers for missing persons
            test_data_detail.forEach((person) => {
                // Create custom marker element
                const el = document.createElement('div');
                el.className = 'missing-person-marker';
                el.style.backgroundImage = `url(${person.imageUrl})`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.style.width = '40px';
                el.style.height = '40px';
                el.style.borderRadius = '50%';
                el.style.cursor = 'pointer';
                
                // Add data attribute for identification
                el.dataset.personId = person.id;
                
                // Create marker
                const marker = new mapboxgl.Marker(el)
                    .setLngLat(person.coordinates)
                    .addTo(map);
                
                // Add click event
                el.addEventListener('click', () => {
                    handleMarkerClick(person);
                });
            });

            // Add regular GeoJSON markers
            fetch('/trees.geojson')
                .then((response) => response.json())
                .then((data) => {
                    data.features.forEach((feature) => {
                        const { coordinates } = feature.geometry;
                        const { picture, dbh } = feature.properties;

                        const imageUrl = picture || '/testPic.png';

                        const el = document.createElement('div');
                        el.className = 'custom-marker';
                        el.style.backgroundImage = `url(${imageUrl})`;
                        el.style.backgroundSize = 'cover';
                        el.style.width = '30px';
                        el.style.height = '30px';
                        el.style.borderRadius = '50%';
                        el.style.border = '2px solid white';

                        new mapboxgl.Marker(el)
                            .setLngLat(coordinates)
                            .addTo(map);
                    });
                })
                .catch((error) => console.error('Error loading GeoJSON:', error));
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