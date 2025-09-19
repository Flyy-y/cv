/**
 * Print-specific CV script
 */

document.addEventListener('DOMContentLoaded', function () {
    // Import shared script
    const sharedScript = document.createElement('script');
    sharedScript.src = 'js/shared.js';
    sharedScript.onload = function() {
        // Initialize print CV
        initializePrintCV();
    };
    document.head.appendChild(sharedScript);

    function initializePrintCV() {
        // Initialize the CV renderer
        const renderer = new CVRenderer().init();

        // Get language from URL hash (e.g., #en or #fr)
        const hash = window.location.hash.replace('#', '');
        const language = (hash === 'en' || hash === 'fr') ? hash : 'fr';

        // Set up auto-print functionality
        setupAutoPrint();

        // Load CV with the specified language
        renderer.render(language);

        // Function to change the language (if needed)
        window.changeLanguage = function(language) {
            renderer.render(language);
        };
    }

    function setupAutoPrint() {
        // Auto-print functionality with Firefox compatibility
        window.addEventListener('load', function() {
            if (window.matchMedia) {
                // Add a print listener to close the window after printing
                const mediaQueryList = window.matchMedia('print');
                mediaQueryList.addEventListener('change', function(mql) {
                    if (!mql.matches) {
                        // Print dialog was closed
                        setTimeout(function() {
                            window.close();
                        }, 500);
                    }
                });
            }

            // Trigger print after a delay to ensure content is loaded
            setTimeout(function() {
                window.print();

                // Fallback for browsers that don't support the print media query
                if (!window.matchMedia) {
                    setTimeout(function() {
                        window.close();
                    }, 1000);
                }
            }, 1500);
        });
    }
});