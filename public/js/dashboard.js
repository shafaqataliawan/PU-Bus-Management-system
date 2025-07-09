// Function to fetch and display routes
async function fetchAndDisplayRoutes() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch('/api/routes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch routes');
        }

        const routes = await response.json();
        
        const tableBody = document.getElementById('routes-table-body');
        tableBody.innerHTML = ''; // Clear existing content
        
        // Update route count in dashboard summary
        document.getElementById('routeCount').textContent = routes.length;
        
        if (routes.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">No routes found</td>
                </tr>
            `;
            return;
        }
        
        routes.forEach((route, index) => {
            const row = document.createElement('tr');
            
            // Get first and last waypoints for From/To
            const firstWaypoint = route.waypoints[0];
            const lastWaypoint = route.waypoints[route.waypoints.length - 1];
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${route.routeName || 'N/A'}</td>
                <td>${firstWaypoint ? firstWaypoint.name : 'N/A'}</td>
                <td>${lastWaypoint ? lastWaypoint.name : 'N/A'}</td>
                <td>${calculateDistance(route.waypoints)} km</td>
                <td>${calculateEstimatedTime(route.waypoints)} min</td>
                <td>${route.routeNumber || 'N/A'}</td>
                <td>
                    <span class="badge ${route.status === 'Active' ? 'bg-success' : 'bg-danger'}">
                        ${route.status || 'Active'}
                    </span>
                </td>
                <td class="d-flex flex-wrap gap-1 justify-content-center">
                    <button class="btn btn-primary btn-sm" onclick="editRoute('${route._id}')">
                        <i class="bi bi-pencil-square"></i> Edit
                        </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRoute('${route._id}')">
                                <i class="bi bi-trash"></i> Delete
                    </button>
                    <button class="btn btn-${route.status === 'Active' ? 'warning' : 'success'} btn-sm" onclick="toggleRouteStatus('${route._id}', '${route.status}')">
                                <i class="bi bi-toggle-on"></i> ${route.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching routes:', error);
        const tableBody = document.getElementById('routes-table-body');
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-danger">
                    Error loading routes. Please try again.
                </td>
            </tr>
        `;
    }
}

// Function to calculate distance between waypoints (simplified version)
function calculateDistance(waypoints) {
    if (!waypoints || waypoints.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        const point1 = waypoints[i];
        const point2 = waypoints[i + 1];
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (point2.coordinates.lat - point1.coordinates.lat) * Math.PI / 180;
        const dLon = (point2.coordinates.lng - point1.coordinates.lng) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(point1.coordinates.lat * Math.PI / 180) * Math.cos(point2.coordinates.lat * Math.PI / 180) * 
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        totalDistance += distance;
    }
    
    return totalDistance.toFixed(1);
}

// Function to calculate estimated time (simplified version)
function calculateEstimatedTime(waypoints) {
    if (!waypoints || waypoints.length < 2) return 0;
    
    // Assuming average speed of 30 km/h
    const averageSpeed = 30;
    const distance = calculateDistance(waypoints);
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = timeInHours * 60;
    
    return Math.round(timeInMinutes);
}

// Function to delete a route
async function deleteRoute(routeId) {
    if (!confirm('Are you sure you want to delete this route?')) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/routes/${routeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
            return;
        }
        
        if (response.ok) {
            alert('Route deleted successfully');
            fetchAndDisplayRoutes(); // Refresh the table
        } else {
            const error = await response.json();
            alert('Error deleting route: ' + error.message);
        }
    } catch (error) {
        console.error('Error deleting route:', error);
        alert('Error deleting route. Please try again.');
    }
}

// Function to toggle route status
async function toggleRouteStatus(routeId, currentStatus) {
    try {
        const token = localStorage.getItem('authToken');
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        
        const response = await fetch(`/api/routes/${routeId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
            return;
        }
        
        if (response.ok) {
            fetchAndDisplayRoutes(); // Refresh the table
        } else {
            const error = await response.json();
            alert('Error updating route status: ' + error.message);
        }
    } catch (error) {
        console.error('Error updating route status:', error);
        alert('Error updating route status. Please try again.');
    }
}

// Update editRoute to open and pre-fill the modal
async function editRoute(routeId) {
    try {
        const token = localStorage.getItem('authToken');
        const url = `http://localhost:5000/api/routes/${routeId}`;
        console.log('Fetching route:', url);
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Status:', res.status);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', errorText);
            throw new Error('Failed to fetch route');
        }
        const route = await res.json();
        console.log('Fetched route:', route);
        document.getElementById('editRouteId').value = route._id;
        document.getElementById('editRouteName').value = route.routeName || '';
        document.getElementById('editRouteNumber').value = route.routeNumber || '';
        document.getElementById('editBusName').value = route.busName || '';
        document.getElementById('editDriverName').value = route.driverName || '';
        document.getElementById('editStartPoint').value = route.startPoint || '';
        document.getElementById('editEndPoint').value = route.endPoint || '';
        // You can add more fields as needed
        const editModal = new bootstrap.Modal(document.getElementById('editRouteModal'));
        editModal.show();
    } catch (err) {
        alert('Failed to load route details');
    }
}

