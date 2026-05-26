import { useEffect, useRef } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import { tealMarkerIcon } from "./utils/mapIcons";

function AutoFlyToBounds({ locations, isActive }) {
    const map = useMap();
    const pendingBoundsRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        map.invalidateSize();

        if (pendingBoundsRef.current) {
            const bounds = pendingBoundsRef.current;
            pendingBoundsRef.current = null;

            setTimeout(() => {
                map.flyToBounds(bounds, {
                    padding: [60, 60],
                    maxZoom: 10,
                    duration: 1.5,
                    easeLinearity: 0.25,
                });
            }, 100);
        }
    }, [isActive]);

    useEffect(() => {
        if (!locations || locations.length === 0) return;

        const bounds = L.latLngBounds(
            locations
                .map(loc => loc.coords)
                .filter(c => Array.isArray(c) && c.length === 2)
        );

        if (!bounds.isValid()) return;

        const size = map.getSize();
        if (size.x === 0 || size.y === 0) {
            pendingBoundsRef.current = bounds;
            return;
        }

        pendingBoundsRef.current = null;
        map.flyToBounds(bounds, {
            padding: [60, 60],
            maxZoom: 10,
            duration: 1.5,
            easeLinearity: 0.25,
        });
    }, [locations]);

    return null;
}

function Map({ locations, polylineCoords, isActive = true }) {
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
                {locations.map(loc => (
                    <Marker key={loc.id} position={loc.coords} icon={tealMarkerIcon}>
                        <Tooltip permanent direction="top" offset={[2, -20]}>
                            {loc.name}
                        </Tooltip>
                    </Marker>
                ))}
                <AutoFlyToBounds locations={locations} isActive={isActive} />
                {locations.length > 1 && (
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