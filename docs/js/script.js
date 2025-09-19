/**
 * CV main script
 */

document.addEventListener('DOMContentLoaded', function () {
    // Import shared scripts
    const sharedScript = document.createElement('script');
    sharedScript.src = 'js/shared.js';
    sharedScript.onload = function() {
        // Initialize CV
        initializeCV();
    };
    document.head.appendChild(sharedScript);

    function initializeCV() {
        // Initialize the CV renderer
        const renderer = new CVRenderer().init();

        // Set up scroll behavior for language selector
        setupScrollBehavior();

        // Set up print functionality
        setupPrintFunctionality(renderer);

        // Load default language
        renderer.render(renderer.currentLanguage).then(() => {
            // Add animations to elements
            addAnimations();
        });

        // Function to change the language
        window.changeLanguage = function(language) {
            renderer.render(language).then(() => {
                // Refresh animations
                addAnimations();
            });
        };
    }

    function setupScrollBehavior() {
        const languageSelectorContainer = document.querySelector('.language-selector-container');
        if (!languageSelectorContainer) return;

        window.addEventListener('scroll', function() {
            // Show/hide language selector based on scroll position
            if (window.scrollY === 0) {
                languageSelectorContainer.classList.remove('language-hidden');
            } else {
                languageSelectorContainer.classList.add('language-hidden');
            }
        });
    }

    function setupPrintFunctionality(renderer) {
        // Check if browser is Firefox
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        // Hide print button for Firefox browsers
        if (isFirefox) {
            const printButton = document.getElementById('btn-print');
            if (printButton) {
                printButton.style.display = 'none';
            }
        }

        window.printCv = function() {
            // Only proceed if not Firefox
            if (isFirefox) {
                console.warn('Printing is not supported in Firefox');
                return;
            }

            // Open the printable version in a new window
            const printWindow = window.open(
                `printable.html#${renderer.currentLanguage}`,
                'Print',
                'left=200, top=200, width=950, height=500, toolbar=0, resizable=0'
            );
        };
    }

    function addAnimations() {
        // Animate progress bars
        animateProgressBars();

        // Add fade-in animation to key points items
        const keyPointsItems = document.querySelectorAll('.key-points-item');
        keyPointsItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    /**
     * Animate progress bars when they come into view
     */
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-inner');

        // Store original widths and set to 0%
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.dataset.targetWidth = targetWidth;
            bar.style.width = '0%';
            bar.classList.add('animate-progress');
        });

        // Function to check if an element is in viewport
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        };

        // Function to animate progress bars in viewport
        const animateVisibleBars = () => {
            progressBars.forEach(bar => {
                if (isInViewport(bar) && bar.style.width === '0%' && bar.dataset.targetWidth) {
                    // Animate to target width
                    setTimeout(() => {
                        bar.style.width = bar.dataset.targetWidth;
                    }, 100);
                }
            });
        };

        // Initial check
        animateVisibleBars();

        // Check on scroll
        window.addEventListener('scroll', animateVisibleBars);
    }
});