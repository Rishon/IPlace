"use client"

import Leaflet from "@/app/components/Leaflet";
import { FaPaintBrush } from "react-icons/fa";

// Spacetime DB
import { connect } from "@/app/sdk/spacetimedb";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <Leaflet />

      <button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 z-[9999] hover:scale-105 transition-transform cursor-pointer flex items-center"
      >
        <FaPaintBrush className="mr-2" /> לצבוע
      </button>
    </div>
  );
}
