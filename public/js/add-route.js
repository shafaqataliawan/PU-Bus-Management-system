// Initialize the map centered on Lahore
const map = L.map('routeMap').setView([31.5497, 74.3436], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Bus Management System'
}).addTo(map);

// Store waypoints and markers
let waypoints = [];
let markers = [];
let routeLine = null;

// Function to update the map with current waypoints
function updateMap() {
    // Remove existing markers and route line
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    // Add new markers and route line
    waypoints.forEach((point, index) => {
        const marker = L.marker([point.coordinates.lat, point.coordinates.lng])
            .addTo(map)
            .bindPopup(point.name);
        markers.push(marker);
    });

    if (waypoints.length > 1) {
        routeLine = L.polyline(waypoints.map(point => [point.coordinates.lat, point.coordinates.lng]), {
            color: 'blue',
            weight: 3,
            opacity: 0.7
        }).addTo(map);
    }

    // Fit map bounds to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }
}

// Function to add a new waypoint form
function addWaypointForm() {
    const template = document.getElementById('waypointTemplate');
    const waypointsList = document.getElementById('waypointsList');
    const waypointElement = template.content.cloneNode(true);
    
    // Add remove button functionality
    const removeButton = waypointElement.querySelector('.btn-remove');
    removeButton.addEventListener('click', function() {
        this.closest('.waypoint-item').remove();
        updateWaypointsFromForm();
    });

    // Add input change listeners
    const inputs = waypointElement.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', updateWaypointsFromForm);
    });

    waypointsList.appendChild(waypointElement);
}

// Function to update waypoints array from form inputs
function updateWaypointsFromForm() {
    const waypointItems = document.querySelectorAll('.waypoint-item');
    waypoints = Array.from(waypointItems).map(item => ({
        name: item.querySelector('.stop-name').value,
        coordinates: {
            lat: parseFloat(item.querySelector('.latitude').value),
            lng: parseFloat(item.querySelector('.longitude').value)
        }
    })).filter(point => (
        point.name &&
        !isNaN(point.coordinates.lat) &&
        !isNaN(point.coordinates.lng)
    ));
    
    updateMap();
}

// Add initial waypoint form
document.getElementById('addWaypoint').addEventListener('click', addWaypointForm);

// Handle form submission
document.getElementById('routeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const routeName = document.getElementById('routeName').value;
    const routeNumber = document.getElementById('routeNumber').value;
    const busName = document.getElementById('busName').value;
    const driverName = document.getElementById('driverName').value;

    // Validate required fields
    if (!routeName || !routeNumber || !busName || !driverName) {
        alert('Please fill in all required fields');
        return;
    }

    // Validate waypoints
    if (waypoints.length === 0) {
        alert('Please add at least one waypoint');
        return;
    }

    // Validate each waypoint
    for (const waypoint of waypoints) {
        if (!waypoint.name || isNaN(waypoint.coordinates.lat) || isNaN(waypoint.coordinates.lng)) {
            alert('Please fill in all waypoint fields (name, latitude, and longitude)');
            return;
        }
    }

    // Create route data object
    const routeData = {
        routeName,
        routeNumber,
        busName,
        driverName,
        busStops: waypoints.map(point => point.name),
        startPoint: waypoints[0].name,
        endPoint: waypoints[waypoints.length - 1].name,
        status: 'Active',
        waypoints: waypoints
    };

    console.log('Sending route data:', routeData);

    try {
        const response = await fetch('/api/routes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routeData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            alert('Route saved successfully!');
            window.location.href = '/routes.html';
        } else {
            throw new Error(data.message || 'Failed to save route');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving route: ' + error.message);
    }
}); 