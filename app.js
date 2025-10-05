// Constants and Configuration
const PARALLAX_MAX_STRENGTH = 0.3;
// Triggers when 50% of the element's height is above the viewport bottom
const observerRootMargin = '0px 0px -50% 0px'; 
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Checks for the presence of the '.gw-pano' element and conditionally "loads" the 360 viewer logic.
 * This ensures the script is not loaded if the element is absent (Acceptance Check).
 */
function load360ViewerScript() {
    const panoElement = document.querySelector('.gw-pano');

    if (panoElement) {
        // --- Conditional Load Logic ---
        // This simulates the lazy-loading of the 360 script (e.g., Krpano or similar)
        // In production, you would dynamically create and append the script tag here.

        console.log("360 Viewer Logic: Element '.gw-pano' found. Hypothetical 360 viewer script is loaded and initialized.");
        
        // Update the placeholder for visual confirmation
        panoElement.innerHTML = `<p class="text-lg text-indigo-700 font-semibold">360 Viewer Initialized! (Source: ${panoElement.dataset.src})</p>`;

    } else {
        // This confirms the acceptance requirement: No script loading if no element is present.
        console.log("360 Viewer Logic: Element '.gw-pano' NOT found. 360 script loading successfully skipped.");
    }
}


/**
 * Sets up the Intersection Observer to trigger section reveals.
 * Uses rootMargin: -50% to fire when the section's center point enters the viewport.
 */
function setupIntersectionObserver() {
    // Select all required story sections
    const sections = document.querySelectorAll('.gw-chapter'); 

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Target the content wrapper inside the section
            const content = entry.target.querySelector('.section-content'); 
            if (content) {
                if (entry.isIntersecting) {
                    // Check if reduced motion is preferred
                    if (prefersReducedMotion) {
                        // For reduced motion users, force an instant snap-in transition
                        content.style.transition = 'none'; 
                    }
                    // Add the class that triggers the CSS transition (or snap)
                    entry.target.classList.add('is-visible');
                    // Stop observing once the element is visible
                    observer.unobserve(entry.target); 
                }
            }
        });
    }, {
        rootMargin: observerRootMargin,
        threshold: 0
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}


/**
 * Sets up the subtle parallax effect using requestAnimationFrame (RAF).
 * Disables itself entirely if prefers-reduced-motion is true.
 */
function setupParallax() {
    // Check for reduced motion preference (Acceptance Check)
    if (prefersReducedMotion) {
        console.log("Parallax Logic: Reduced motion detected. Parallax scrolling is disabled.");
        return;
    }

    const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
    let lastScrollY = window.scrollY;

    function updateParallax() {
        const currentScrollY = window.scrollY;
        // Optimization: only process if scroll position has actually changed
        if (currentScrollY !== lastScrollY) {
            lastScrollY = currentScrollY;

            parallaxElements.forEach(el => {
                const strength = parseFloat(el.dataset.parallax);

                // Clamp strength to the specified maximum (0.0 to 0.3)
                const clampedStrength = Math.min(Math.max(0, strength), PARALLAX_MAX_STRENGTH);

                // Calculate the subtle background movement (negative for slow movement)
                const movement = currentScrollY * clampedStrength * -1;

                // Apply the transform (good for iOS/Mobile performance)
                el.style.transform = `translateY(${movement}px)`;
            });
        }
        
        // Request the next frame for smooth animation
        requestAnimationFrame(updateParallax);
    }

    console.log("Parallax Logic: Parallax initialized and active via requestAnimationFrame.");
    // Start the RAF loop
    requestAnimationFrame(updateParallax);
}


// Wait for the entire page (including all assets like images) to load before initializing logic
window.onload = function() {
    load360ViewerScript();
    setupIntersectionObserver();
    setupParallax();
};