// Add this function after editRoute and before any other modal logic
async function updateRoute() {
    try {
        const token = localStorage.getItem('authToken');
        const id = document.getElementById('editRouteId').value;
        const updatedRoute = {
            routeName: document.getElementById('editRouteName').value,
            routeNumber: document.getElementById('editRouteNumber').value,
            busName: document.getElementById('editBusName').value,
            driverName: document.getElementById('editDriverName').value,
            startPoint: document.getElementById('editStartPoint').value,
            endPoint: document.getElementById('editEndPoint').value
            // Add more fields if you add them to the modal
        };
        const res = await fetch(`http://localhost:5000/api/routes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedRoute)
        });
        if (res.ok) {
            alert('Route updated successfully!');
            fetchAndDisplayRoutes();
            bootstrap.Modal.getInstance(document.getElementById('editRouteModal')).hide();
        } else {
            const error = await res.json();
            alert(error.message || 'Failed to update route');
        }
    } catch (err) {
        alert('Failed to update route');
    }
}

// Search functionality
document.getElementById('routeSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#routes-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Load routes when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayRoutes);

// Load Bus Data
async function loadBusData() {
    try {
        const token = localStorage.getItem('authToken');
        const res = await fetch('/api/bus', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (res.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
            return;
        }
        
        if (!res.ok) {
            throw new Error('Failed to fetch buses');
        }
        
        const buses = await res.json();
        allBuses = buses; // Store all buses
        renderBuses(buses); // Initial render
        
        // Update bus count
        document.getElementById('busCount').textContent = buses.length;
    } catch (error) {
        console.error("Error loading bus data:", error);
        const tableBody = document.getElementById('bus-table-body');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Error loading buses. Please try again.
                </td>
            </tr>
        `;
    }
}

// Render Buses Table
function renderBuses(buses) {
    const tbody = document.getElementById('bus-table-body');
    tbody.innerHTML = '';
    
    if (buses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No buses found</td>
            </tr>
        `;
        return;
    }
    
    buses.forEach((bus, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${bus.busNumber || 'N/A'}</td>
                <td>${(bus.startPoint && bus.endPoint) ? `${bus.startPoint} ➡️ ${bus.endPoint}` : 'N/A'}</td>
                <td>${bus.driver || 'N/A'}</td>
                <td>${bus.capacity || 'N/A'}</td>
                <td>
                    <span class="badge ${bus.status === 'Active' ? 'bg-success' : 'bg-danger'}">
                        ${bus.status || 'Active'}
                    </span>
                </td>
                <td class="d-flex flex-wrap gap-1 justify-content-center">
                    <button class="btn btn-primary btn-sm" onclick="editBus('${bus._id}')">
                        <i class="bi bi-pencil-square"></i> Edit
                        </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBus('${bus._id}')">
                                <i class="bi bi-trash"></i> Delete
                    </button>
                    <button class="btn btn-${bus.status === 'Active' ? 'warning' : 'success'} btn-sm" onclick="toggleBusStatus('${bus._id}', '${bus.status}')">
                                <i class="bi bi-toggle-on"></i> ${bus.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            </tr>
        `;
    });
}

// Update editBus to open and pre-fill the modal
async function editBus(busId) {
    try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`http://localhost:5000/api/bus/${busId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch bus');
        const bus = await res.json();
        document.getElementById('editBusId').value = bus._id;
        document.getElementById('editBusNumber').value = bus.busNumber || '';
        document.getElementById('editCapacity').value = bus.capacity || '';
        document.getElementById('editDriver').value = bus.driver || '';
        document.getElementById('editStartPoint').value = bus.startPoint || '';
        document.getElementById('editEndPoint').value = bus.endPoint || '';
        const editModal = new bootstrap.Modal(document.getElementById('editBusModal'));
        editModal.show();
    } catch (err) {
        alert('Failed to load bus details');
    }
}

// Function to delete a bus
async function deleteBus(busId) {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/bus/${busId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
            return;
        }
        
        if (response.ok) {
            alert('Bus deleted successfully');
            loadBusData(); // Refresh the table
        } else {
            const error = await response.json();
            alert('Error deleting bus: ' + error.message);
        }
    } catch (error) {
        console.error('Error deleting bus:', error);
        alert('Error deleting bus. Please try again.');
    }
}

// Function to toggle bus status
async function toggleBusStatus(busId, currentStatus) {
    try {
        const token = localStorage.getItem('authToken');
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        
        const response = await fetch(`/api/bus/${busId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
            return;
        }
        
        if (response.ok) {
            loadBusData(); // Refresh the table
        } else {
            const error = await response.json();
            alert('Error updating bus status: ' + error.message);
        }
    } catch (error) {
        console.error('Error updating bus status:', error);
        alert('Error updating bus status. Please try again.');
    }
}

