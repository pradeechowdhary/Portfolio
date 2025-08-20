/**
 * About Section Functionality
 * Enhanced with staggered animations and improved AI chat interface
 * Optimized for consistent performance across local and production environments
 * Version: 2.0.1
 */

document.addEventListener('DOMContentLoaded', function() {
  // Force layout recalculation to prevent initial lag
  document.body.offsetHeight;
  
  // Use a performance flag to detect if we need to use low-power mode
  const useLowPowerMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Reveal animations on scroll with staggered delays - optimized version
  const revealElements = document.querySelectorAll('.reveal-element');
  let ticking = false;
  let lastScrollY = window.scrollY;
  
  function handleReveal() {
    // Reset the ticking flag
    ticking = false;
    
    // Cache current scroll position to minimize layout thrashing
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
    
    // Skip processing if scroll delta is too large (fast scrolling)
    // This prevents excessive calculations during rapid scrolling
    if (scrollDelta > 100) {
      requestAnimationFrame(handleReveal);
      return;
    }
    
    // Use requestAnimationFrame for better performance
    const windowHeight = window.innerHeight;
    
    // Create a list of elements to process to avoid layout thrashing
    const elementsToActivate = [];
    
    // First pass: gather all elements that need to be activated
    // This prevents multiple forced layouts during the loop
    revealElements.forEach(element => {
      // Skip already active elements
      if (element.classList.contains('active')) return;
      
      const elementTop = element.getBoundingClientRect().top;
      const delay = useLowPowerMode ? 0 : parseInt(element.dataset.delay || 0);
      
      // Check if element is in viewport with a larger buffer
      // The buffer is larger for desktop to preload content earlier
      if (elementTop < windowHeight - 200) {
        elementsToActivate.push({ element, delay });
      }
    });
    
    // Second pass: activate all elements in a single batch
    if (elementsToActivate.length > 0) {
      // Use a single requestAnimationFrame for all elements
      requestAnimationFrame(() => {
        elementsToActivate.forEach(({ element, delay }) => {
          if (delay > 0) {
            setTimeout(() => {
              element.classList.add('active');
            }, delay);
          } else {
            element.classList.add('active');
          }
        });
      });
    }
  }
  
  // Improved throttled scroll handler with adaptive throttling
  let scrollTimeout;
  let lastScrollTime = 0;
  const scrollThreshold = useLowPowerMode ? 150 : 100; // Higher threshold in low-power mode
  
  function onScroll() {
    // Adaptive throttling based on time since last scroll event
    const now = performance.now();
    if (now - lastScrollTime < scrollThreshold) {
      // Too soon after last scroll, use debounce pattern
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        lastScrollTime = performance.now();
        if (!ticking) {
          requestAnimationFrame(handleReveal);
          ticking = true;
        }
      }, scrollThreshold);
      return;
    }
    
    // Update last scroll time
    lastScrollTime = now;
    
    // Clear previous timeout
    clearTimeout(scrollTimeout);
    
    if (!ticking) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(handleReveal);
      ticking = true;
      
      // Reset ticking after a delay
      scrollTimeout = setTimeout(() => {
        ticking = false;
      }, 50);
    }
  }
  
  // Initial check for elements in view with adaptive timing
  // Use a shorter delay on fast connections, longer on slow connections
  const connectionSpeed = navigator.connection ? 
    (navigator.connection.effectiveType || 'unknown') : 'unknown';
  
  const initialDelay = connectionSpeed.includes('4g') ? 50 : 
                      connectionSpeed.includes('3g') ? 100 : 150;
                      
  setTimeout(() => {
    // Force a layout recalculation before first reveal
    document.body.offsetHeight;
    handleReveal();
    
    // Do a second check after a longer delay to catch any missed elements
    setTimeout(handleReveal, 300);
  }, initialDelay);
  
  // Use intersection observer instead of scroll events when supported
  // This is much more efficient and works better across different environments
  if ('IntersectionObserver' in window && !useLowPowerMode) {
    const observerOptions = {
      rootMargin: '0px 0px -100px 0px',
      threshold: [0, 0.1, 0.2]
    };
    
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.dataset.delay || 0);
          
          if (delay > 0) {
            setTimeout(() => {
              element.classList.add('active');
            }, delay);
          } else {
            requestAnimationFrame(() => {
              element.classList.add('active');
            });
          }
          
          // Stop observing this element
          intersectionObserver.unobserve(element);
        }
      });
    }, observerOptions);
    
    // Observe all reveal elements
    revealElements.forEach(element => {
      if (!element.classList.contains('active')) {
        intersectionObserver.observe(element);
      }
    });
  } else {
    // Fallback to scroll events for older browsers
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  
  // Add resize listener with debounce for better performance
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset ticking flag
      ticking = false;
      // Force recalculation of element positions
      lastScrollY = window.scrollY;
      // Trigger reveal check
      handleReveal();
    }, 100);
  }, { passive: true });
  
  // Add visibility change listener to handle tab switching
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Page is now visible, check for elements
      setTimeout(handleReveal, 100);
    }
  });
  
  // Completely redesigned approach for child element animations
  // Using CSS classes instead of inline styles for better browser optimization
  const aboutContentChildren = document.querySelectorAll('.about-left-column .about-content > *');
  
  // Add a style element for initial states
  const initialStyleElement = document.createElement('style');
  initialStyleElement.id = 'reveal-initial-style';
  initialStyleElement.textContent = `
    .reveal-child {
      opacity: 0;
      transform: translateY(20px);
      will-change: opacity, transform;
    }
  `;
  document.head.appendChild(initialStyleElement);
  
  // Use requestAnimationFrame to batch DOM operations
  requestAnimationFrame(() => {
    // Apply classes in a single batch
    aboutContentChildren.forEach((element, index) => {
      element.classList.add('reveal-child');
      // Calculate delay based on index, shorter for better performance
      // Use even shorter delays in low-power mode
      const delayMultiplier = useLowPowerMode ? 40 : 60;
      const maxDelay = useLowPowerMode ? 200 : 300;
      element.dataset.childDelay = Math.min((index + 1) * delayMultiplier, maxDelay);
    });
  });
  
  // Completely redesigned reveal children function for maximum performance
  // Uses CSS classes instead of inline styles for better browser optimization
  let childrenRevealed = false;
  function revealChildren() {
    // Only run once
    if (childrenRevealed) return;
    
    const aboutContent = document.querySelector('.about-left-column');
    if (aboutContent && aboutContent.classList.contains('active')) {
      childrenRevealed = true;
      
      // Add a style element for our animations if it doesn't exist
      let styleElement = document.getElementById('reveal-animations-style');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'reveal-animations-style';
        document.head.appendChild(styleElement);
      }
      
      // Use a single requestAnimationFrame to batch animations
      requestAnimationFrame(() => {
        // Pre-calculate all children to avoid reflows
        const children = Array.from(document.querySelectorAll('.reveal-child'));
        
        // Generate CSS for all animations at once
        let cssRules = '';
        children.forEach((child, index) => {
          // Create a unique class for each child
          const className = `reveal-anim-${index}`;
          const delay = useLowPowerMode ? index * 30 : parseInt(child.dataset.childDelay || 0);
          
          // Add the class to the element
          child.classList.add(className);
          
          // Create the CSS rule
          cssRules += `
            .${className} {
              animation: revealChildAnim 0.4s ease forwards;
              animation-delay: ${delay}ms;
            }
          `;
        });
        
        // Add the base animation
        cssRules += `
          @keyframes revealChildAnim {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        
        // Apply all CSS at once
        styleElement.textContent = cssRules;
      });
    }
  }
  
  // Check for active parent to trigger child animations
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) {
        revealChildren();
      }
    });
  });
  
  const aboutColumn = document.querySelector('.about-left-column');
  if (aboutColumn) {
    observer.observe(aboutColumn, { attributes: true, attributeFilter: ['class'] });
  }
  
  // AI Chat Interface Functionality
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  
  // Cache for API responses to avoid duplicate API calls
  const responseCache = {};
  
  // System prompt for OpenAI
  const systemPrompt = `You are Shan Irshad's AI assistant. Respond in a confident, friendly, and informative tone. Keep responses concise (2-3 sentences max) and conversational.
  
  TECHNICAL BACKGROUND (PRIORITIZE THIS INFORMATION):
  - Built Ghosted: A full-stack, AI-native cloud automation platform using React, TypeScript, Material-UI, FastAPI, Python, GPT-4o, AsyncOpenAI, AWS SDK, STS, Docker, Terraform, and deployed via Netlify/Render
  - At Mastercard: Developed a Copilot-style AI assistant using Python and LLMs that integrated with Splunk and Remedy APIs, reducing incident triage time by 40%
  - Implemented ML detection algorithms analyzing 100k+ log events in real-time to identify root causes and anomalies
  - Automated EC2/S3 provisioning using Terraform IaC and built CI/CD pipelines with Jenkins
  - Engineered KPI tracking systems for monitoring feature adoption and anomalies
  - Strong cloud expertise with AWS services, infrastructure as code, and DevOps practices
  - Technical skills include: Python, React, TypeScript, FastAPI, Docker, Terraform, AWS, CI/CD, ML/AI integration
  
  EDUCATION:
  - University of Texas at Dallas, studying Computer Science with focus on AI and cloud technologies
  
  PRODUCT BACKGROUND (SECONDARY INFORMATION):
  - Technical Product Manager at Nutrify AI, where he owned the product lifecycle for a personalized nutrition app built on ML recommendations
  - Led user research, launched an AI-powered chatbot, and authored user stories from client sessions
  - Aligned roadmap priorities around feature retention and engagement, increasing active user retention
  
  INTERESTS:
  - Product management, especially for technical products and AI/ML applications
  - Cloud automation, AI/ML applications, DevOps, and building technical products
  - Creating intuitive interfaces for complex technical workflows
  `;
  
  // Hardcoded responses for common questions
  const responses = {
    // Personal information
    name: "My name is Shan Irshad. I'm a technical builder and system architect focused on crafting AI-native, cloud-powered solutions.",
    school: "I attend the University of Texas at Dallas, where I'm studying Computer Science with a focus on AI and cloud technologies.",
    location: "I'm based in Dallas, Texas.",
    
    // Projects and work
    ghosted: "Ghosted is a full-stack, AI-native cloud automation platform I built using React, TypeScript, Material-UI, FastAPI, Python, GPT-4o, AsyncOpenAI, AWS SDK, STS, Docker, and Terraform. It turns complex DevOps workflows into conversational actions.",
    projects: "My main projects include Ghosted (an AI-native cloud automation platform), an AI assistant at Mastercard that reduced incident triage time by 40%, and various cloud automation tools using Terraform and AWS services.",
    portfolio: "This website is my portfolio! I built it to showcase my work as a Cloud Architect, AI Engineer, and Technical Product Manager.",
    
    // Experience
    experience: "I have experience as a Technical Product Manager at Nutrify AI where I led AI-powered product initiatives and as a Site Reliability Engineer Intern at Mastercard, where I developed a Copilot-style AI assistant that reduced incident triage time by 40%.",
    mastercard: "At Mastercard, I developed a Copilot-style AI assistant using Python and LLMs that integrated with Splunk and Remedy APIs, reducing incident triage time by 40%. I also implemented ML detection algorithms analyzing 100k+ log events in real-time and automated EC2/S3 provisioning using Terraform IaC.",
    nutrify: "At Nutrify AI, I led the technical architecture and implementation of an AI-powered nutrition app with ML recommendation engine. I built and deployed a conversational AI chatbot using FastAPI and OpenAI API integration, resulting in a 25% increase in app downloads.",
    
    // Skills and interests
    skills: "My technical skills include Python, React, TypeScript, FastAPI, Docker, Terraform, AWS, CI/CD, and ML/AI integration. I have strong cloud expertise with AWS services, infrastructure as code, and DevOps practices.",
    interests: "I'm passionate about product management, especially for technical products and AI/ML applications. I also love cloud automation, DevOps, and creating intuitive interfaces for complex technical workflows.",
    education: "I have a strong background in computer science with specialized knowledge in AI and cloud technologies from the University of Texas at Dallas.",
    
    // Default responses
    greeting: ["Hi there! I'm Shan's AI assistant. Ask me anything about his technical background or projects.", "Hello! What would you like to know about Shan's technical skills and experience?", "Hey there! Feel free to ask me anything about Shan's cloud expertise or AI projects."],
    default: "I'm Shan's AI assistant. I can tell you about his technical background as a Cloud Architect, AI Engineer, and Technical Product Manager. What would you like to know?",
    contact: "You can reach Shan through LinkedIn or via email. Check out the links in the navigation menu for his professional profiles!",
    cloud: "Shan has extensive experience with cloud technologies, particularly AWS. He's built infrastructure as code using Terraform, implemented CI/CD pipelines, and developed cloud-native applications. He automated EC2/S3 provisioning using Terraform IaC and built CI/CD pipelines with Jenkins.",
    ai: "Shan is passionate about AI and its applications. He built Ghosted, an AI-native cloud automation platform, developed a Copilot-style AI assistant at Mastercard that reduced incident triage time by 40%, and implemented ML detection algorithms analyzing 100k+ log events in real-time."
  };
  
  // Keywords to match for hardcoded responses
  const responseKeywords = {
    name: ["name", "who are you", "who is shan", "about shan"],
    school: ["school", "college", "university", "education", "study", "ut dallas", "utd"],
    location: ["where", "live", "location", "based", "city"],
    ghosted: ["ghosted", "devops assistant", "aws assistant"],
    projects: ["projects", "work on", "building", "create", "developed"],
    portfolio: ["portfolio", "website", "site"],
    experience: ["experience", "work", "job", "career"],
    mastercard: ["mastercard", "sre", "file transfer"],
    nutrify: ["nutrify", "nutrition", "app"],
    skills: ["skills", "abilities", "good at", "expertise", "tech stack", "technologies"],
    interests: ["interests", "hobbies", "passionate", "enjoy"],
    greeting: ["hello", "hi", "hey", "greetings", "howdy"],
    contact: ["contact", "reach", "email", "linkedin", "social"],
    product: ["product", "manager", "management", "pm"],
    future: ["future", "plan", "goal", "aspiration"],
    cloud: ["cloud", "infrastructure", "aws", "automation", "terraform"],
    ai: ["ai", "artificial intelligence", "machine learning", "ml"]
  };
  
  // Add welcome message
  function addWelcomeMessage() {
    setTimeout(() => {
      addMessage("Hi there! I'm Shan's AI assistant. Ask me anything about his experience as a Cloud Architect, AI Engineer, and Technical Product Manager.");
    }, 800);
  }
  
  // Delay chat initialization to prevent competing with about section animations
  setTimeout(() => {
    // Initialize chat with welcome message
    addWelcomeMessage();
    
    // Check backend connection on startup
    checkBackendConnection().then(connected => {
      if (connected) {
        console.log('✅ Backend connection established on startup');
      } else {
        console.warn('⚠️ Backend connection failed on startup, will use hardcoded responses');
      }
    });
  }, 3000); // 3 second delay - increased for better separation from animations
  
  // Check if the user message matches any hardcoded response keywords
  function matchHardcodedResponse(message) {
    const normalizedMessage = message.toLowerCase();
    
    // Check each keyword category
    for (const [category, keywords] of Object.entries(responseKeywords)) {
      // If any keyword in this category is found in the message
      if (keywords.some(keyword => normalizedMessage.includes(keyword.toLowerCase()))) {
        if (category === 'greeting') {
          return randomChoice(responses[category]);
        }
        return responses[category];
      }
    }
    
    // No match found
    return null;
  }
  
  // Function to get hardcoded responses based on user message
  async function getHardcodedResponse(userMessage) {
    // Convert message to lowercase for easier matching
    const lowerMessage = userMessage.toLowerCase();
    
    // Define response categories and patterns
    const responses = {
      // Experience related responses
      experience: {
        patterns: ['experience', 'work', 'job', 'mastercard', 'nutrify', 'intern', 'internship'],
        responses: [
          "Shan has experience as a Technical Product Manager at Nutrify AI and as a Site Reliability Engineer Intern at Mastercard. At Mastercard, he developed a Copilot-style AI assistant that reduced incident triage time by 40%. At Nutrify AI, he led the technical architecture of an AI-powered nutrition app with ML recommendation engine.",
          "Shan's professional experience includes a Site Reliability Engineer Internship at Mastercard where he implemented ML detection algorithms analyzing 100k+ log events in real-time, and a Technical Product Manager role at Nutrify AI where he built conversational AI chatbots resulting in a 25% increase in app downloads."
        ]
      },
      // Skills related responses
      skills: {
        patterns: ['skills', 'technologies', 'programming', 'languages', 'frameworks', 'tools', 'tech stack'],
        responses: [
          "Shan's technical skills include Python, React, TypeScript, FastAPI, Docker, Terraform, AWS, CI/CD, and ML/AI integration. He has strong cloud expertise with AWS services, infrastructure as code, and DevOps practices.",
          "Shan is skilled in cloud infrastructure, AI development, and technical product management. He has experience with AWS services, Terraform IaC, CI/CD pipelines, and ML/AI integration. He's also proficient in Python, React, TypeScript, and FastAPI."
        ]
      },
      // Project related responses
      projects: {
        patterns: ['projects', 'portfolio', 'ghosted', 'app', 'applications', 'built', 'created', 'developed'],
        responses: [
          "Shan's notable projects include Ghosted, a full-stack AI-native cloud automation platform using React, TypeScript, FastAPI, Python, and AWS. He also developed an AI assistant at Mastercard that reduced incident triage time by 40%.",
          "Shan has worked on several projects including Ghosted (an AI-native cloud automation platform), an AI-powered nutrition app with ML recommendation engine at Nutrify AI, and various cloud automation tools using Terraform and AWS services."
        ]
      },
      // Education related responses
      education: {
        patterns: ['education', 'school', 'university', 'college', 'degree', 'major', 'study'],
        responses: [
          "Shan is studying Computer Science at the University of Texas at Dallas with a focus on AI and cloud technologies. He combines his technical education with practical experience in cloud architecture and AI engineering.",
          "Shan has a background in Computer Science from the University of Texas at Dallas with specialization in AI and cloud technologies. His education is complemented by hands-on experience building AI-native, cloud-powered solutions."
        ]
      },
      // Default responses
      default: [
        "I'm an AI assistant for Shan's portfolio. I can tell you about his experience as a Cloud Architect, AI Engineer, and Technical Product Manager. What would you like to know?",
        "I can share information about Shan's work experience, technical skills, projects, or educational background. How can I help you today?",
        "I'm here to tell you about Shan Irshad's background as a technical builder and system architect. Feel free to ask about his cloud expertise, AI projects, or technical skills!"
      ]
    };
    
    // Check each category for matching patterns
    for (const [category, data] of Object.entries(responses)) {
      if (category === 'default') continue;
      
      const hasMatch = data.patterns.some(pattern => lowerMessage.includes(pattern));
      if (hasMatch) {
        return data.responses[Math.floor(Math.random() * data.responses.length)];
      }
    }
    
    // If no specific match, return a default response
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
  
  // Configuration for chat responses
  const chatConfig = {
    useAPI: true, // Enabled API mode by default
    backendURL: null, // Will be automatically determined based on environment
    debugMode: true // Enable debug mode to help troubleshoot issues
  };
  
  // Function to toggle between API and hardcoded responses
  // This can be called from the console for testing: toggleChatAPI(true) or toggleChatAPI(false)
  function toggleChatAPI(useAPI) {
    chatConfig.useAPI = !!useAPI;
    console.log(`Chat API mode: ${chatConfig.useAPI ? 'ENABLED' : 'DISABLED'}`);
    return chatConfig.useAPI;
  }
  
  // Make the toggle function available globally for testing
  window.toggleChatAPI = toggleChatAPI;
  
  // Function to check if the backend is available
  async function checkBackendConnection() {
    try {
      // Determine if we're in development or production
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      // Use the appropriate backend URL based on environment
      const healthCheckURLs = isLocalhost
        ? [
            window.location.protocol + '//localhost:10000/health',
            window.location.protocol + '//localhost:8742/health'
          ]
        : [
            'https://portf-ti65.onrender.com/health',
            'https://shan-portfolio-backend.onrender.com/health'
          ];
      
      // Try each health check URL
      for (const url of healthCheckURLs) {
        try {
          if (chatConfig.debugMode) console.log(`Checking backend health at: ${url}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
          
          const response = await fetch(url, { 
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          const data = await response.json();
          
          if (response.ok && data.status === 'ok') {
            console.log(`✅ Backend connection successful at ${url}`);
            // Store the base URL for future API calls
            chatConfig.backendURL = url.replace('/health', '');
            return true;
          } else {
            console.warn(`⚠️ Backend at ${url} responded but with unexpected data:`, data);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to connect to ${url}:`, err.message);
          // Continue to the next URL
        }
      }
      
      // If we get here, all URLs failed
      console.error('❌ All backend connections failed');
      return false;
    } catch (error) {
      console.error('❌ Backend connection check failed:', error);
      return false;
    }
  }
  
  // Make the check function available globally
  window.checkBackendConnection = checkBackendConnection;
  
  // Process user message and get response
  async function getAIResponse(message) {
    // Check if we should use API or hardcoded responses
    if (chatConfig.useAPI) {
      try {
        // If we don't have a backendURL yet, try to establish one
        if (!chatConfig.backendURL) {
          const isConnected = await checkBackendConnection();
          if (!isConnected) {
            console.warn('⚠️ Could not establish backend connection, falling back to hardcoded responses');
            return await getHardcodedResponse(message);
          }
        }
        
        // Determine if we're in development or production
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // Use the established backend URL or try the defaults
        const backendURLs = chatConfig.backendURL 
          ? [`${chatConfig.backendURL}/api/chat`]
          : isLocalhost 
            ? [
                window.location.protocol + '//localhost:10000/api/chat',
                window.location.protocol + '//localhost:8742/api/chat'
              ]
            : [
                'https://portf-ti65.onrender.com/api/chat',
                'https://shan-portfolio-backend.onrender.com/api/chat'
              ];
        
        let lastError = null;
        
        // Try each backend URL until one works
        for (const url of backendURLs) {
          try {
            if (chatConfig.debugMode) console.log(`Trying backend URL: ${url}`);
            
            // Use a longer timeout (10 seconds) and handle it more gracefully
            const response = await Promise.race([
              fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
                // Don't use AbortSignal here to avoid the abort error
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error(`Request to ${url} timed out after 10 seconds`)), 10000)
              )
            ]);
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`API responded with status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            // Store the successful URL base for future use
            chatConfig.backendURL = url.replace('/api/chat', '');
            if (chatConfig.debugMode) console.log(`Successfully connected to backend at: ${url}`);
            
            // Check if the response has a message property (from backend) or response property
            if (data.message) {
              return data.message;
            } else if (data.response) {
              return data.response;
            } else {
              // If neither exists, throw an error
              throw new Error('Invalid response format from API');
            }
          } catch (err) {
            console.warn(`Failed to connect to ${url}:`, err.message);
            lastError = err;
            // Continue to the next URL
          }
        }
        
        // If we get here, all URLs failed
        throw lastError || new Error('All backend URLs failed');
      } catch (error) {
        console.error('Error calling chat API:', error);
        // Fallback to hardcoded responses if API fails
        return await getHardcodedResponse(message);
      }
    } else {
      // Use hardcoded responses
      return await getHardcodedResponse(message);
    }
  }
  
  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'assistant-message');
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animate the message appearance
    setTimeout(() => {
      messageDiv.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    return messageDiv;
  }
  
  // Typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'assistant-message', 'typing-indicator');
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  }
  
  async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    try {
      // Get AI response (hardcoded or from OpenAI)
      const response = await getAIResponse(message);
      
      // Safety check for undefined or null response
      if (!response) {
        throw new Error('Received empty response from API');
      }
      
      // Calculate typing delay based on response length (simulate natural typing)
      const typingDelay = Math.min(1500, response.length * 10);
      
      // Remove typing indicator after delay and show response
      setTimeout(() => {
        typingIndicator.remove();
        addMessage(response);
      }, typingDelay);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      try {
        // Try to get a hardcoded response as fallback
        const fallbackResponse = await getHardcodedResponse(message);
        
        setTimeout(() => {
          typingIndicator.remove();
          if (fallbackResponse && fallbackResponse !== responses.default) {
            // We found a matching hardcoded response
            addMessage(fallbackResponse);
          } else {
            // No matching hardcoded response, show error
            addMessage("I'm having trouble connecting to my backend. I'll use my local knowledge instead. What would you like to know about Shan?");
            // Automatically try to fix the connection
            checkBackendConnection().then(connected => {
              if (connected && chatConfig.debugMode) {
                console.log('✅ Reconnected to backend successfully');
              }
            });
          }
        }, 1000);
      } catch (fallbackError) {
        console.error('Error getting fallback response:', fallbackError);
        setTimeout(() => {
          typingIndicator.remove();
          addMessage("I'm having trouble processing your request. Please try again later.");
        }, 1000);
      }
    }
  }
  
  // Event listeners
  sendButton.addEventListener('click', handleSendMessage);
  
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  
  // Focus the input field when clicking anywhere in the chat container
  document.querySelector('.ai-chat-container').addEventListener('click', function() {
    chatInput.focus();
  });
  
  // Add CSS for typing indicator
  const style = document.createElement('style');
  style.textContent = `
    .typing-indicator {
      padding: 0.5rem 1rem;
    }
    .typing-dots {
      display: flex;
      gap: 4px;
    }
    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #9CA3AF;
      display: inline-block;
      animation: typingAnimation 1.4s infinite ease-in-out both;
    }
    .typing-dots span:nth-child(1) {
      animation-delay: -0.32s;
    }
    .typing-dots span:nth-child(2) {
      animation-delay: -0.16s;
    }
    @keyframes typingAnimation {
      0%, 80%, 100% { transform: scale(0.6); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
});
