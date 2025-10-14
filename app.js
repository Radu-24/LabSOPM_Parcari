/* global google, PARKING_ZONES */

let map;

window.initMap = function initMap() {
  // Coordonate Brașov (centru)
  const brasovCenter = { lat: 45.643, lng: 25.588 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: brasovCenter,
    zoom: 13,
    mapTypeId: "roadmap",
    gestureHandling: "greedy", // scroll + drag ca pe Google Maps
    disableDefaultUI: false,   // păstrează controalele standard
    clickableIcons: true,
  });

  // HUD simplu (poți șterge)
  map.addListener("mousemove", (e) => {
    document.getElementById("cursor-lat").textContent = `lat: ${e.latLng.lat().toFixed(6)}`;
    document.getElementById("cursor-lng").textContent = `lng: ${e.latLng.lng().toFixed(6)}`;
  });
  map.addListener("zoom_changed", () => {
    document.getElementById("zoom-level").textContent = `zoom: ${map.getZoom()}`;
  });

  // Render zones (ex. poligoane/rect-uri). Le definim în parkings.js
  renderParkingZones(PARKING_ZONES);
};

/** Desenează zonele și atașează click -> fitBounds (zoom pe zonă) */
function renderParkingZones(zones) {
  if (!Array.isArray(zones)) return;

  zones.forEach((z) => {
    if (z.type === "polygon" && Array.isArray(z.path)) {
      const poly = new google.maps.Polygon({
        paths: z.path,
        strokeColor: z.strokeColor || "#00AEEF",
        strokeOpacity: z.strokeOpacity ?? 0.9,
        strokeWeight: z.strokeWeight ?? 2,
        fillColor: z.fillColor || "#00AEEF",
        fillOpacity: z.fillOpacity ?? 0.2,
        map,
      });

      poly.addListener("click", () => {
        const bounds = new google.maps.LatLngBounds();
        z.path.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, 40); // padding 40px
        // aici poți naviga spre o pagină de detalii: location.href = `pag2.html?id=${z.id}`;
      });
    }

    if (z.type === "rectangle" && z.bounds) {
      const rect = new google.maps.Rectangle({
        bounds: z.bounds,
        strokeColor: z.strokeColor || "#FF6B00",
        strokeOpacity: z.strokeOpacity ?? 0.9,
        strokeWeight: z.strokeWeight ?? 2,
        fillColor: z.fillColor || "#FF6B00",
        fillOpacity: z.fillOpacity ?? 0.2,
        map,
      });

      rect.addListener("click", () => {
        map.fitBounds(rect.getBounds(), 40);
      });
    }

    // Poți adăuga markers pentru puncte de interes:
    if (z.marker) {
      const m = new google.maps.Marker({
        position: z.marker.position,
        map,
        title: z.name || "Parcare",
      });
      if (z.marker.info) {
        const infowindow = new google.maps.InfoWindow({ content: z.marker.info });
        m.addListener("click", () => infowindow.open({ anchor: m, map }));
      }
    }
  });
}
