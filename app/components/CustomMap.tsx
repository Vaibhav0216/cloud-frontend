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

// Mumbai center
const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

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
        iconSize: [38, 38], // size of the icon
        iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -38], // point from which the popup should open relative to the iconAnchor
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
          center={MUMBAI_CENTER}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer url={tileUrl} attribution={attribution} />
          {customIcon && (
            <Marker position={MUMBAI_CENTER} icon={customIcon}>
              <Popup>Mumbai City</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </section>
  );
};

export default CustomMap;
