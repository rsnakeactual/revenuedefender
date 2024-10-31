let navigation = document.getElementById('navigation');

let loggedinnav = [{
  "name": "Logout",
  "href": "/rd-logout"
}, {
  "name": "Dashboard",
  "href": "/rd-dashboard"
}, {
  "name": "Account Settings",
  "href": "/rd-settings"
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

async function updateNavigation(isAuthenticated, isAdmin) {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (!dropdownMenu) return;

  dropdownMenu.innerHTML = ''; // Clear existing menu items

  let navItems = isAuthenticated ? loggedinnav : loggedoutnav;

  if (isAuthenticated && isAdmin) {
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
    updateNavigation(isAuthenticated, isAdmin);

    // Optional: update auth status display
    let authStatusDiv = document.getElementById('auth-status');
    if (authStatusDiv) {
      authStatusDiv.innerHTML = isAuthenticated ? 'User is authenticated' : 'User is not authenticated';
      authStatusDiv.style.color = isAuthenticated ? 'green' : 'red';
    }

  } catch (error) {
    console.error('Detailed error:', error);
    updateNavigation(false, false);
    
    // Optional: update auth status display
    let authStatusDiv = document.getElementById('auth-status');
    if (authStatusDiv) {
      authStatusDiv.innerHTML = `Error: ${error.message}`;
      authStatusDiv.style.color = 'orange';
    }
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', checkAuthentication);
