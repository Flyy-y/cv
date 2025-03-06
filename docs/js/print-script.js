/**
 * Print-specific CV script
 */

document.addEventListener('DOMContentLoaded', function () {
    // Import shared script
    const script = document.createElement('script');
    script.src = 'js/shared.js';
    script.onload = initializePrintCV;
    document.head.appendChild(script);

    function initializePrintCV() {
        // Initialize the CV renderer
        const renderer = new CVRenderer().init();
        
        // Set up auto-print functionality
        setupAutoPrint();
        
        // Load CV with current language
        renderer.render(renderer.currentLanguage);
        
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
