'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DetailModal from "./DetailModal";
import AddReportButton from "./AddReportButton";
import OnboardingModal from './OnboardingModal';
import LanguageToggle from "./LanguageToggleButton";
import HelpButton from "./HelpButton";
import SearchButton from "./SearchButton";
import { getMissingPeople } from "@/utils/mongoHelper";
import { filter, getMarkers } from "@/utils/filterHelper";
import MissingListModal from "./MissingListModal";
import CloseButton from "./CloseButton";
import { useLanguage } from "../context/LanguageContext";

const mapbox_accesstoken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function Mapbox() {
    const mapContainerRef = useRef(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const mapRef = useRef(null); // Store map reference
    const [missingPeople, setMissingPeople] = useState([]);
    const markersRef = useRef(new Map()); // Store markers by ID
    const [recievedNewPost, setRecievedNewPost] = useState(false);
    const [newReportCoords, setNewReportCoords] = useState(null);
    const [existingReportCoords, setExistingReportCoords] = useState(null);
    const [markerList, setMarkerList] = useState([]);
    const [clusteredData, setClusteredData] = useState(null)
    //for tutorial Box
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [clusterModalPeople, setClusterModalPeople] = useState([]);
    const { t } = useLanguage()

    // Function to handle when cluster marker is clicked
    const handleClusterMarkerClick = (coordKey, peopleAtLocation) => {
        // console.log("Marker clicked!", coordKey, peopleAtLocation?.length || 0);
        if (!peopleAtLocation || peopleAtLocation.length === 0) return;
        setClusterModalPeople(peopleAtLocation);
    };

    // Function to handle when individual marker is clicked
    const handleIndividualMarkerClick = (person) => {
        setSelectedPerson(person);
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
        else{
            setExistingReportCoords({
                lng: newReport.lng || 95.9560,
                lat: newReport.lat || 21.9162
            })
        }
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
                    
                    const personData = {...person};

                                        // Create custom marker element
                    let imgUrl = person.imageUrl;
                    if(!imgUrl || imgUrl === 'https://example.com/image.jpg' || imgUrl === 'https://example.com/updated-image.jpg'){
                        imgUrl = '/testPic.png';
                    }


                    /* Marker CSS DO NOT TOUCH */
                    const el = document.createElement('div');
                    el.className = 'relative';

                    el.style.cursor = 'pointer';
                    el.style.pointerEvents = 'auto';

                    // --- Circle (Image) ---
                    const circle = document.createElement('div');
                    circle.style.width = '40px';
                    circle.style.height = '40px';
                    circle.style.borderRadius = '9999px'; // fully rounded
                    circle.style.overflow = 'hidden';
                    circle.style.border = '2px solid #ef4444';
                    circle.style.backgroundImage = `url(${imgUrl})`;
                    circle.style.backgroundSize = 'cover';
                    circle.style.backgroundPosition = 'center';

                    // --- Connector (small rectangle) ---
                    const connector = document.createElement('div');
                    connector.style.position = 'absolute';
                    connector.style.left = '50%';
                    connector.style.width = '16px';
                    connector.style.height = '8px';
                    connector.style.backgroundColor = '#ef4444';
                    connector.style.transform = 'translateX(-50%)';
                    connector.style.bottom = '-1px';
                    connector.style.zIndex = '-1';

                    // --- Teardrop Point ---
                    const point = document.createElement('div');
                    point.style.position = 'absolute';
                    point.style.left = '50%';
                    point.style.width = '0';
                    point.style.height = '0';
                    point.style.transform = 'translateX(-50%)';
                    point.style.bottom = '-8px';
                    point.style.borderLeft = '6px solid transparent';
                    point.style.borderRight = '6px solid transparent';
                    point.style.borderTop = '10px solid #ef4444';
                    point.style.zIndex = '-1';

                    // Assemble the components
                    el.appendChild(circle);
                    el.appendChild(connector);
                    el.appendChild(point);

                    // Add any additional styling like drop shadow
                    el.style.filter = 'drop-shadow(0 3px 3px rgba(0, 0, 0, 0.3))';

                    /* Marker CSS ENDS HERE DO NOT TOUCH */

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

                        // Add click event
                        el.addEventListener('click', () => {

                            handleIndividualMarkerClick(personData);
                        });

                         // Create marker
                        const marker = new mapboxgl.Marker(el)
                            .setLngLat([lng, lat])
                            .addTo(map);

                        markersRef.current.set(personData._id || personData.id, marker);

                        
                    } catch (error) {
                        throw new Error("Something went wrong");
                    }
                });
            } 
            else {

                /* Marker CSS DO NOT TOUCH */

                // // Create marker element
                // const cluster_el = document.createElement('div');
                // cluster_el.className = 'relative'; // New wrapper class

                // // Create the circular part for the cluster count
                // const clustercircle = document.createElement('div');
                // clustercircle.className = 'w-10 h-10 rounded-full overflow-hidden border-2 border-white flex items-center justify-center font-bold text-sm';
                // clustercircle.style.backgroundColor = 
                //     count <= 5 ? '#eab308' : '#ffffff'; // dynamic color
                // clustercircle.textContent = count;
                // clustercircle.style.color= 'red';
                // clustercircle.style.borderColor = 'red';

                // // Create the teardrop point
                // const clusterpoint = document.createElement('div');
                // clusterpoint.className = 'absolute left-1/2 w-0 h-0';
                // clusterpoint.style.transform = 'translateX(-50%)';
                // clusterpoint.style.bottom = '-8px';
                // clusterpoint.style.borderLeft = '6px solid transparent';
                // clusterpoint.style.borderRight = '6px solid transparent';
                // clusterpoint.style.borderTop = count < 10 ? '10px solid #eab308' : '10px solid #ef4444';
                // clusterpoint.style.zIndex = '-1';

                // // Create connector to avoid gap
                // const clusterconnector = document.createElement('div');
                // clusterconnector.className = 'absolute left-1/2 w-4 h-2';
                // clusterconnector.style.backgroundColor = count < 10 ? '#eab308' : '#ef4444';
                // clusterconnector.style.transform = 'translateX(-50%)';
                // clusterconnector.style.bottom = '-1px';
                // clusterconnector.style.zIndex = '-1';

                // // Assemble cluster marker
                // cluster_el.appendChild(clustercircle);
                // cluster_el.appendChild(clusterconnector);
                // cluster_el.appendChild(clusterpoint);
                // cluster_el.style.filter = 'drop-shadow(0 3px 3px rgba(0, 0, 0, 0.3))';
                
                /* Marker CSS ENDS */

                /* Marker CSS DO NOT TOUCH */

                // ===== DYNAMIC SIZE CALCULATION =====
                const baseSize = 40;
                const growthFactor = Math.ceil((count - 5) / 5);
                const cap_count = count <= 60 ? count : 60;
                const newSize = cap_count <= 5 ? baseSize : baseSize + (baseSize / 40) * growthFactor;
                const newFontSize = cap_count <= 5 ? 14 : 14 + growthFactor * 1.2;

                // Color logic 
                const baseColor = count <= 5 ? '#eab308' : '#ffffff';
                const pointColor = count < 10 ? '#eab308' : '#ef4444';

                // ===== CLUSTER MARKER ELEMENT =====
                const cluster_el = document.createElement('div');
                cluster_el.className = 'relative';
                

                // ===== CLUSTER CIRCLE =====
                const clustercircle = document.createElement('div');
                clustercircle.className = 'rounded-full overflow-hidden border-2 border-white flex items-center justify-center font-bold';
                clustercircle.style.width = `${newSize}px`;
                clustercircle.style.height = `${newSize}px`;
                clustercircle.style.backgroundColor = baseColor;
                clustercircle.textContent = count;
                clustercircle.style.color = 'red';
                clustercircle.style.borderColor = 'red';
                clustercircle.style.fontSize = `${newFontSize}px`;

                // ===== POINT =====
                const pointWidth = newSize * 0.25;
                const pointHeight = newSize * 0.45;

                const clusterpoint = document.createElement('div');
                clusterpoint.className = 'absolute left-1/2';
                clusterpoint.style.width = '0';
                clusterpoint.style.height = '0';
                clusterpoint.style.transform = 'translateX(-50%)';
                clusterpoint.style.bottom = `-${pointHeight * 0.75}px`;
                clusterpoint.style.borderLeft = `${pointWidth}px solid transparent`;
                clusterpoint.style.borderRight = `${pointWidth}px solid transparent`;
                clusterpoint.style.borderTop = `${pointHeight}px solid ${pointColor}`;
                clusterpoint.style.zIndex = '-1';

                // ===== ASSEMBLE CLUSTER MARKER =====
                cluster_el.appendChild(clustercircle);
                // cluster_el.appendChild(clusterconnector);
                cluster_el.appendChild(clusterpoint);
                cluster_el.style.filter = 'drop-shadow(0 3px 3px rgba(0, 0, 0, 0.3))';

                // DYNAMIC MARKER ENDS HERE
              
                cluster_el.dataset.coordKey = coordKey;
                
                try {
                    const marker = new mapboxgl.Marker({
                        element: cluster_el,
                        anchor: 'bottom', 
                        offset: [0, 0]   
                    })
                    .setLngLat([lng, lat])
                    .addTo(map);
                    
                    // Store marker reference
                    markersRef.current.set(coordKey, marker);
                    
                    // Add click event to the wrapper element
                    cluster_el.addEventListener('click', () => {
                        handleClusterMarkerClick(coordKey, peopleAtLocation);
                    });
                    
                } catch (error) {
                    console.error("Failed to create marker:", error);
                }
                /* Marker CSS ENDS */
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

    useEffect(() => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        
        const coords = existingReportCoords || newReportCoords;

        if (recievedNewPost && mapRef.current && coords) {
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
                    center: [coords.lng, coords.lat],
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
              mapRef.current.setCenter([coords.lng, coords.lat]);
              setRecievedNewPost(false);
            }

          } 
          else 
          {
            // Desktop flyTo
            mapRef.current.flyTo({
              center: [coords.lng, coords.lat],
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
      }, [recievedNewPost, newReportCoords, existingReportCoords]);

    // useEffect(() => {
    //     // Disable scrolling on body
    //     document.body.style.overflow = 'hidden';
    //     document.documentElement.style.overflow = 'hidden';
        
    //     // Re-enable scrolling when component unmounts
    //     return () => {
    //         document.body.style.overflow = '';
    //         document.documentElement.style.overflow = '';
    //     };
    // }, []);

    return (
        <>
            <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
            <LanguageToggle insideMenu={false}/>
            {showOnboarding && <OnboardingModal onFinish={handleOnboardingFinish} />}
            
            {/* Render modal when a person is selected */}
            {selectedPerson && (
                <DetailModal 
                    detail={selectedPerson}
                    onClose={handleCloseModal}
                    onUpdateSuccess={handleDetailUpdate}
                    onDeleteSuccess={handleDetailDelete}
                />
            )} 
            {/* <DonateButton /> */}
            {clusterModalPeople.length > 0 ? (
              <CloseButton onClose={() => setClusterModalPeople([])} />
            ) : (
              <SearchButton 
                data={missingPeople} 
                isOpen={searchMode} 
                setIsOpen={setSearchMode} 
              />
            )}
            {/* <SearchButton data={missingPeople} isOpen={searchMode} setIsOpen={setSearchMode}/> */}
            {clusterModalPeople.length > 0 && (
              <MissingListModal 
                data={clusterModalPeople} 
                showTitle={true}
                titleMessage={`${clusterModalPeople[0].locationOfMissingPerson} ${t("Missing People")}` || `${lat}, ${lng}`}
                onSelectPerson={(person) => {
                  setSelectedPerson(person);
                }}
              />
            )}
            <HelpButton/>
            
            {/* Add the mobile menu component */}
            {/* <Menu /> */}
            
            {/* Floating button */}
            <div className={searchMode ? 'hidden' : 'block'}>
              <AddReportButton onReportSubmitted={handleNewReport} />
            </div>
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