async function updateBus() {
    try {
        const token = localStorage.getItem('authToken');
        const id = document.getElementById('editBusId').value;
        const busData = {
            busNumber: document.getElementById('editBusNumber').value,
            capacity: document.getElementById('editCapacity').value,
            driver: document.getElementById('editDriver').value,
            startPoint: document.getElementById('editStartPoint').value,
            endPoint: document.getElementById('editEndPoint').value
        };
        const res = await fetch(`http://localhost:5000/api/bus/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(busData)
        });
        if (res.ok) {
            alert('Bus updated successfully!');
            loadBusData();
            bootstrap.Modal.getInstance(document.getElementById('editBusModal')).hide();
        } else {
            const error = await res.json();
            alert(error.message || 'Failed to update bus');
        }
    } catch (err) {
        alert('Failed to update bus');
    }
}

// === Add Route Form Logic for Dashboard ===
// (REMOVED)
// ... existing code ... 

// Load Student Data
async function loadStudentData() {
    try {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        renderStudents(students);
        
        // Update student count
        document.getElementById('studentCount').textContent = students.length;
    } catch (error) {
        console.error("Error loading student data:", error);
        const tableBody = document.getElementById('student-table-body');
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-danger">
                    Error loading students. Please try again.
                </td>
            </tr>
        `;
    }
}

// Render Students
function renderStudents(students) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">No students found</td>
            </tr>
        `;
        return;
    }
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.department}</td>
            <td>${student.program}</td>
            <td>${student.route}</td>
            <td>
                <span class="badge ${student.status === 'Active' ? 'bg-success' : 'bg-danger'}">
                    ${student.status}
                </span>
            </td>
            <td>
                <div class="dropdown action-dropdown">
                    <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" onclick="editStudent(${index})">
                            <i class="bi bi-pencil-square"></i> Edit
                        </a></li>
                        <li><a class="dropdown-item" onclick="deleteStudent(${index})">
                            <i class="bi bi-trash"></i> Delete
                        </a></li>
                        <li><a class="dropdown-item" onclick="toggleStudentStatus(${index}, '${student.status}')">
                            <i class="bi bi-toggle-on"></i> ${student.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </a></li>
                    </ul>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete Student
function deleteStudent(index) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentData();
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
    }
}

// Toggle Student Status
function toggleStudentStatus(index, currentStatus) {
    try {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        students[index].status = currentStatus === 'Active' ? 'Inactive' : 'Active';
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentData();
    } catch (error) {
        console.error('Error updating student status:', error);
        alert('Error updating student status. Please try again.');
    }
}

// Edit Student
function editStudent(index) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students[index];
    // You can implement the edit functionality here
    // For now, we'll just show an alert
    alert('Edit functionality will be implemented soon.');
}

// Search functionality for students
document.getElementById('studentSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.studentId.toLowerCase().includes(searchTerm)
    );
    renderStudents(filteredStudents);
});

// Load student data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    // ... existing code ...
});
// ... existing code ... 

// Load Students Data from /api/form
async function loadStudents() {
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch('/api/form', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
      return;
    }
    const students = await res.json();
    renderStudents(students);
    // Update student count
    document.getElementById('studentCount').textContent = students.length;
    // Store for search
    window.allStudents = students;
  } catch (err) {
    console.error('Error loading students:', err);
  }
}

// Render Students Table
function renderStudents(students) {
  const tbody = document.getElementById('students-table-body');
  tbody.innerHTML = '';
  students.forEach((s, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.studentName || ''}</td>
        <td>${s.studentEmail || ''}</td>
        <td>${s.studentPhone || ''}</td>
        <td>${s.studentDept || ''}</td>
        <td>${s.studentProgram || ''}</td>
        <td>${s.studentBatch || ''}</td>
        <td>${s.studentSemester || ''}</td>
        <td>${s.studentGender || ''}</td>
        <td>${s.studentAddress || ''}</td>
        <td>${s.studentRoute || ''}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteStudentById('${s._id}')">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// Add this function to handle student deletion by _id
async function deleteStudentById(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`/api/form/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      alert('Student deleted successfully!');
      loadStudents();
    } else {
      const error = await res.json();
      alert(error.message || 'Failed to delete student');
    }
  } catch (err) {
    console.error('Error deleting student:', err);
    alert('Error deleting student. Please try again.');
  }
}

