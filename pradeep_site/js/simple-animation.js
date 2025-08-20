/**
 * Clean Hero Animation
 * Simple smooth transition to hero section without any terminal code
 */

// Prepare smooth hero transition
(function() {
  // Create and inject styles for smooth transitions
  const transitionStyle = document.createElement('style');
  transitionStyle.textContent = `
    /* Ensure loading screen fades out smoothly */
    #loading-screen {
      background: var(--color-background, #ffffff);
      transition: opacity 300ms ease-out;
    }
    
    /* Prepare hero section for smooth entrance */
    .hero {
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 500ms ease-out, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Prepare about section */
    #about {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 700ms ease-out, transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `;
  
  // Insert at the beginning of head for highest priority
  document.head.insertBefore(transitionStyle, document.head.firstChild);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Get main elements
  const loadingScreen = document.getElementById('loading-screen');
  const hero = document.querySelector('.hero');
  const about = document.getElementById('about');
  
  // Check if URL has a hash to skip loading screen entirely
  if (window.location.hash) {
    // Hide loading screen immediately
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    
    // Show hero section immediately
    if (hero) {
      hero.style.display = 'flex';
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
      hero.style.position = 'relative';
      hero.style.zIndex = '10';
      
      // Animate hero elements immediately
      animateHeroElements();
    }
    
    // Show about section
    if (about) {
      setTimeout(() => {
        about.style.opacity = '1';
        about.style.transform = 'translateY(0)';
      }, 300);
    }
  } else {
    // Faster transition - start almost immediately
    requestAnimationFrame(() => {
      setTimeout(() => {
        showHeroSection();
      }, 150); // Much shorter delay
    });
  }
});

// Function to show hero section with smooth transition
function showHeroSection() {
  const loadingScreen = document.getElementById('loading-screen');
  const hero = document.querySelector('.hero');
  const about = document.getElementById('about');
  
  // Prepare hero section first to avoid white flash
  if (hero) {
    hero.style.display = 'flex';
    hero.style.position = 'relative';
    hero.style.zIndex = '10';
    hero.style.willChange = 'opacity, transform';
    
    // Force a reflow to ensure hero is ready
    void hero.offsetHeight;
  }
  
  // Simultaneously hide loading screen and show hero
  if (loadingScreen && hero) {
    // Start loading screen fade out
    loadingScreen.style.opacity = '0';
    
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);
    
    // Start hero fade in immediately (no delay)
    requestAnimationFrame(() => {
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
      
      // Start hero elements animation quickly
      setTimeout(() => {
        animateHeroElements();
      }, 100); // Much faster
      
      // Show about section
      if (about) {
        setTimeout(() => {
          about.style.opacity = '1';
          about.style.transform = 'translateY(0)';
        }, 600); // Faster
      }
    });
    
    // Remove loading screen after fade completes
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      // Clean up hardware acceleration
      if (hero) hero.style.willChange = 'auto';
    }, 300);
  }
}

// Animate hero elements with cloud-like floating effect
function animateHeroElements() {
  // Get hero elements
  const changingWord = document.getElementById('changing-word');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  // Animate changing word first (simple fade to avoid conflicts with word cycling)
  if (changingWord) {
    changingWord.style.opacity = '0';
    changingWord.style.transition = 'opacity 500ms ease-out';
    
    // Force a reflow
    void changingWord.offsetHeight;
    
    // Fade in quickly
    requestAnimationFrame(() => {
      changingWord.style.opacity = '1';
    });
    
    // Mark as animated for word-cycle.js
    changingWord.setAttribute('data-animated', 'true');
  }
  
  // Animate scroll indicator
  if (scrollIndicator) {
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.transform = 'translateY(15px)';
    scrollIndicator.style.willChange = 'opacity, transform';
    
    // Force a reflow
    void scrollIndicator.offsetHeight;
    
    // Animate with cloud-like floating effect
    setTimeout(() => {
      scrollIndicator.style.transition = 'opacity 400ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.transform = 'translateY(0)';
      
      // Clean up hardware acceleration
      setTimeout(() => {
        scrollIndicator.style.willChange = 'auto';
      }, 450);
    }, 200); // Small delay for scroll indicator
  }
}