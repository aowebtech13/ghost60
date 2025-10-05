// Constants and Configuration
const PARALLAX_MAX_STRENGTH = 0.3;
// Triggers when 50% of the element's height is above the viewport bottom (0px 0px -50% 0px)
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
        // In a live environment, the script tag creation/insertion would go here:
        // const script = document.createElement('script');
        // script.src = 'path/to/360-viewer.js';
        // document.head.appendChild(script);

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
 * Uses rootMargin to fire when 50% of the element is in view.
 */
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const content = entry.target.querySelector('.section-content');
            if (content) {
                if (entry.isIntersecting) {
                    // Check if reduced motion is preferred before adding the class
                    if (prefersReducedMotion) {
                        // This overrides the CSS transition for an instant snap (works alongside CSS @media query)
                        content.style.transition = 'none'; 
                    }
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

                // Calculate the subtle background movement relative to the scroll position
                const movement = currentScrollY * clampedStrength * -1;

                // Apply the transform to the background layer (the section element itself)
                el.style.transform = `translateY(${movement}px)`;
            });
        }
        
        // Request the next frame
        requestAnimationFrame(updateParallax);
    }

    console.log("Parallax Logic: Parallax initialized and active via requestAnimationFrame.");
    // Start the RAF loop
    requestAnimationFrame(updateParallax);
}


// Wait for the entire page (including all elements) to load before initializing logic
window.onload = function() {
    load360ViewerScript();
    setupIntersectionObserver();
    setupParallax();
};