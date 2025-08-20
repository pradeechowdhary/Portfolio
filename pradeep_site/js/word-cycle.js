/**
 * Improved word cycling animation with consistent behavior
 */

// Global variable to track if word cycling has been initialized
window.wordCycleInitialized = false;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Find the element
  const wordElement = document.getElementById('changing-word');
  
  if (!wordElement) {
    console.error('Word element not found!');
    return;
  }
  
  // Store the initial text
  const initialText = wordElement.textContent;
  
  // Words to cycle through
  const words = [
    'Pradeep Ponnam',
    'An AI Engineer',
    'A Cloud Architect',
    'A Researcher',
    'A Builder',
    'A Microservice Developer'
  ];
  
  // Start with the second word to avoid repeating Shan Irshad
  let currentIndex = 1;
  let cycleInterval = null;
  
  // Function to cycle words
  function cycleWords() {
    // Fade out
    wordElement.style.opacity = '0';
    
    // After fade out, change text and fade back in
    setTimeout(function() {
      wordElement.textContent = words[currentIndex];
      
      wordElement.style.opacity = '1';
      
      // Move to next word
      currentIndex = (currentIndex + 1) % words.length;
    }, 600);
  }
  
  // Function to initialize word cycling
  function initWordCycle() {
    // Only initialize once
    if (window.wordCycleInitialized) return;
    window.wordCycleInitialized = true;
    
    // Set up smooth transition
    wordElement.style.transition = 'opacity 600ms ease-in-out';
    
    // Make sure the initial text is visible and stable
    wordElement.style.opacity = '1';
    wordElement.textContent = initialText;
    
    // Start cycling after a delay to ensure hero animation is complete
    setTimeout(function() {
      // Start the cycling interval
      cycleInterval = setInterval(cycleWords, 4000);
    }, 8000);
  }
  
  // Initialize when the page is fully loaded
  window.addEventListener('load', function() {
    // Wait a bit to ensure all animations are complete
    setTimeout(initWordCycle, 1000);
  });
  
  // Also initialize if coming from another page
  if (document.readyState === 'complete') {
    setTimeout(initWordCycle, 1000);
  }
});
