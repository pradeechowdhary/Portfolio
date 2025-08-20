document.addEventListener('DOMContentLoaded', () => {
  // Immediately set up the changing word
  setTimeout(() => {
    const changingWord = document.getElementById('changing-word');
    if (changingWord) {
      // Apply styles directly
      changingWord.style.opacity = '1';
      changingWord.style.visibility = 'visible';
      changingWord.style.display = 'inline-block';
      
      // Apply gradient directly
      changingWord.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899, #facc15)';
      changingWord.style.backgroundSize = '200% auto';
      changingWord.style.backgroundClip = 'text';
      changingWord.style.webkitBackgroundClip = 'text';
      changingWord.style.webkitTextFillColor = 'transparent';
    }
  }, 100);
  
  // Check for bypass flags
  const bypassLoading = sessionStorage.getItem('bypassLoading');
  const directToHero = sessionStorage.getItem('directToHero');
  const instantTransition = sessionStorage.getItem('instantTransition');
  
  // If coming from Ghosted page with instant transition
  if (bypassLoading === 'true' && directToHero === 'true') {
    // Skip the loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    
    // Clear all flags
    sessionStorage.removeItem('bypassLoading');
    sessionStorage.removeItem('directToHero');
    sessionStorage.removeItem('instantTransition');
    
    // Make hero section visible immediately
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.style.opacity = '1';
    }
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Make all sections visible immediately
    document.querySelectorAll('section').forEach(section => {
      if (section.id !== 'loading-screen') {
        section.style.opacity = '1';
      }
    });
    
    // Initialize reveal animations
    window.dispatchEvent(new Event('scroll'));
  }
  
  // DOM Elements - using optional chaining to prevent errors when elements don't exist
  const loadingScreen = document.querySelector('#loading-screen');
  const hero = document.querySelector('.hero');
  const changingWord = document.querySelector('#changing-word');
  const wordCarousel = document.querySelector('.word-carousel');
  const tagline = document.querySelector('#tagline-text');
  const ctaButton = document.querySelector('#cta-button');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const particlesContainer = document.querySelector('.particles-container');
  
  // Log which elements were not found to help with debugging
  const elementsToCheck = {
    loadingScreen, hero, changingWord, wordCarousel, tagline, ctaButton, scrollIndicator, particlesContainer
  };
  
  // Only log in development, not in production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    Object.entries(elementsToCheck).forEach(([name, element]) => {
      if (!element) console.log(`Element not found: ${name}`);
    });
  }
  
  // DISABLED: Word cycling is now handled by word-cycle.js
  // const roles = ['Shan Irshad', 'A Developer', 'A Designer', 'A Cloud Dev', 'A Builder'];
  // const wordDisplayDuration = 3000; // Display each word for 3 seconds
  // const wordTransitionDuration = 800; // ms for fade in/out animation (matches CSS)
  
  // Create sparkles
  createSparkles();
  
  // Function to create sparkle elements
  function createSparkles() {
    const particlesContainer = document.getElementById('particles');
    const maxSparkles = 5; // Maximum number of sparkles at once
    
    // Create initial sparkles
    for (let i = 0; i < maxSparkles; i++) {
      createSparkle();
    }
    
    // Function to create a single sparkle
    function createSparkle() {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      // Random position within the container
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      sparkle.style.left = `${posX}%`;
      sparkle.style.top = `${posY}%`;
      
      // Random size (1-3px)
      const size = 1 + Math.random() * 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      
      // Random animation delay
      const delay = Math.random() * 5;
      sparkle.style.animationDelay = `${delay}s`;
      
      // Add to container
      particlesContainer.appendChild(sparkle);
      
      // Remove and recreate after animation completes
      setTimeout(() => {
        sparkle.remove();
        createSparkle();
      }, 8000 + (delay * 1000)); // Match animation duration plus delay
    }
  }
  
  // DISABLED: Loading sequence is now handled by simple-animation.js
  // initializeLoadingSequence();
  
  // Loading sequence function (DISABLED)
  function initializeLoadingSequence() {
    // Hide hero section initially - with null checks
    if (hero) hero.style.opacity = '0';
    if (tagline) {
      tagline.style.opacity = '0';
      tagline.style.transform = 'translateY(20px)';
    }
    if (ctaButton) {
      ctaButton.style.opacity = '0';
      ctaButton.style.transform = 'translateY(20px)';
    }
    if (scrollIndicator) scrollIndicator.style.opacity = '0';
    
    // Start the loading screen animation
    // animateLoadingScreen(); // DISABLED
  }
  
  // Handle loading screen animation (DISABLED - now handled by simple-animation.js)
  function animateLoadingScreen() {
    // This function is disabled to prevent duplicate animations
    // The loading animation is now handled by simple-animation.js
    console.log('animateLoadingScreen in new-script.js is disabled');
    return;
    
    // The code below is kept for reference but will not execute
    /*
    // Show loading screen immediately
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    
    // Get terminal elements
    const etherealTerminal = document.querySelector('.ethereal-terminal');
    const etherealWelcome = document.querySelector('.ethereal-welcome');
    const terminalLines = document.querySelectorAll('.terminal-line');
    const commandLines = document.querySelectorAll('.terminal-line .command');
    const outputLines = document.querySelectorAll('.terminal-line.output');
    const cursorLine = document.querySelector('.terminal-line.cursor-line');
    
    // Hide all command and output lines initially
    terminalLines.forEach(line => {
      if (!line.classList.contains('cursor-line')) {
        line.style.opacity = '0';
        line.style.display = 'none';
      }
    });
    
    // Terminal animation sequence
    let currentLineIndex = 0;
    const totalCommandLines = commandLines.length;
    
    // Animation functions are loaded from fixed-animation.js
    
    // Start the terminal animation
    startTerminalAnimation();
    */
  }
  
  // Add mouse movement shimmer effect
  document.addEventListener('mousemove', function(e) {
    createShimmerOnMove(e);
  });

  // Only call setupSmoothScroll if we're on a page that needs it
  // This helps prevent errors on pages without the relevant elements
  if (document.querySelector('#about') || document.querySelector('section:nth-of-type(2)')) {
    setupSmoothScroll();
  }
  
  // Adjust font size based on viewport width
  adjustFontSize();
  window.addEventListener('resize', adjustFontSize);
  
  // DISABLED: Word cycling is now handled by word-cycle.js
