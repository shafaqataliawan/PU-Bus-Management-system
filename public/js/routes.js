var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'css/routes.css';  // path to your CSS file
document.head.appendChild(link);

// Fetch and display routes from database
async function loadRoutes() {
  try {
    const response = await fetch('http://localhost:5000/api/routes');
    const routes = await response.json();
    const routesContainer = document.getElementById('routesContainer');
    routesContainer.innerHTML = '';
    routes.forEach(route => {
      const routeCard = document.createElement('div');
      routeCard.className = 'col-12 col-md-6 col-lg-4';
      routeCard.innerHTML = `
        <div class="card route-card h-100">
          <div class="card-header text-white" style="background-color: #25525e;">
            <h5 class="card-title mb-0">${route.routeName}</h5>
          </div>
          <div class="card-body">
            <div class="route-info">
              <p><i class="fas fa-route me-2"></i> <strong>Route Number:</strong> ${route.routeNumber}</p>
              <p><i class="fas fa-bus me-2"></i> <strong>Bus:</strong> ${route.busName || 'Not assigned'}</p>
              <p><i class="fas fa-user me-2"></i> <strong>Driver:</strong> ${route.driverName || 'Not assigned'}</p>
              <p><i class="fas fa-map-marker-alt me-2"></i> <strong>Route:</strong> ${route.startPoint} to ${route.endPoint}</p>
              <div class="bus-stops mt-3">
                <h6><i class="fas fa-map-marker-alt me-2"></i>Bus Stops:</h6>
                <ul class="list-group list-group-flush">
                  ${route.busStops.map(stop => `<li class="list-group-item">${stop}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
          <div class="card-footer bg-light">
            <span class="badge ${route.status === 'Active' ? 'bg-success' : 'bg-secondary'}">
              ${route.status}
            </span>
            <a href="tracking.html?routeId=${route._id}&routeName=${encodeURIComponent(route.routeName)}" class="btn search-icon btn-sm float-end text-white">
              <i class="fa-solid fa-location-dot "></i> Live Tracking
            </a>
          </div>
        </div>
      `;
      routesContainer.appendChild(routeCard);
    });
    document.querySelector('.heading-2 h1').textContent = `${routes.length}+ Routes Across Lahore City`;
  } catch (error) {
    console.error('Error loading routes:', error);
    document.getElementById('routesContainer').innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load routes. Please try again later.
        </div>
      </div>
    `;
  }
}

// Filter routes based on search input
function filterRoutes() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const routeCards = document.querySelectorAll('.route-card');
  routeCards.forEach(card => {
    const routeName = card.querySelector('.card-title').textContent.toLowerCase();
    const routeNumber = card.querySelector('.route-info p:first-child').textContent.toLowerCase();
    const routePath = card.querySelector('.route-info p:nth-child(4)').textContent.toLowerCase();
    if (routeName.includes(searchInput) || routeNumber.includes(searchInput) || routePath.includes(searchInput)) {
      card.closest('.col-12').style.display = '';
    } else {
      card.closest('.col-12').style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', loadRoutes); 