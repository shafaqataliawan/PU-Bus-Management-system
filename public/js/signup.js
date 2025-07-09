document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from submitting the traditional way
  const form = e.target;
  try {
    // Send POST request with form data
    const response = await fetch(
      "http://localhost:5000/api/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
        }),
      }
    );
    // Get the response data
    const data = await response.json();
    const messageDiv = document.getElementById("message");
    // Check if the signup was successful
    if (response.ok) {
      messageDiv.style.color = "green";
      messageDiv.textContent = data.message || "Signup successful!";
      // Store email in localStorage for auto-fill
      localStorage.setItem("userEmail", form.email.value);
      form.reset(); // Clear the form fields
      // Redirect to homepage after successful signup
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = data.message || "Signup failed!";
    }
  } catch (error) {
    console.error("Error:", error); // Log any errors
    document.getElementById("message").textContent = "An error occurred.";
  }
}); 