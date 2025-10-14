// Definește aici zonele de parcare. Tipuri suportate în app.js: "polygon", "rectangle" (+ marker opțional)
const PARKING_ZONES = [
  {
    id: "afi_brasov",
    name: "Parcare AFI Brașov",
    type: "polygon",
    path: [
      { lat: 45.64573, lng: 25.58786 },
      { lat: 45.64522, lng: 25.58891 },
      { lat: 45.64438, lng: 25.58843 },
      { lat: 45.64485, lng: 25.58737 },
    ],
    strokeColor: "#00AEEF",
    fillColor: "#00AEEF",
    marker: {
      position: { lat: 45.64525, lng: 25.58820 },
      info: "<b>AFI Brașov</b><br/>Tarif: 5 lei/oră (exemplu)",
    },
  },
  {
    id: "centrul_civic_rect",
    name: "Centrul Civic",
    type: "rectangle",
    bounds: {
      north: 45.6449,
      south: 45.6429,
      east: 25.6015,
      west: 25.5987,
    },
    strokeColor: "#FF6B00",
    fillColor: "#FF6B00",
    marker: {
      position: { lat: 45.6439, lng: 25.6002 },
      info: "<b>Centrul Civic</b><br/>Parcare stradală (exemplu).",
    },
  },
  // Adaugă aici alte zone…
];