// Student Search
const studentSearchInput = document.getElementById('studentSearch');
if (studentSearchInput) {
  studentSearchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const students = window.allStudents || [];
    const filtered = students.filter(s =>
      (s.studentName && s.studentName.toLowerCase().includes(query)) ||
      (s.studentEmail && s.studentEmail.toLowerCase().includes(query)) ||
      (s.studentRoute && s.studentRoute.toLowerCase().includes(query))
    );
    renderStudents(filtered);
  });
}
// ... existing code ... 

// Render Drivers Table
function renderDrivers(drivers) {
  const tbody = document.getElementById('driver-table-body');
  tbody.innerHTML = '';
  drivers.forEach((driver, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${driver.profileImage || ''}" width="50" class="rounded-circle" /></td>
        <td>${driver.name || driver.driverName || ''}</td>
        <td>${driver.email || driver.driverEmail || ''}</td>
        <td>${driver.phone || driver.driverPhone || ''}</td>
        <td>${driver.bus || driver.busName || driver.busNumber || ''}</td>
        <td>${driver.route || driver.routeName || ''}</td>
        <td><span class="badge bg-${(driver.status || driver.driverStatus) === 'Active' ? 'success' : 'secondary'}">${driver.status || driver.driverStatus || ''}</span></td>
        <td class="d-flex flex-wrap gap-1 justify-content-center">
          <button class="btn btn-primary btn-sm" onclick="editDriver('${driver._id}')">
            <i class="bi bi-pencil-square"></i> Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteDriver('${driver._id}')">
            <i class="bi bi-trash"></i> Delete
          </button>
          <button class="btn btn-${(driver.status || driver.driverStatus) === 'Active' ? 'warning' : 'success'} btn-sm" onclick="toggleDriverStatus('${driver._id}', '${driver.status || driver.driverStatus}')">
            <i class="bi bi-toggle-on"></i> ${(driver.status || driver.driverStatus) === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      </tr>
    `;
  });
}

async function editDriver(driverId) {
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`http://localhost:5000/api/drivers/${driverId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch driver');
    const driver = await res.json();
    console.log('Fetched driver:', driver); // Debug log
    document.getElementById('editDriverId').value = driver._id;
    document.getElementById('editDriverName').value = driver.name || driver.driverName || '';
    document.getElementById('editDriverEmail').value = driver.email || driver.driverEmail || '';
    document.getElementById('editDriverPhone').value = driver.phone || driver.driverPhone || '';
    document.getElementById('editDriverBus').value = driver.bus || driver.busName || driver.busNumber || '';
    document.getElementById('editDriverRoute').value = driver.route || driver.routeName || '';
    document.getElementById('editDriverStatus').value = driver.status || driver.driverStatus || 'Active';
    const editModal = new bootstrap.Modal(document.getElementById('editDriverModal'));
    editModal.show();
  } catch (err) {
    console.error('Edit driver error:', err); // Debug log
    alert('Failed to load driver details');
  }
}

// Update Driver
async function updateDriver() {
  try {
    const token = localStorage.getItem('authToken');
    const id = document.getElementById('editDriverId').value;
    const bus = document.getElementById('editDriverBus').value;
    if (!bus) {
      alert('Bus field is required!');
      return;
    }
    const driverData = {
      name: document.getElementById('editDriverName').value,
      email: document.getElementById('editDriverEmail').value,
      phone: document.getElementById('editDriverPhone').value,
      bus: bus,
      route: document.getElementById('editDriverRoute').value,
      status: document.getElementById('editDriverStatus').value
    };
    const res = await fetch(`http://localhost:5000/api/drivers/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(driverData)
    });
    if (res.ok) {
      alert('Driver updated successfully!');
      loadDrivers();
      bootstrap.Modal.getInstance(document.getElementById('editDriverModal')).hide();
    } else {
      const error = await res.json();
      alert(error.message || 'Failed to update driver');
    }
  } catch (err) {
    alert('Failed to update driver');
  }
}

// Delete Driver
async function deleteDriver(id) {
  if (!confirm('Are you sure you want to delete this driver?')) return;
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`http://localhost:5000/api/drivers/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Driver deleted successfully!');
      loadDrivers();
    } else {
      const error = await res.json();
      alert(error.message || 'Failed to delete driver');
    }
  } catch (err) {
    alert('Failed to delete driver');
  }
}

// Toggle Driver Status
async function toggleDriverStatus(id, currentStatus) {
  try {
    const token = localStorage.getItem('authToken');
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const res = await fetch(`http://localhost:5000/api/drivers/toggle/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadDrivers();
    } else {
      const error = await res.json();
      alert(error.message || 'Failed to update status');
    }
  } catch (err) {
    alert('Failed to update status');
  }
}
// ... existing code ... 