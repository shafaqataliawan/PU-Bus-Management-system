// Enhanced navbar with improved UI and styling
function loadNavbar() {
  const navbarHTML = `
  <nav class="navbar navbar-expand-lg fixed-top navBar-Bg">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand logo-container" href="index.html">
        <img src="https://www.pu.edu.pk/images/logopu.png" width="45px" height="60px" alt="PU Logo" class="logo-img" />
      </a>
      
      <!-- Mobile: Notification and Profile Icons next to hamburger -->
      <div class="d-lg-none mobile-icons-container">
        <div class="notification-container">
          <button type="button" class="btn btn-link text-warning notification-btn" data-bs-toggle="modal" data-bs-target="#announcementModal" title="Announcements" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="400">
            <i class="fa-solid fa-bell fs-5 zoom-eff"></i>
            <span id="notificationBadge" class="notification-badge d-none">0</span>
          </button>
        </div>
        
        <div class="profile-dropdown-container" id="profileDropdown" style="display:none; position: relative;">
          <button class="btn btn-link text-white profile-btn" type="button" id="profileMenuBtn" title="Profile">
            <i class="fa-solid fa-user-circle fa-lg"></i>
          </button>
          <div class="profile-dropdown-menu" id="profileMenu" style="display: none; position: absolute; right: 0; top: 110%; min-width: 200px; background: #fff; color: #222; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000;">
            <div class="p-3 border-bottom">
              <div class="fw-bold" id="profileName">User</div>
              <div class="text-muted small" id="profileEmail">Email</div>
            </div>
            <div class="p-2">
              <button class="btn btn-danger w-100" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
            </div>
          </div>
        </div>
        
        <a href="login.html" class="btn btn-outline-warning login-btn-mobile" id="loginBtn" style="display:none;">
          <i class="fa-solid fa-right-to-bracket"></i>
        </a>
      </div>
      
      <!-- Hamburger Menu -->
      <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <i class="fa-solid fa-bars-staggered text-white"></i>
      </button>
      
      <!-- Desktop Navigation -->
      <div class="offcanvas sidebar offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">
            <img src="https://www.pu.edu.pk/images/logopu.png" width="45px" height="60px" alt="PU Logo" />
          </h5>
          <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <!-- Navigation Links -->
          <ul class="navbar-nav justify-content-center flex-grow-1 pe-3 nav-links-container">
            <li class="nav-item">
              <a class="nav-link text-white  zoom-eff nav-link-enhanced" aria-current="page" href="index.html">
                <i class="fa-solid fa-home me-1"></i>Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-white zoom-eff nav-link-enhanced" href="about.html">
                <i class="fa-solid fa-info-circle me-1"></i>About Us
              </a>
            </li>
            <li class="nav-item mx-2">
              <a class="nav-link text-white zoom-eff nav-link-enhanced" href="routes.html">
                <i class="fa-solid fa-route me-1"></i>Routes
              </a>
            </li>
            <li class="nav-item mx-2">
              <a class="nav-link text-white zoom-eff nav-link-enhanced" href="tracking.html">
                <i class="fa-solid fa-location-dot text-warning me-1"></i>Live Tracking
              </a>
            </li>
          </ul>
          
          <!-- Desktop: Right side icons -->
          <div class="d-none d-lg-flex desktop-icons-container">
            <div class="notification-container">
              <button type="button" class="btn btn-link text-warning notification-btn" data-bs-toggle="modal" data-bs-target="#announcementModal" title="Announcements" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="400">
                <i class="fa-solid fa-bell fs-5 zoom-eff"></i>
                <span id="notificationBadge" class="notification-badge d-none">0</span>
              </button>
            </div>
            
            <div class="profile-dropdown-container" id="profileDropdown" style="display:none; position: relative;">
              <button class="btn btn-link text-white profile-btn" type="button" id="profileMenuBtn" title="Profile">
                <i class="fa-solid fa-user-circle fa-lg"></i>
              </button>
              <div class="profile-dropdown-menu" id="profileMenu" style="display: none; position: absolute; right: 0; top: 110%; min-width: 200px; background: #fff; color: #222; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000;">
                <div class="p-3 border-bottom">
                  <div class="fw-bold" id="profileName">User</div>
                  <div class="text-muted small" id="profileEmail">Email</div>
                </div>
                <div class="p-2">
                  <button class="btn btn-danger w-100" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>
              </div>
            </div>
            
            <a href="login.html" class="btn btn-outline-warning login-btn-desktop" id="loginBtn" style="display:none;">
              <i class="fa-solid fa-right-to-bracket me-1"></i>Login
            </a>
          </div>
          
          <!-- Mobile: Login button in sidebar -->
          <a href="login.html" class="signup-bottom-right d-lg-none" id="loginBtn" style="display:none;">
            <i class="fa-solid fa-right-to-bracket"></i> Login
          </a>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Notification Modal -->
  <div class="modal fade" id="announcementModal" tabindex="-1" aria-labelledby="announcementModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header border-warning">
          <h5 class="modal-title announcement-heading" id="announcementModalLabel">
            <i class="fa-solid fa-bell text-danger position-relative">
              <span id="notificationBadge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none"></span>
            </i> Announcements <span id="announcementCount" class="badge bg-warning text-dark ms-2"></span>
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group list-group-flush" id="announcementList">
            <!-- Announcement items will be dynamically inserted here -->
          </ul>
        </div>
        <div class="modal-footer border-warning">
          <button type="button" class="btn announc-btn" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast for confirmation -->
  <div id="toastConfirmation" class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; bottom: 20px; right: 20px; z-index: 1050">
    <div class="d-flex">
      <div class="toast-body">Are you sure you want to delete this announcement?</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-footer">
      <button class="btn btn-sm btn-light" id="confirmDelete">Yes, Delete</button>
      <button class="btn btn-sm btn-dark" data-bs-dismiss="toast" aria-label="Close">Cancel</button>
    </div>
  </div>
  `;
  
  const navbarDiv = document.getElementById('navbar');
  if (navbarDiv) {
    navbarDiv.innerHTML = navbarHTML;
    
    // Set active class based on current page
    const links = navbarDiv.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (window.location.pathname.endsWith(link.getAttribute('href'))) {
        link.classList.add('active', 'text-warning');
      } else {
        link.classList.remove('active', 'text-warning');
      }
    });
    
    // Bootstrap dropdown initialization
    let dropdownsInitialized = false;
    try {
      let DropdownConstructor = null;
      if (window.bootstrap && window.bootstrap.Dropdown) {
        DropdownConstructor = window.bootstrap.Dropdown;
      } else if (window.Dropdown) {
        DropdownConstructor = window.Dropdown;
      } else if (window.jQuery && window.jQuery.fn.dropdown) {
        window.jQuery(navbarDiv).find('[data-bs-toggle="dropdown"]').dropdown();
        dropdownsInitialized = true;
      }
      
      if (DropdownConstructor) {
        const dropdownTriggerList = [].slice.call(navbarDiv.querySelectorAll('[data-bs-toggle="dropdown"]'));
        dropdownTriggerList.forEach(function (dropdownTriggerEl) {
          new DropdownConstructor(dropdownTriggerEl);
        });
        dropdownsInitialized = true;
      }
    } catch (e) {
      console.error('Dropdown initialization error:', e);
    }
    
    console.log('Navbar dropdowns initialized:', dropdownsInitialized);
  }
}

