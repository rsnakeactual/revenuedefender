// Expose tracking ID for GDPR script
window.gaTrackingId = 'G-D9C48FCTCE';

// Initialize in disabled state
window['ga-disable-' + window.gaTrackingId] = true;

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', window.gaTrackingId);
