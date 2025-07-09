// Wait for the map to be initialized from script.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, initializing routes...');
  
  // Wait a short moment to ensure map is initialized
  setTimeout(() => {
    // Get the map instance from script.js
    const map = window.map;
    if (!map) {
      console.error('Map not initialized!');
      return;
    }

    let currentRoute = null;

    // Get route ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const routeId = urlParams.get('routeId');
    const routeName = urlParams.get('routeName');

    // Update page title if route name is provided
    if (routeName) {
      document.title = `Tracking - ${routeName}`;
    }

    // Fetch routes from database and populate select dropdown
    async function loadRoutes() {
      try {
        console.log('Fetching routes...');
        const response = await fetch('/api/routes');
        const routes = await response.json();
        console.log('Received routes:', routes);
        
        const routeSelect = document.getElementById('routeSelect');
        routeSelect.innerHTML = '<option value="">Select a route...</option>';
        
        if (routes && routes.length > 0) {
          routes.forEach(route => {
            console.log('Adding route to dropdown:', route);
            const option = document.createElement('option');
            option.value = route._id;
            option.textContent = `${route.routeName} (${route.routeNumber})`;
            routeSelect.appendChild(option);
          });

          // If routeId is provided in URL, select it automatically
          if (routeId) {
            routeSelect.value = routeId;
            // Trigger the change event to load the route
            routeSelect.dispatchEvent(new Event('change'));
          }
        } else {
          console.log('No routes found in the database');
        }
      } catch (error) {
        console.error('Error loading routes:', error);
        alert('Failed to load routes. Please try again later.');
      }
    }

    // Handle route selection
    document.getElementById('routeSelect').addEventListener('change', async function(e) {
      const routeId = e.target.value;
      console.log('Selected route ID:', routeId);
      
      // Route Info Card elements
      const infoCard = document.getElementById('routeInfoCard');
      const infoRouteName = document.getElementById('infoRouteName');
      const infoBusNumber = document.getElementById('infoBusNumber');
      const infoDriverName = document.getElementById('infoDriverName');
      const infoStops = document.getElementById('infoStops');

      if (!routeId) {
        if (currentRoute) {
          map.removeControl(currentRoute);
          currentRoute = null;
        }
        // Hide info card
        if (infoCard) infoCard.style.display = 'none';
        return;
      }

      try {
        console.log('Fetching route details for ID:', routeId);
        const response = await fetch(`/api/routes/${routeId}`);
        const route = await response.json();
        console.log('Received route details:', route);

        // Fill in Route Info Card
        if (infoCard) infoCard.style.display = 'block';
        if (infoRouteName) infoRouteName.textContent = route.routeName || '';
        if (infoBusNumber) infoBusNumber.textContent = route.busName || '';
        if (infoDriverName) infoDriverName.textContent = route.driverName || '';
        if (infoStops) infoStops.textContent = (route.busStops && route.busStops.length)
          ? route.busStops.join(', ')
          : 'N/A';

        // Remove previous route if exists
        if (currentRoute) {
          map.removeControl(currentRoute);
        }

        // Create waypoints array for the route
        const waypoints = route.waypoints.map(point => {
          console.log('Processing waypoint:', point);
          return L.latLng(point.coordinates.lat, point.coordinates.lng);
        });

        // Create and display the route
        currentRoute = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#007bff', weight: 4 }]
          }
        }).addTo(map);

        // Add markers for each waypoint
        route.waypoints.forEach(point => {
          console.log('Adding marker for waypoint:', point);
          L.marker([point.coordinates.lat, point.coordinates.lng])
            .bindPopup(point.name)
            .addTo(map);
        });

        // Fit map to show the entire route
        if (waypoints.length > 0) {
          const bounds = L.latLngBounds(waypoints);
          map.fitBounds(bounds, { padding: [50, 50] });
        }

      } catch (error) {
        console.error('Error loading route details:', error);
        alert('Failed to load route details. Please try again later.');
      }
    });

    // Initialize routes
    loadRoutes();
  }, 500); // Wait 500ms for map initialization
}); 