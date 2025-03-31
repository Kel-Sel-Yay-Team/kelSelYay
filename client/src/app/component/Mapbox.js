'use client';

import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const mapbox_accesstoken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function Mapbox() {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        mapboxgl.accessToken = mapbox_accesstoken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-79.999732, 40.4374],
            zoom: 11
        });

        map.on('load', () => {
            fetch('/trees.geojson')
                .then((response) => response.json())
                .then((data) => {
                    data.features.forEach((feature) => {
                        const { coordinates } = feature.geometry;
                        const { picture, dbh } = feature.properties;

                        console.log("Feature Coordinates:", coordinates); // Debug coordinates

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
                            .setLngLat(coordinates) // Ensure correct coordinates
                            .setPopup(
                                new mapboxgl.Popup({ offset: 25 })
                                    .setHTML(`<strong>DBH:</strong> ${dbh || 'N/A'}`)
                            )
                            .addTo(map);
                    });
                })
                .catch((error) => console.error('Error loading GeoJSON:', error));
        });

        return () => map.remove();
    }, []);

    return <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
}

export default Mapbox;