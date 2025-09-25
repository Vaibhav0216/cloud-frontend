"use client";

import React from "react";
import {
  Battery,
  Droplets,
  Gauge,
  Activity,
  TrendingUp,
  Zap,
  Thermometer,
  Star,
} from "lucide-react";

type CardColor = "blue" | "green" | "red" | "orange";

type StatCard = {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: CardColor;
};

const colorTextMap: Record<CardColor, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  orange: "text-orange-500",
};

const colorIconMap: Record<CardColor, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  orange: "text-orange-500",
};

const defaultCards: StatCard[] = [
  {
    id: "filter-tank",
    icon: <Droplets className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Filter Tank Level",
    value: 79,
    unit: "%",
    color: "blue",
  },
  {
    id: "battery-bund",
    icon: <Battery className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Battery Voltage Bund Pump",
    value: 24.59,
    unit: "V.DC",
    color: "green",
  },
  {
    id: "flow-rate",
    icon: <Activity className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Flow rate",
    value: 0,
    unit: "m³/hr",
    color: "blue",
  },
  {
    id: "level-low",
    icon: <Gauge className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Level Set Low",
    value: 80,
    unit: "%",
    color: "orange",
  },
  {
    id: "level-high",
    icon: <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Level High Set",
    value: 98,
    unit: "%",
    color: "red",
  },
  {
    id: "consumption",
    icon: <Zap className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Daily Consumption",
    value: 821520,
    unit: "ltrs",
    color: "red",
  },
  {
    id: "battery-filter",
    icon: <Battery className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Battery Voltage Filter House",
    value: 25.71,
    unit: "V.DC",
    color: "green",
  },
  {
    id: "auto-manual",
    icon: <Star className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    label: "Auto Manual",
    value: "Auto",
    unit: "",
    color: "green",
  },
];

function Card({ card }: { card: StatCard }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 md:p-7 min-h-[180px] md:min-h-[200px] flex flex-col items-center justify-center text-center transition-transform duration-200 hover:scale-[1.02] border border-gray-100">
      <div className={`${colorIconMap[card.color]} mb-3 md:mb-4`}>{card.icon}</div>
      <p className="text-sm md:text-base text-gray-600 font-medium">{card.label}</p>
      <div className={`mt-2 md:mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${colorTextMap[card.color]}`}>
        {card.value} {card.unit || ""}
      </div>
    </div>
  );
}

export default function DashboardStatCards({
  cards = defaultCards,
}: {
  cards?: StatCard[];
}) {
  return (
    <section className="w-full">
      {/* Responsive grid: 8 per row on xl, wraps on smaller screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-5 md:gap-6 xl:gap-7">
        {cards.map((c) => (
          <Card key={c.id} card={c} />
        ))}
      </div>
    </section>
  );
}
