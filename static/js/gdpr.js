// GDPR Consent Management
(() => {
    const COOKIE_NAME = 'gdpr_consent';
    const COOKIE_DURATION = 365; // Days the cookie will last

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function createNotification() {
        const notification = document.createElement('div');
        notification.id = 'gdpr-notification';
        notification.innerHTML = `
            <div class="gdpr-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="gdpr-buttons">
                    <button id="gdpr-accept" class="btn btn-primary">Accept</button>
                    <button id="gdpr-reject" class="btn btn-secondary">Reject</button>
                    <button id="gdpr-customize" class="btn btn-link">Customize</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #gdpr-notification {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(33, 37, 41, 0.95);
                color: white;
                padding: 1rem;
                z-index: 9999;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            }
            .gdpr-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .gdpr-content p {
                margin: 0;
                flex: 1;
                min-width: 200px;
            }
            .gdpr-buttons {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            #gdpr-customize {
                color: #fff;
                text-decoration: underline;
            }
            @media (max-width: 768px) {
                .gdpr-content {
                    flex-direction: column;
                    text-align: center;
                }
                .gdpr-buttons {
                    justify-content: center;
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Event Listeners
        document.getElementById('gdpr-accept').addEventListener('click', () => {
            setCookie(COOKIE_NAME, 'accepted', COOKIE_DURATION);
            notification.remove();
            enableTracking();
        });

        document.getElementById('gdpr-reject').addEventListener('click', () => {
            setCookie(COOKIE_NAME, 'rejected', COOKIE_DURATION);
            notification.remove();
            disableTracking();
        });

        document.getElementById('gdpr-customize').addEventListener('click', () => {
            showCustomizeModal();
        });
    }

    function showCustomizeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'gdprModal';
        modal.setAttribute('tabindex', '-1');
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header">
                        <h5 class="modal-title">Cookie Preferences</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="necessaryCookies" checked disabled>
                            <label class="form-check-label" for="necessaryCookies">
                                Necessary Cookies (Required)
                                <small class="d-block text-muted">Essential for website functionality</small>
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="analyticsCookies">
                            <label class="form-check-label" for="analyticsCookies">
                                Analytics Cookies
                                <small class="d-block text-muted">Help us improve our website</small>
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="savePreferences">Save Preferences</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Bootstrap modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Handle save preferences
        document.getElementById('savePreferences').addEventListener('click', () => {
            const preferences = {
                necessary: true, // Always true
                analytics: document.getElementById('analyticsCookies').checked
            };
            setCookie(COOKIE_NAME, JSON.stringify(preferences), COOKIE_DURATION);
            modalInstance.hide();
            document.getElementById('gdpr-notification').remove();
            if (preferences.analytics) {
                enableTracking();
            } else {
                disableTracking();
            }
        });

        // Clean up modal when hidden
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    function enableTracking() {
        // Enable Google Analytics
        window['ga-disable-' + window.gaTrackingId] = false;
    }

    function disableTracking() {
        // Disable Google Analytics
        window['ga-disable-' + window.gaTrackingId] = true;
    }

    // Initialize on page load
    if (!getCookie(COOKIE_NAME)) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createNotification);
        } else {
            createNotification();
        }
    }
})();
