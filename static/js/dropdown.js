let loggedinnav = [{
  "name": "Logout",
  "href": "/rd-logout"
}, {
  "name": "Dashboard",
  "href": "/rd-dashboard"
}, {
  "name": "Change Password",
  "href": "/rd-dashboard?page=password-reset"
}, {
  "name": "API Settings",
  "href": "/rd-dashboard?page=api-settings"
}, {
  "name": "Account Settings",
  "href": "/rd-dashboard?page=account-settings"
}];

let loggedoutnav = [{   
  "name": "Login",
  "href": "/rd-login"
}, {
  "name": "Register",
  "href": "/rd-register"
}, {
  "name": "Forgot Password",
  "href": "/rd-forgot"
}];

async function updateNavigation(isAuthenticated, isAdmin, regLocked) {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (!dropdownMenu) return;

  dropdownMenu.innerHTML = ''; // Clear existing menu items

  let navItems = isAuthenticated ? loggedinnav : loggedoutnav;

  // Filter out Register link if registration is locked
  if (regLocked) {
    navItems = navItems.filter(item => item.name !== "Register");
  }

  // Remove the current page's link from the dropdown
  const currentFullPath = window.location.pathname + window.location.search;
  navItems = navItems.filter(item => item.href !== currentFullPath);

  // Add admin panel link if user is admin (and not on admin page)
  if (isAuthenticated && isAdmin && currentFullPath !== '/rd-admin') {
    navItems.push({
      "name": "Admin Panel",
      "href": "/rd-admin"
    });
  }

  navItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'dropdown-item';
    a.href = item.href;
    a.textContent = item.name;
    li.appendChild(a);
    dropdownMenu.appendChild(li);
  });
}

async function checkAuthentication() {
  try {
    console.log('Attempting to fetch authentication status...');
    let response = await fetch('/rd-validate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies in the request
    });

    console.log('Fetch response received:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log('Parsed response data:', data);

    const isAuthenticated = data.valid === 1;
    const isAdmin = data.admin === 1;
    const regLocked = data.reg_locked === 1;
    updateNavigation(isAuthenticated, isAdmin, regLocked);

    // Optional: update auth status display
    let authStatusDiv = document.getElementById('auth-status');
    if (authStatusDiv) {
      authStatusDiv.innerHTML = isAuthenticated ? 'User is authenticated' : 'User is not authenticated';
      authStatusDiv.style.color = isAuthenticated ? 'green' : 'red';
    }

  } catch (error) {
    console.error('Detailed error:', error);
    updateNavigation(false, false, false);
    
    // Optional: update auth status display
    let authStatusDiv = document.getElementById('auth-status');
    if (authStatusDiv) {
      authStatusDiv.innerHTML = `Error: ${error.message}`;
      authStatusDiv.style.color = 'orange';
    }
  }
}

// Add this at the bottom, before the DOMContentLoaded event listener
function initializeNavbar() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
  }
}

// Update the DOMContentLoaded listener to include the navbar initialization
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  initializeNavbar();
});
