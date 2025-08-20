document.addEventListener('DOMContentLoaded', () => {
    // Get the theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference only
    const savedTheme = localStorage.getItem('theme');
    
    // Apply the saved theme or default to light mode
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        // Check current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        // Toggle theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
        
        // Add animation class to the toggle button
        themeToggle.classList.add('theme-toggle-animation');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-animation');
        }, 500);
    });
    
    // Add hover animation for the toggle button
    themeToggle.addEventListener('mouseenter', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const icon = currentTheme === 'light' ? 
            themeToggle.querySelector('.moon-icon') : 
            themeToggle.querySelector('.sun-icon');
            
        icon.classList.add('icon-hover-animation');
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        const icons = themeToggle.querySelectorAll('i');
        icons.forEach(icon => {
            icon.classList.remove('icon-hover-animation');
        });
    });
});
