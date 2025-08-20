/**
 * Ultra-smooth transition when navigating from portfolio to Ghosted page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add a transition stylesheet to the page
  const style = document.createElement('style');
  style.textContent = `
    .fade-transition {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    
    .fade-transition.active {
      opacity: 1;
      pointer-events: all;
    }
  `;
  document.head.appendChild(style);
  
  // Create the transition overlay element
  const fadeOverlay = document.createElement('div');
  fadeOverlay.className = 'fade-transition';
  document.body.appendChild(fadeOverlay);
  
  // Set up the Ghosted navigation
  const ghostedLink = document.querySelector('.navbar-link[href="ghosted.html"]');
  if (ghostedLink) {
    // Remove the inline onclick handler if it exists
    ghostedLink.removeAttribute('onclick');
    // Add our smooth transition handler
    ghostedLink.addEventListener('click', navigateToGhosted);
  }
  
  // Prevent scroll jitter during transition
  document.addEventListener('scroll', function(e) {
    if (document.body.classList.contains('transitioning')) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });
});

// Handle navigation to Ghosted page
function navigateToGhosted(e) {
  e.preventDefault();
  
  // Prevent scrolling during transition
  document.body.classList.add('transitioning');
  document.body.style.overflow = 'hidden';
  
  // Get the fade overlay
  const fadeOverlay = document.querySelector('.fade-transition');
  
  // Set a flag for smooth arrival
  sessionStorage.setItem('smoothArrival', 'true');
  
  // Lock the scroll position
  document.body.style.position = 'fixed';
  document.body.style.top = '0';
  document.body.style.left = '0';
  document.body.style.width = '100%';
  
  // Force scroll to top before transition
  window.scrollTo(0, 0);
  
  // Activate the fade transition
  fadeOverlay.classList.add('active');
  
  // Navigate after the fade completes
  setTimeout(() => {
    window.location.href = 'ghosted.html';
  }, 400);
  
  return false;
}
