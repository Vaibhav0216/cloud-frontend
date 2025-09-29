"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

// dynamic imports for react-leaflet
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const Marker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false }
);
const Popup = dynamic(
  async () => (await import("react-leaflet")).Popup,
  { ssr: false }
);
const Tooltip = dynamic(
  async () => (await import("react-leaflet")).Tooltip,
  { ssr: false }
);


// Locations
const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];
const PUNE_CENTER: [number, number] = [18.5204, 73.8567];

const CustomMap: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const L = await import("leaflet");

      // Create a custom icon
      const icon = new L.Icon({
        iconUrl:
          "https://cdn-icons-png.flaticon.com/512/684/684908.png", // custom marker image
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      });

      if (mounted) {
        setCustomIcon(icon);
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const tileUrl = useMemo(
    () => "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    []
  );
  const attribution = useMemo(
    () =>
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    []
  );

  if (!ready) {
    return (
      <section className="w-full md:w-3/4 xl:w-[800px] mx-0 md:mr-auto h-[500px] rounded-xl border border-border bg-card shadow-sm animate-pulse flex items-center justify-center text-muted-foreground">
        Loading map...
      </section>
    );
  }

  return (
    <section className="w-full md:w-3/4 xl:w-[800px] mx-0 md:mr-auto rounded-xl border border-border bg-card shadow-sm md:shadow-md p-3 md:p-4">
      <div className="text-sm text-muted-foreground mb-2 md:mb-3 text-center md:text-left">
        Location Overview
      </div>

      <div className="w-full h-[500px] rounded-lg overflow-hidden">
        <MapContainer
          center={[18.8, 73.4]} // Center between Mumbai & Pune
          zoom={8}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer url={tileUrl} attribution={attribution} />

          {/* Mumbai Marker */}
          {customIcon && (
            <Marker position={MUMBAI_CENTER} icon={customIcon}>
                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                Mumbai
              </Tooltip>
              <Popup>
              <div className="text-sm">
                  <strong>Mumbai City</strong>
                  <br />
                  Population: 20M+
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pune Marker */}
          {customIcon && (
            <Marker position={PUNE_CENTER} icon={customIcon}>
               <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                Pune
              </Tooltip>
              <Popup>
              <div className="text-sm">
                  <strong>Pune City</strong>
                  <br />
                  Level: <span className="font-bold text-red-500">50 meters</span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </section>
  );
};

export default CustomMap;
