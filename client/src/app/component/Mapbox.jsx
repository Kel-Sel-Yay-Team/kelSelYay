'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DetailModal from "./DetailModal";
import AddReportButton from "./AddReportButton";
import OnboardingModal from './OnboardingModal';
import LanguageToggle from "./LanguageToggleButton";
import DonateButton from "./DonateButton";
import HelpButton from "./HelpButton";
import Menu from "./Menu";
import { getMissingPeople } from "@/utils/mongoHelper";
import { filter, getMarkers } from "@/utils/filterHelper";

const mapbox_accesstoken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function Mapbox() {
    const mapContainerRef = useRef(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const mapRef = useRef(null); // Store map reference
    const [missingPeople, setMissingPeople] = useState([]);
    const markersRef = useRef(new Map()); // Store markers by ID
    const [recievedNewPost, setRecievedNewPost] = useState(false);
    const [newReportCoords, setNewReportCoords] = useState(null);
    const [markerList, setMarkerList] = useState([]);
    const [clusteredData, setClusteredData] = useState(null)
    //for tutorial Box
    const [showOnboarding, setShowOnboarding] = useState(false);


    const handleMarkerClick = (coordKey, peopleAtLocation) => {
        // console.log("Marker clicked!", coordKey, peopleAtLocation?.length || 0);
        if (!peopleAtLocation || peopleAtLocation.length === 0) {
            return;
        }
        
        // Get the IDs of all people at this location to pass as query params
        const ids = peopleAtLocation.map(person => person._id || person.id).join(',');
        
        // Navigate to missing people page with these coordinate-specific people
        const [lat, lng] = coordKey.split(',');
        window.location.href = `/missing-people?lat=${lat}&lng=${lng}&ids=${ids}`;
    };
    // Function to close modal
    const handleCloseModal = () => {
        setSelectedPerson(null);
    };

    const handleOnboardingFinish = () => {
        setShowOnboarding(false);
    };

    // Handle successful update from modal
    const handleDetailUpdate = (updatedPerson) => {

        //special case if found / reportSighting was updated
        if (updatedPerson.found) {
            // ✅ REMOVE from missingPeople immediately
            setMissingPeople(prevPeople => 
                prevPeople.filter(person => 
                    (person._id || person.id) !== (updatedPerson._id || updatedPerson.id)
                )
            );
    
            // ✅ Optionally remove the marker too
            const personId = updatedPerson._id || updatedPerson.id;
            const marker = markersRef.current.get(personId);
            if (marker) {
                marker.remove();
                markersRef.current.delete(personId);
            }
    
            // ✅ Close the modal
            setSelectedPerson(null);
            return; // stop here since we don't need to update the marker visuals
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
        
        // Update the marker
        const personId = updatedPerson._id || updatedPerson.id;
        const marker = markersRef.current.get(personId);
        
        if (marker && marker.getElement()) {
            // Update the marker's image
            let imgUrl = updatedPerson.imageUrl;
            if(!imgUrl || imgUrl === 'https://example.com/image.jpg' || imgUrl === 'https://example.com/updated-image.jpg'){
                imgUrl = '/testPic.png';
            }
            
            const el = marker.getElement();
            el.style.backgroundImage = `url(${imgUrl})`;
        }
    };
    
    // Handle successful deletion from modal
    const handleDetailDelete = (deletedId) => {
        
        // Remove the person from local state
        setMissingPeople(prevPeople => 
            prevPeople.filter(person => 
                (person._id || person.id) !== deletedId
            )
        );
        
        // Remove the marker from the map
        const marker = markersRef.current.get(deletedId);
        if (marker) {
            marker.remove();
            markersRef.current.delete(deletedId);
        }
    };

    const handleNewReport = (newReport, existedCoor) => {
        setMissingPeople(prev => [...prev, newReport]);
        if(!existedCoor) {
            setNewReportCoords({
                lng: newReport.lng || 95.9560,
                lat: newReport.lat || 21.9162
            }
        )}

        setRecievedNewPost(true);
    }

    const fetchMissingPeople = async() => {
        const data = await getMissingPeople();
        const filteredMap = await filter(data);   
        setClusteredData(filteredMap);
        const markersCoor = getMarkers(filteredMap);                                        
        setMissingPeople(data); // Store fetched people in state
        setMarkerList(markersCoor);
        return data;
    };


    const addMarkersToMap = async (map, people) => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current.clear();
        
        const usedCoordinates = new Map();

        
        if (!people || !Array.isArray(people)) {
            console.error('Invalid people data provided to addMarkersToMap:', people);
            return;  // Exit early if data is invalid
        }

        const localClusteredData = await filter(people);

        Object.entries(localClusteredData).forEach(([coordKey, peopleAtLocation]) => {
            const [lat, lng] = coordKey.split(',').map(Number);
            const count = peopleAtLocation.length;

        
            if(count <= 5) {
                // Add markers for missing persons
                peopleAtLocation.forEach((person, index) => {
                            
                    // Create custom marker element
                    let imgUrl = person.imageUrl;
                    if(!imgUrl || imgUrl === 'https://example.com/image.jpg' || imgUrl === 'https://example.com/updated-image.jpg'){
                        imgUrl = '/testPic.png';
                    }


                    /* Marker CSS DO NOT TOUCH */
                    const el = document.createElement('div');
                    el.className = 'relative';

                    // Create the circular part with the image
                    const circle = document.createElement('div');
                    circle.className = 'w-10 h-10 rounded-full overflow-hidden border-2 border-red-500';
                    circle.style.backgroundImage = `url(${imgUrl})`;
                    circle.style.backgroundSize = 'cover';
                    circle.style.backgroundPosition = 'center';

                    // Create the teardrop point
                    const point = document.createElement('div');
                    point.className = 'absolute left-1/2 w-0 h-0';
                    point.style.transform = 'translateX(-50%)';
                    point.style.bottom = '-8px';
                    point.style.borderLeft = '6px solid transparent';
                    point.style.borderRight = '6px solid transparent';
                    point.style.borderTop = '10px solid #ef4444'; // red-500 color
                    point.style.zIndex = '-1'; // Place behind the circle

                    // Add a small connecting piece between the circle and point to avoid a gap
                    const connector = document.createElement('div');
                    connector.className = 'absolute left-1/2 w-4 h-2 bg-red-500';
                    connector.style.transform = 'translateX(-50%)';
                    connector.style.bottom = '-1px';
                    connector.style.zIndex = '-1'; // Place behind the circle

                    // Assemble the components
                    el.appendChild(circle);
                    el.appendChild(connector);
                    el.appendChild(point);

                    // Add any additional styling like drop shadow
                    el.style.filter = 'drop-shadow(0 3px 3px rgba(0, 0, 0, 0.3))';

                    // Append to the desired parent element
                    document.body.appendChild(el);
                    
                    /* Marker CSS ENDS HERE DO NOT TOUCH */

                    // Add data attribute for identification
                    el.dataset.personId = person._id || person.id;
                    
                    // Get coordinates with offset to prevent exact overlaps
                    let lat = person.lat ? person.lat : 21.9162;
                    let lng = person.lng ? person.lng : 95.9560;
                    
                    // Create a unique key for these coordinates
                    const coordKey = `${lat},${lng}`;
                    
                    // If these exact coordinates are already used, offset slightly
                    if (usedCoordinates.has(coordKey)) {
                        const offset = usedCoordinates.get(coordKey) * 0.001; // Small offset
                        lat += offset;
                        lng += offset;
                        usedCoordinates.set(coordKey, usedCoordinates.get(coordKey) + 1);
                    } else {
                        usedCoordinates.set(coordKey, 1);
                    }
                    
                    
                    try {
                        // Create marker
                        const marker = new mapboxgl.Marker(el)
                            .setLngLat([lng, lat])
                            .addTo(map);
                        
                        // Store marker reference by person ID for later updates
                        markersRef.current.set(person._id || person.id, marker);
                        
                        // Add click event
                        el.addEventListener('click', () => {
                            // Make a deep copy to avoid reference issues
                            const personData = {...person};
                            // Ensure the Modal has all needed fields
                            personData.id = personData._id || personData.id;
                            handleMarkerClick(personData);
                        });
                        
                    } catch (error) {
                        throw new Error("Something went wrong");
                    }
                });
            } 
            else {
                // Create marker element
                const el = document.createElement('div');
                el.className = 'marker-wrapper'; // New wrapper class
                
                const markerContent = document.createElement('div');
                markerContent.className = 'marker-cluster';
                
                const circle = document.createElement('div');
                circle.className = 'cluster-circle';
                circle.textContent = count;
                
                // Add color based on count
                if (count < 2) {
                    circle.classList.add('count-1');
                } else if (count < 5) {
                    circle.classList.add('count-small');
                } else if (count < 10) {
                    circle.classList.add('count-medium');
                } else {
                    circle.classList.add('count-large');
                }
                
                const point = document.createElement('div');
                point.className = 'cluster-point';
                
                // Update the DOM structure
                markerContent.appendChild(circle);
                markerContent.appendChild(point);
                el.appendChild(markerContent);
                el.dataset.coordKey = coordKey;
                
                try {
                    const marker = new mapboxgl.Marker({
                        element: el,
                        anchor: 'bottom', 
                        offset: [0, 0]   
                    })
                    .setLngLat([lng, lat])
                    .addTo(map);
                    
                    // Store marker reference
                    markersRef.current.set(coordKey, marker);
                    
                    // Add click event to the wrapper element
                    el.addEventListener('click', () => {
                        handleMarkerClick(coordKey, peopleAtLocation);
                    });
                    
                } catch (error) {
                    console.error("Failed to create marker:", error);
                }
            }
        });
    };

    useEffect(() => {
        mapboxgl.accessToken = mapbox_accesstoken;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [96.0891, 21.9588],
            zoom: 13
        });
        
        // Store map reference
        mapRef.current = map;

        map.on('load', async () => {
            try {
                const peopleData = await fetchMissingPeople();           
                addMarkersToMap(map, peopleData);           
            } catch (error) {
                addMarkersToMap(map, []);
            }
        });

        // Add geolocation control
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true,
            })
        );
        
        //for testing in development
        
        if (process.env.NODE_ENV === 'development') {
            setShowOnboarding(true); // always show in dev
        } else if (!localStorage.getItem("hasSeenOnboarding")) {
            setShowOnboarding(true);
        }

        if (!localStorage.getItem("hasSeenOnboarding")) {
            setShowOnboarding(true);
        }
        return () => map.remove();
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            addMarkersToMap(mapRef.current, missingPeople);
        }
    }, [missingPeople]);

    // useEffect(() => {
    //     // const isMobile = window.innerWidth < 769;
    //     const isMobile = window.matchMedia( "(max-width: 768px)" ).matches;
    //     if (recievedNewPost && newReportCoords && mapRef.current) {
    //         if(isMobile)
    //         {
    //             mapRef.current.setCenter([newReportCoords.lng, newReportCoords.lat]);
    //         }
    //         else
    //         {
    //             mapRef.current.flyTo({
    //                 center: [newReportCoords.lng, newReportCoords.lat],
    //                 ...(isMobile? {} : {zoom: 15}),
    //                 speed: 1.2,
    //                 ...(isMobile? {} : {curve: 1.3}),
    //                 essential: true
    //             });
    //         }
            
    //         setTimeout(() => {
    //             setRecievedNewPost(false);
    //         }, 100);
    //     }
    // }, [recievedNewPost, newReportCoords]);

    useEffect(() => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
      
        if (recievedNewPost && newReportCoords && mapRef.current) {
          if (isMobile) {
            document.activeElement?.blur(); // blur input
      
            const meta = document.querySelector('meta[name=viewport]');
            const originalContent = meta?.getAttribute('content');
      
            if (meta) {
              meta.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=1.0'
              );
      
              setTimeout(() => {
                // Restore original zoom behavior
                meta.setAttribute(
                  'content',
                  originalContent || 'width=device-width, initial-scale=1.0'
                );
                mapRef.current.flyTo({
                    center: [newReportCoords.lng, newReportCoords.lat],
                    zoom: 15,
                    speed: 1.2,
                    curve: 1.3,
                    essential: true
                  });
                  setTimeout(() => {
                    setRecievedNewPost(false);
                  }, 500);
              }, 300);
            } 
            else 
            {
              // Fallback if no meta tag found
              mapRef.current.setCenter([newReportCoords.lng, newReportCoords.lat]);
              setRecievedNewPost(false);
            }

          } 
          else 
          {
            // Desktop flyTo
            mapRef.current.flyTo({
              center: [newReportCoords.lng, newReportCoords.lat],
              zoom: 15,
              speed: 1.2,
              curve: 1.3,
              essential: true
            });
            setTimeout(() => {
              setRecievedNewPost(false);
            }, 500);
          }
        }
      }, [recievedNewPost, newReportCoords]);

    useEffect(() => {
        // Disable scrolling on body
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    return (
        <>
            <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
            <LanguageToggle insideMenu={false}/>
            {showOnboarding && <OnboardingModal onFinish={handleOnboardingFinish} />}
            
            {/* Render modal when a person is selected */}
            {/* {selectedPerson && (
                <Link href="/missing-people"></Link>
                // <DetailModal 
                //     detail={selectedPerson}
                //     onClose={handleCloseModal}
                //     onUpdateSuccess={handleDetailUpdate}
                //     onDeleteSuccess={handleDetailDelete}
                // />
            // )} */}
            <DonateButton />
            <HelpButton/>
            
            {/* Add the mobile menu component */}
            <Menu />
            
            {/* Floating button */}
            <AddReportButton onReportSubmitted={handleNewReport}/>
            {/* Add some basic styling for the markers */}
            <style jsx global>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                }
                
                #map {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100vh; 
                }
                .missing-person-marker {
                    cursor: pointer;
                    z-index: 2;
                }
                
                .custom-marker {
                    z-index: 1;
                }
                
                .marker-cluster {
                    position: relative;
                    width: 36px;
                    height: 46px;
                    cursor: pointer;
                    // pointer-events: none;
                }
                
                .cluster-circle {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: #ef4444;
                    color: white;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    border: 2px solid white;
                }
                
                .cluster-point {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 10px solid #ef4444;
                }
                
                .count-1 {
                    background-color: #ef4444;
                }
                
                .count-small {
                    background-color: #f97316;
                }
                
                .count-medium {
                    background-color: #eab308;
                }
                
                .count-large {
                    background-color: #84cc16;
                }
                .marker-wrapper {
                        cursor: pointer;
                        will-change: transform; /* Optimizes for animation */
                    }
                
                .marker-cluster {
                    position: relative;
                    width: 36px;
                    height: 46px;
                    pointer-events: none; /* Makes click pass through to wrapper */
                }
                
                .cluster-circle {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: #ef4444;
                    color: white;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    border: 2px solid white;
                }
                
                .cluster-point {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 10px solid #ef4444;
                }
    
                /* Color classes remain the same */
                .count-1 {
                    background-color: #84cc16; /* least impacted */
                }

                .count-small {
                    background-color: #eab308;
                }

                .count-medium {
                    background-color: #f97316;
                }

                .count-large {
                    background-color: #ef4444; /* most impacted */
                }

                /* Marker point colors should match circle colors */
                .count-1 + .cluster-point {
                    border-top-color: #84cc16;
                }

                .count-small + .cluster-point {
                    border-top-color: #eab308;
                }

                .count-medium + .cluster-point {
                    border-top-color: #f97316;
                }

                .count-large + .cluster-point {
                    border-top-color: #ef4444;
                }

            `}</style>
        </>
    );
}

export default Mapbox;