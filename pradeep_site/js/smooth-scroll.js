/**
 * Smooth Scroll Navigation
 * Adds smooth scrolling behavior to navigation links
 * Controls header visibility based on scroll position
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get all links inside the navbar
  const navbarLinks = document.querySelectorAll('.navbar-link');
  const navbar = document.querySelector('.navbar');
  const heroSection = document.getElementById('hero');
  
  // Check if we should scroll to hero section (coming back from Ghosted page)
  if (localStorage.getItem('scrollToHero') === 'true') {
    // Clear the flag
    localStorage.removeItem('scrollToHero');
    
    // Scroll to hero section with a slight delay to ensure page is loaded
    setTimeout(() => {
      if (heroSection) {
        window.scrollTo({
          top: heroSection.offsetTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
  
  // Add click event listener to each navbar link
  navbarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip processing for the Ghosted link
      if (href === 'ghosted.html') {
        return; // Let the default navigation happen
      }
      
      // Only apply smooth scroll to links that start with #
      if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href === '#' ? 'hero' : href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Function to control header visibility based on scroll position
  function handleHeaderVisibility() {
    if (!heroSection) return;
    
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    
    // If we've scrolled past the hero section
    if (heroBottom <= 0) {
      navbar.classList.add('navbar-hidden');
    } else {
      navbar.classList.remove('navbar-hidden');
    }
  }
  
  // Initial check for header visibility
  handleHeaderVisibility();
  
  // Check on scroll
  window.addEventListener('scroll', handleHeaderVisibility);
});