// Helper function to decode JWT (without verifying signature)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadNavbar();
  
  setTimeout(async function() {
    // Get all login buttons and profile dropdowns (both mobile and desktop)
    const loginBtns = document.querySelectorAll('#loginBtn');
    const profileDropdowns = document.querySelectorAll('#profileDropdown');
    
    // Hide all by default
    loginBtns.forEach(btn => {
      if (btn) btn.style.display = 'none';
    });
    profileDropdowns.forEach(dropdown => {
      if (dropdown) dropdown.style.display = 'none';
    });
    
    const token = localStorage.getItem('authToken');
    const profileMenuBtns = document.querySelectorAll('#profileMenuBtn');
    const profileMenus = document.querySelectorAll('#profileMenu');
    
    if (token) {
      // Fetch user info from backend
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const user = await res.json();
          
          // Show profile dropdowns, hide login buttons
          loginBtns.forEach(btn => {
            if (btn) btn.style.display = 'none';
          });
          profileDropdowns.forEach(dropdown => {
            if (dropdown) dropdown.style.display = 'inline-block';
          });
          
          // Update profile info
          document.querySelectorAll('#profileName').forEach(el => {
            el.textContent = user.name || 'User';
          });
          document.querySelectorAll('#profileEmail').forEach(el => {
            el.textContent = user.email || '';
          });
          
          // Setup profile menu toggle for each button
          profileMenuBtns.forEach((btn, index) => {
            const menu = profileMenus[index];
            if (btn && menu) {
              btn.onclick = function(e) {
                e.stopPropagation();
                // Close all other menus
                profileMenus.forEach((m, i) => {
                  if (i !== index) m.style.display = 'none';
                });
                // Toggle current menu
                menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
              };
            }
          });
          
          // Hide dropdown when clicking outside
          document.addEventListener('click', function(event) {
            let clickedInside = false;
            profileDropdowns.forEach(dropdown => {
              if (dropdown && dropdown.contains(event.target)) {
                clickedInside = true;
              }
            });
            if (!clickedInside) {
              profileMenus.forEach(menu => {
                if (menu) menu.style.display = 'none';
              });
            }
          });
          
          // Setup logout for all logout buttons
          document.querySelectorAll('#logoutBtn').forEach(btn => {
            btn.onclick = function(e) {
              e.preventDefault();
              localStorage.removeItem('authToken');
              localStorage.removeItem('userRole');
              localStorage.removeItem('userEmail');
              
              profileDropdowns.forEach(dropdown => {
                if (dropdown) dropdown.style.display = 'none';
              });
              loginBtns.forEach(btn => {
                if (btn) btn.style.display = 'inline-block';
              });
              
              window.location.href = 'index.html';
            };
          });
        } else {
          // Token invalid
          loginBtns.forEach(btn => {
            if (btn) btn.style.display = 'inline-block';
          });
          profileDropdowns.forEach(dropdown => {
            if (dropdown) dropdown.style.display = 'none';
          });
        }
      } catch (err) {
        loginBtns.forEach(btn => {
          if (btn) btn.style.display = 'inline-block';
        });
        profileDropdowns.forEach(dropdown => {
          if (dropdown) dropdown.style.display = 'none';
        });
      }
    } else {
      loginBtns.forEach(btn => {
        if (btn) btn.style.display = 'inline-block';
      });
      profileDropdowns.forEach(dropdown => {
        if (dropdown) dropdown.style.display = 'none';
      });
    }
  }, 0);
});