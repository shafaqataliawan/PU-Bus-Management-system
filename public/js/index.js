// Load routes when the page loads
async function loadRoutes() {
  try {
    const response = await fetch('http://localhost:5000/api/routes');
    const routes = await response.json();
    const routeSelect = document.getElementById('studentRoute');
    routes.forEach(route => {
      const option = document.createElement('option');
      option.value = route._id;
      option.textContent = `${route.routeName} - ${route.startPoint} to ${route.endPoint}`;
      routeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading routes:', error);
  }
}

// Auto-fill email from localStorage if available
function autoFillEmail() {
  const userEmail = localStorage.getItem("userEmail");
  const emailField = document.getElementById("studentEmail");
  if (userEmail && emailField) {
    emailField.value = userEmail;
  }
}

// Load routes and auto-fill email when the page loads
loadRoutes();
autoFillEmail();

// Show custom message in modal if already submitted (remove localStorage check, always show form)
window.addEventListener('DOMContentLoaded', function() {
  const studentFormModal = document.getElementById('studentFormModal');
  const studentForm = document.getElementById('studentForm');
  const emailField = document.getElementById('studentEmail');

  if (studentFormModal) {
    studentFormModal.addEventListener('show.bs.modal', function(e) {
      if (localStorage.getItem('formSubmitted') === 'true') {
        e.preventDefault();
        // Show Bootstrap alert
        let alertDiv = document.getElementById('alreadySubmittedAlert');
        if (!alertDiv) {
          alertDiv = document.createElement('div');
          alertDiv.id = 'alreadySubmittedAlert';
          alertDiv.className = 'alert alert-warning alert-dismissible fade show';
          alertDiv.role = 'alert';
          alertDiv.innerHTML = 'You Have Already Submitted! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
          document.body.appendChild(alertDiv);
        } else {
          alertDiv.style.display = 'block';
        }
        setTimeout(() => {
          if (alertDiv) alertDiv.style.display = 'none';
        }, 4000);
        return;
      }
      const userEmail = localStorage.getItem('userEmail') || '';
      if (emailField) {
        emailField.value = userEmail;
        emailField.readOnly = true;
      }
    });
  }
});

document.getElementById("studentForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  // Always use logged-in email
  const userEmail = localStorage.getItem('userEmail') || '';
  if (!userEmail) {
    alert('No logged-in user email found. Please login again.');
    return;
  }
  const formData = {
    studentName: document.getElementById("studentName").value,
    studentId: document.getElementById("studentId").value,
    studentEmail: userEmail, // always use logged-in email
    studentPhone: document.getElementById("studentPhone").value,
    studentAddress: document.getElementById("studentAddress").value,
    studentRoute: document.getElementById("studentRoute").options[document.getElementById("studentRoute").selectedIndex].text,
    studentDept: "Computer Science",
    studentProgram: "BS",
    studentBatch: "2024",
    studentSemester: document.getElementById("studentSemester").value,
    studentGender: document.getElementById("studentGender").value,
    emergencyName: document.getElementById("studentName").value,
    emergencyNumber: document.getElementById("studentPhone").value
  };
  try {
    const response = await fetch('http://localhost:5000/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      // Store data in localStorage for tracking page
      localStorage.setItem("studentName", formData.studentName);
      localStorage.setItem("studentId", formData.studentId);
      localStorage.setItem("studentClass", document.getElementById("studentClass").value);
      localStorage.setItem("studentBus", document.getElementById("studentBus").value);
      localStorage.setItem("studentEmail", formData.studentEmail);
      localStorage.setItem("studentPhone", formData.studentPhone);
      localStorage.setItem("studentAddress", formData.studentAddress);
      const selectedRoute = document.getElementById("studentRoute");
      const routeId = selectedRoute.value;
      const routeName = selectedRoute.options[selectedRoute.selectedIndex].text;
      localStorage.setItem("studentRoute", routeName);
      localStorage.setItem("routeId", routeId);
      // --- ADDED: Set formSubmitted flag ---
      localStorage.setItem('formSubmitted', 'true');
      alert("Form submitted successfully! Redirecting to tracking page...");
      window.location.href = `tracking.html?routeId=${routeId}&routeName=${encodeURIComponent(routeName)}`;
    } else {
      const errorData = await response.json();
      if (errorData.message && errorData.message.includes('already registered')) {
        // --- ADDED: Set formSubmitted flag ---
        localStorage.setItem('formSubmitted', 'true');
        // Optionally, show alert here too
        let alertDiv = document.getElementById('alreadySubmittedAlert');
        if (!alertDiv) {
          alertDiv = document.createElement('div');
          alertDiv.id = 'alreadySubmittedAlert';
          alertDiv.className = 'alert alert-warning alert-dismissible fade show';
          alertDiv.role = 'alert';
          alertDiv.innerHTML = 'You Have Already Submitted! <button type=\'button\' class=\'btn-close\' data-bs-dismiss=\'alert\' aria-label=\'Close\'></button>';
          document.body.appendChild(alertDiv);
        } else {
          alertDiv.style.display = 'block';
        }
        setTimeout(() => {
          if (alertDiv) alertDiv.style.display = 'none';
        }, 4000);
      } else {
        alert("Error submitting form: " + (errorData.message || "Unknown error"));
      }
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form. Please try again.");
  }
}); 