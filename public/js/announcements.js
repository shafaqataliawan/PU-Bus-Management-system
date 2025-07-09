// Function to update notification badge count
function updateNotificationBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('d-none');
    } else {
      badge.classList.add('d-none');
    }
  }
}

// Function to fetch and populate announcements in the modal
async function fetchAnnouncements() {
  try {
    const response = await fetch("http://localhost:5000/api/announcements/get");
    const announcements = await response.json();
    updateNotificationBadge(announcements.length);
    const announcementCount = document.getElementById("announcementCount");
    if (announcementCount) {
      announcementCount.textContent = announcements.length;
    }
    const announcementList = document.getElementById("announcementList");
    if (announcementList) {
      announcementList.innerHTML = "";
      announcements.forEach((announcement) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-dark", "text-white", "border-bottom");
        li.innerHTML = `
            <strong>${announcement.title}</strong><br>
            <small>${new Date(announcement.date).toLocaleDateString()}</small><br>
            ${announcement.description}
            <button class="btn btn-sm btn-danger float-end" onclick="triggerDeleteConfirmation('${announcement._id}')">
              <i class="fa-solid fa-times"></i>
            </button>
          `;
        announcementList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
}

// Function to confirm and delete announcement
function triggerDeleteConfirmation(id) {
  if (confirm("Are you sure you want to delete this announcement?")) {
    deleteAnnouncement(id);
  }
}

async function deleteAnnouncement(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/announcements/delete/${id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      fetchAnnouncements(); // Refresh list and badge
    } else {
      alert("Failed to delete announcement.");
    }
  } catch (error) {
    alert("Error deleting announcement.");
  }
}

document.addEventListener('DOMContentLoaded', fetchAnnouncements); 