/*
function cycleWords() {
  // Simple, reliable word cycling function
  let currentIndex = 0;
  
  // Get the changing word element
  const changingWord = document.getElementById('changing-word');
  if (!changingWord) return;
  
  // Make sure we start with Shan Irshad
  changingWord.textContent = roles[0];
  changingWord.style.opacity = '1';
  changingWord.style.visibility = 'visible';
  
  // Apply gradient effect
  changingWord.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899, #facc15)';
  changingWord.style.backgroundSize = '200% auto';
  changingWord.style.backgroundClip = 'text';
  changingWord.style.webkitBackgroundClip = 'text';
  changingWord.style.webkitTextFillColor = 'transparent';
  
  // Gradient variations for each word
  const gradients = [
    'linear-gradient(90deg, #8b5cf6, #ec4899, #facc15)', // Purple to pink to yellow
    'linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6)', // Blue to green to purple
    'linear-gradient(90deg, #f97316, #ec4899, #3b82f6)', // Orange to pink to blue
    'linear-gradient(90deg, #10b981, #facc15, #f97316)', // Green to yellow to orange
    'linear-gradient(90deg, #ec4899, #8b5cf6, #10b981)'  // Pink to purple to green
  ];
  
  // Function to apply gradient to text
  function applyGradient(index) {
    changingWord.style.background = gradients[index % gradients.length];
    changingWord.style.backgroundSize = '200% auto';
    changingWord.style.backgroundClip = 'text';
    changingWord.style.webkitBackgroundClip = 'text';
    changingWord.style.webkitTextFillColor = 'transparent';
  }
  
  // Function to cycle through words with smooth transitions
  function rotateText() {
    // Smooth fade out
    changingWord.style.opacity = '0';
    changingWord.style.transform = 'translateY(-8px)';
    changingWord.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      // Get next word
      currentIndex = (currentIndex + 1) % roles.length;
      
      // Update text content
      changingWord.textContent = roles[currentIndex];
      
      // Apply new gradient
      applyGradient(currentIndex);
      
      // Set up entrance position
      changingWord.style.transform = 'translateY(8px)';
      
      // Trigger entrance animation
      setTimeout(() => {
        changingWord.style.opacity = '1';
        changingWord.style.transform = 'translateY(0)';
      }, 20);
    }, 400);
  }
  
  // Start the rotation after a longer initial display (4 seconds for Shan Irshad)
  setTimeout(() => {
    // Then cycle at normal speed
    setInterval(rotateText, wordDisplayDuration);
  }, 4000);
}
*/ 
  
  // Create particles for background effect
  function createParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      
      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random opacity
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      // Random animation duration
      const animDuration = Math.random() * 15 + 10;
      particle.style.animation = `float ${animDuration}s infinite ease-in-out`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // Create shimmer effect on mouse move
  function createShimmerOnMove(e) {
    // Check if particles container exists
    if (!particlesContainer) return;
    
    // Limit the frequency of shimmer creation
    if (Math.random() > 0.1) return;
    
    const shimmer = document.createElement('div');
    shimmer.className = 'shimmer';
    
    // Position at mouse coordinates
    shimmer.style.left = `${e.clientX}px`;
    shimmer.style.top = `${e.clientY}px`;
    
    // Random size
    const size = Math.random() * 2 + 1;
    shimmer.style.width = `${size}px`;
    shimmer.style.height = `${size}px`;
    
    // Add to container
    particlesContainer.appendChild(shimmer);
    
    // Remove after animation completes
    setTimeout(() => {
      shimmer.remove();
    }, 800);
  }
  
  // Adjust font size based on viewport width
  function adjustFontSize() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    
    // Base font size adjustment
    if (vw < 768) {
      document.documentElement.style.fontSize = '14px';
    } else if (vw < 1024) {
      document.documentElement.style.fontSize = '16px';
    } else {
      document.documentElement.style.fontSize = '18px';
    }
  }
  
  // Setup smooth scroll behavior
  function setupSmoothScroll() {
    // For the CTA button and scroll indicator
    if (ctaButton) {
      ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Scroll to next section or about section
        const aboutSection = document.querySelector('#about') || document.querySelector('section:nth-of-type(2)');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('section:nth-of-type(2)');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollBy({ 
            top: window.innerHeight, 
            behavior: 'smooth' 
          });
        }
      });
    }
  }
  
  // Mouse movement shimmer effect is already set up above
  
  // Initialize particles for background effect
  createParticles();
  
  // DISABLED: Word cycling is now handled by word-cycle.js
  // cycleWords();
  
  /* Word cycling functionality has been moved to word-cycle.js */

});
