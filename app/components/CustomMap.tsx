"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

// react-leaflet parts are dynamically imported to avoid SSR issues
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

// Patch default Leaflet marker icons for Next.js using CDN icon URLs
// Also lazy-load leaflet only on client to avoid "window is not defined"
const configureLeafletIcons = async () => {
  const L = await import("leaflet");
  // @ts-ignore - patch private property
  delete (L.Icon as any).Default.prototype._getIconUrl;
  (L.Icon as any).Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

// Mumbai
const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

const CustomMap: React.FC = () => {
  // Render only after client hydration + icon configuration
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    configureLeafletIcons().finally(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // OpenStreetMap tiles
  const tileUrl = useMemo(
    () => "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    []
  );
  const attribution = useMemo(
    () =>
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    []
  );

  // Loading skeleton before map is ready
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
          <Marker position={MUMBAI_CENTER}>
            <Popup>Mumbai City</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default CustomMap;
