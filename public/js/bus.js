// Load all buses on page load
async function loadBuses() {
    const res = await fetch('/api/bus/all');
    const buses = await res.json();
    const tableBody = document.getElementById("busTableBody");
    tableBody.innerHTML = "";
  
    buses.forEach((bus, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${bus.busNumber}</td>
          <td>${bus.capacity}</td>
          <td>${bus.driver}</td>
          <td>${bus.startPoint} ➡️ ${bus.endPoint}</td>
          <td><span class="badge ${bus.status === 'Active' ? 'bg-success' : 'bg-secondary'}">${bus.status}</span></td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editBus('${bus._id}')"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteBus('${bus._id}')"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    });
  }
  
  // Add bus from form
  document.getElementById("busForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
    const res = await fetch('/api/bus/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  
    if (res.ok) {
      alert("✅ Bus added successfully!");
      loadBuses();
      this.reset();
    } else {
      alert("❌ Error adding bus.");
    }
  });
  
  // Delete bus
  async function deleteBus(id) {
    if (confirm("Are you sure you want to delete this bus?")) {
      const res = await fetch(`/api/bus/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadBuses();
      } else {
        alert("❌ Failed to delete.");
      }
    }
  }
  
  // Initial load
  loadBuses();
  