import {
    MapContainer,
    Marker,
    Polyline,
    TileLayer,
    Tooltip,
    useMap
} from "react-leaflet";

import { tealMarkerIcon } from "./utils/mapIcons";
import { useEffect, useRef } from "react";
import L from "leaflet";

function Map({ locations, polylineCoords }) {

    function AutoFlyToBounds({ locations }) {

        const map = useMap();
        const timeoutRef = useRef(null);

        useEffect(() => {

            const validLocations = locations.filter(
                loc =>
                    Array.isArray(loc.coords) &&
                    loc.coords.length === 2 &&
                    !isNaN(loc.coords[0]) &&
                    !isNaN(loc.coords[1])
            );

            if (validLocations.length === 0) return;

            const bounds = L.latLngBounds(
                validLocations.map(loc => loc.coords)
            );

            if (!bounds.isValid()) return;

            // Clear previous pending animation
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {

                // stop previous running animation
                map.stop();

                if (validLocations.length === 1) {

                    map.flyTo(validLocations[0].coords, 8, {
                        duration: 1.5,
                    });

                    return;
                }

                map.flyToBounds(bounds, {
                    padding: [60, 60],
                    maxZoom: 8,
                    duration: 1.5,
                    easeLinearity: 0.25,
                });

            }, 150);

            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };

        }, [locations, map]);

        return null;
    }

    const validLocations = locations.filter(
        loc =>
            Array.isArray(loc.coords) &&
            loc.coords.length === 2 &&
            !isNaN(loc.coords[0]) &&
            !isNaN(loc.coords[1])
    );

    return (
        <div className="h-full w-full">

            <MapContainer
                className="h-full w-full"
                style={{ zIndex: 0 }}
                center={[21.1458, 79.0882]}
                zoom={5}
                scrollWheelZoom={true}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {validLocations.map(loc => (
                    <Marker
                        key={loc.id}
                        position={loc.coords}
                        icon={tealMarkerIcon}
                    >
                        <Tooltip
                            permanent
                            direction="top"
                            offset={[2, -20]}
                        >
                            {loc.name}
                        </Tooltip>
                    </Marker>
                ))}

                <AutoFlyToBounds locations={validLocations} />

                {polylineCoords.length > 1 && (
                    <Polyline
                        positions={polylineCoords}
                        color="#149b90"
                        weight={5}
                    />
                )}

            </MapContainer>

        </div>
    );
}

export default Map;