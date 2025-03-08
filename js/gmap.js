// document.addEventListener("DOMContentLoaded", function () {
//   // Initialize the Leaflet map in the div with id 'map'
//   var map = L.map("map").setView([-6.2, 106.816666], 13);

//   // Enable scroll wheel zoom on the map
//   map.scrollWheelZoom.enable();

//   // Add OpenStreetMap tile layer
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 19,
//     attribution: "&copy; OpenStreetMap contributors",
//   }).addTo(map);

//   // Add a wheel event listener to control propagation based on zoom level.
//   map.getContainer().addEventListener(
//     "wheel",
//     function (e) {
//       const currentZoom = map.getZoom();
//       const minZoom = map.getMinZoom();
//       const maxZoom = map.getMaxZoom();

//       // If scrolling down (zooming in) and at max zoom,
//       // or scrolling up (zooming out) and at min zoom,
//       // prevent the event from propagating.
//       if (
//         (e.deltaY > 0 && currentZoom >= maxZoom) ||
//         (e.deltaY < 0 && currentZoom <= minZoom)
//       ) {
//         e.preventDefault();
//         e.stopPropagation();
//       }
//       // Otherwise, let the map handle the zoom event normally.
//     },
//     { passive: false }
//   );

//   var marker;

//   // Add a click event on the map to drop/move a marker and update the "map-address" field
//   map.on("click", function (e) {
//     var latlng = e.latlng;
//     if (marker) {
//       marker.setLatLng(latlng);
//     } else {
//       marker = L.marker(latlng).addTo(map);
//     }
//     // Update the input with the clicked coordinates (formatted to 6 decimal places)
//     document.getElementById("map-address").value =
//       latlng.lat.toFixed(6) + ", " + latlng.lng.toFixed(6);
//   });
// });
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the Leaflet map in the div with id 'map'
  var map = L.map("map").setView([-6.2, 106.816666], 13);

  // Enable scroll wheel zoom on the map
  map.scrollWheelZoom.enable();

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Add a wheel event listener to control propagation based on zoom level.
  map.getContainer().addEventListener(
    "wheel",
    function (e) {
      const currentZoom = map.getZoom();
      const minZoom = map.getMinZoom();
      const maxZoom = map.getMaxZoom();

      // If scrolling down (zooming in) and at max zoom,
      // or scrolling up (zooming out) and at min zoom,
      // prevent the event from propagating.
      if (
        (e.deltaY > 0 && currentZoom >= maxZoom) ||
        (e.deltaY < 0 && currentZoom <= minZoom)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { passive: false }
  );

  var marker;

  // When a user clicks on the map:
  map.on("click", function (e) {
    var latlng = e.latlng;
    // Drop or move the marker
    if (marker) {
      marker.setLatLng(latlng);
    } else {
      marker = L.marker(latlng).addTo(map);
    }
    // Update the "map-address" input with the clicked coordinates
    var coords = latlng.lat.toFixed(6) + ", " + latlng.lng.toFixed(6);
    document.getElementById("map-address").value = coords;
    // Call reverse geocoding to get the human-readable address
    reverseGeocode(latlng.lat, latlng.lng);
  });

  // Reverse Geocoding Function using Nominatim
  function reverseGeocode(lat, lng) {
    // Nominatim request URL (you can adjust zoom and address details as needed)
    var url =
      "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      lat +
      "&lon=" +
      lng +
      "&zoom=18&addressdetails=1";

    fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then(function (data) {
        if (data && data.display_name) {
          // Update the "address" input field with the reverse geocoded address
          document.getElementById("map-address").value = data.display_name;
        } else {
          console.error("No address found.");
        }
      })
      .catch(function (error) {
        console.error("Reverse geocoding error:", error);
      });
  }
});
