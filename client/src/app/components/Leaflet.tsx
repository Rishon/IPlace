/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Spacetime DB
import { addTile } from "@/app/sdk/spacetimedb";

const LeafletMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const hoverRectRef = useRef<L.Rectangle | null>(null);

    const country = "Israel";

    const countryData = {
        Israel: {
            center: [31.7683, 35.2137] as [number, number],
            bounds: [
                [29.5, 34.2],
                [33.5, 35.9],
            ] as [[number, number], [number, number]],
            zoom: 8,
        },
    };

    useEffect(() => {
        let L: typeof import("leaflet");

        const loadMap = async () => {
            L = (await import("leaflet")).default;

            if (!mapRef.current) return;

            const config = countryData[country];
            const map = L.map(mapRef.current, {
                center: config.center,
                zoom: config.zoom,
                maxBounds: config.bounds,
                maxBoundsViscosity: 1.0,
                minZoom: config.zoom - 2,
                maxZoom: 19,
            });
            mapInstance.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
            }).addTo(map);

            const getStep = (zoom: number) => {
                if (zoom >= 14) return 0.0001;
                return 0;
            };

            map.on("mousemove", (e: L.LeafletMouseEvent) => {
                const zoom = map.getZoom();
                const step = getStep(zoom);

                if (step === 0) {
                    if (hoverRectRef.current) {
                        map.removeLayer(hoverRectRef.current);
                        hoverRectRef.current = null;
                    }
                    return;
                }

                const lat = Math.floor(e.latlng.lat / step) * step;
                const lng = Math.floor(e.latlng.lng / step) * step;

                const bounds: [[number, number], [number, number]] = [
                    [lat, lng],
                    [lat + step, lng + step],
                ];

                if (!hoverRectRef.current) {
                    hoverRectRef.current = L.rectangle(bounds, {
                        color: "#2563eb",
                        weight: 2,
                        fillOpacity: 0.3,
                    }).addTo(map);
                } else {
                    hoverRectRef.current.setBounds(bounds);
                }
            });

            map.on("mouseout", () => {
                if (hoverRectRef.current) {
                    map.removeLayer(hoverRectRef.current);
                    hoverRectRef.current = null;
                }
            });

            map.on("click", (e: L.LeafletMouseEvent) => {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                addTile({ latitude: lat, longitude: lng });

                console.log(`Map clicked at: ${lat}, ${lng}`);
            });
        };

        loadMap();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [countryData]);

    return <div ref={mapRef} className="w-full h-screen" />;
};

export default LeafletMap;
