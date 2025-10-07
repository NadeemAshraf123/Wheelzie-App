import React, { useState } from "react";

type Spec = {
  id: string;
  label: string;
  value: string;

  icon: JSX.Element;
};

const TransmissionIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x="3"
      y="7"
      width="18"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M7 7v-2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M17 7v-2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const SeatsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x="4"
      y="7"
      width="16"
      height="8"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M8 15v2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M16 15v2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const RangeIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2v6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const FuelIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 3v12a3 3 0 003 3h6a3 3 0 003-3V8"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7h6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const SpeedIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 12a9 9 0 1018 0"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M12 12l4-3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const AccelIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M21 12h-6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M3 12h6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M12 3v6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const CarDetail: React.FC = () => {
  const images = ["/car2.jpeg", "/car3.jpeg", "/car4.jpeg", "/car5.jpeg"];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const specs: Spec[] = [
    {
      id: "trans",
      label: "Transmission",
      value: "Automatic",
      icon: TransmissionIcon,
    },
    { id: "seats", label: "Capacity", value: "5 seats", icon: SeatsIcon },
    {
      id: "range",
      label: "Range",
      value: "400 miles on a full tank",
      icon: RangeIcon,
    },
    { id: "fuel", label: "Fuel", value: "Gasoline", icon: FuelIcon },
    { id: "speed", label: "Top Speed", value: "120 mph", icon: SpeedIcon },
    {
      id: "accel",
      label: "Acceleration",
      value: "8.0 seconds (0–60 mph)",
      icon: AccelIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="rounded-xl bg-white p-8 flex flex-col items-center">
            <img
              src={images[selectedIndex]}
              alt="Audi A6"
              className="w-full object-contain max-h-[320px] select-none transition-all duration-300"
              style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.08))" }}
            />

            <div className="w-full grid grid-cols-3 gap-6 mt-8">
              {images.slice(1).map((src, i) => {
                const idx = i + 1;
                const active = selectedIndex === idx;
                return (
                  <button
                    key={src}
                    onClick={() => setSelectedIndex(idx)}
                    className={`rounded-xl p-4 border transition-shadow flex items-center justify-center bg-white ${
                      active ? "shadow-lg border-gray-200" : "border-gray-100"
                    }`}
                    aria-label={`Select image ${idx}`}
                  >
                    <img
                      src={src}
                      alt={`thumbnail ${idx}`}
                      className="w-full h-20 object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* content */}
        <div className="p-8 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left: title, about, specs */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sedan</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    Audi A6
                  </h1>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs font-medium bg-slate-800 text-white px-3 py-1 rounded-full">
                      Available
                    </span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      12 Unit
                    </span>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm text-gray-500 font-medium">About</h3>
                    <p className="mt-3 text-sm text-gray-600 leading-7">
                      Audi A6 is a luxurious and sophisticated sedan, ideal for
                      both daily commutes and extended journeys. Renowned for
                      its powerful performance and advanced technology features,
                      the A6 provides a refined driving experience with
                      exceptional comfort.
                    </p>
                  </div>
                </div>

                {/* right column with actions + price */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3 mb-4">
                    <button
                      type="button"
                      title="Edit"
                      className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-100 hover:border-gray-200 text-gray-600"
                      aria-label="Edit"
                    >
                      {/* simple edit pencil */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M3 21l3-1 11-11 1-3-3 1L4 20z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-100 hover:border-red-200 text-gray-600"
                      aria-label="Delete"
                    >
                      {/* trash */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M3 6h18"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 6v-2a2 2 0 012-2h4a2 2 0 012 2v2"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 11v6M14 11v6"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl md:text-4xl font-extrabold text-slate-900">
                      $50
                    </div>
                    <div className="text-xs text-gray-500">/days</div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-10">
                <h3 className="text-sm text-gray-500 font-medium mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {specs.map((s) => (
                    <div
                      key={s.id}
                      className="bg-gray-50 p-4 rounded-xl flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-gray-100 text-gray-700">
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <div className="text-sm font-medium text-gray-900">
                          {s.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right: empty column on mobile, kept for spacing on large screens */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
