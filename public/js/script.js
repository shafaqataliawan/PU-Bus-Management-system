// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the map
  window.map = L.map('map').setView([31.5497, 74.3436], 12);

  // Add the OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© Bus Management System'
  }).addTo(window.map);

  // Initialize socket connection
  const socket = io();

  // Handle route selection
  const routeSelect = document.getElementById('routeSelect');
  if (routeSelect) {
    // Listen for route updates from server
    socket.on('routeUpdate', (data) => {
      // Update route select options
      routeSelect.innerHTML = '<option value="">Select a route...</option>';
      data.routes.forEach(route => {
        const option = document.createElement('option');
        option.value = route.id;
        option.textContent = route.name;
        routeSelect.appendChild(option);
      });
    });

    // Handle route selection change
    routeSelect.addEventListener('change', (e) => {
      const routeId = e.target.value;
      if (routeId) {
        socket.emit('selectRoute', { routeId });
      }
    });
  }

  // Listen for bus location updates
  socket.on('busLocation', (data) => {
    // Update bus marker on map
    if (window.busMarker) {
      window.busMarker.setLatLng([data.lat, data.lng]);
    } else {
      window.busMarker = L.marker([data.lat, data.lng]).addTo(window.map);
    }
    window.map.setView([data.lat, data.lng], 15);
  });

  const markers = {};
  let myMarker = null;
  let myPopup = null;

  // Watch user's location
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current location:", latitude, longitude);

        // Center map on user's location
        window.map.setView([latitude, longitude], 15);

        // Create/update marker for current user
        if (!myMarker) {
          myMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: "my-location-icon",
              html: '<div class="pulse"></div>',
              iconSize: [20, 20],
            }),
          }).addTo(window.map);

          // Show "Ab yahan hai" popup
          myPopup = L.popup()
            .setLatLng([latitude, longitude])
            .setContent("<b>Ab yahan hai!</b>")
            .openOn(window.map);
          
          setTimeout(() => window.map.closePopup(myPopup), 3000);
        } else {
          myMarker.setLatLng([latitude, longitude]);
        }

        socket.emit("send-location", { latitude, longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Error: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Geolocation not supported!");
  }

  // Handle other users' locations
  socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    if (id !== socket.id) {
      if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
      } else {
        markers[id] = L.marker([latitude, longitude]).addTo(window.map);
      }
    }
  });

  socket.on("user-disconnected", (id) => {
    if (markers[id]) {
      window.map.removeLayer(markers[id]);
      delete markers[id];
    }
  });
});