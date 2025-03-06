/**
 * Main CV script
 */

document.addEventListener('DOMContentLoaded', function () {
    // Import shared script
    const script = document.createElement('script');
    script.src = 'js/shared.js';
    script.onload = initializeCV;
    document.head.appendChild(script);

    function initializeCV() {
        // Initialize the CV renderer
        const renderer = new CVRenderer().init();
        
        // Set up scroll behavior for language selector
        setupScrollBehavior();
        
        // Set up print functionality
        setupPrintFunctionality(renderer);
        
        // PDF export button removed
        
        // Load default language
        renderer.render(renderer.currentLanguage).then(() => {
            // After rendering is complete, enhance the experience section
            enhanceExperienceSection(renderer.data, renderer);
            
            // Make skill sections collapsible
            enhanceSkillSections();
            
            // Add animations to elements
            addAnimations();
        });
        
        // Function to change the language
        window.changeLanguage = function(language) {
            renderer.render(language).then(() => {
                // Re-enhance experience section after language change
                enhanceExperienceSection(renderer.data, renderer);
                
                // Re-enhance skill sections
                enhanceSkillSections();
                
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
            
            const printWindow = window.open(
                `printable.html#${renderer.currentLanguage}`,
                'Print',
                'left=200, top=200, width=950, height=500, toolbar=0, resizable=0'
            );
            
            // Cross-browser print handling
            printWindow.addEventListener('load', function() {
                // Give the browser time to fully render the content before printing
                setTimeout(function() {
                    try {
                        printWindow.print();
                        // Only close after print dialog is closed or printing is done
                        setTimeout(function() {
                            printWindow.close();
                        }, 1000);
                    } catch (e) {
                        console.error('Print error:', e);
                        printWindow.close();
                    }
                }, 1000);
            });
        };
    }
    
    // PDF export function removed
    
    function enhanceExperienceSection(data, renderer) {
        if (!data || !data.experience) return;
        
        const experienceContainer = document.getElementById('experience');
        if (!experienceContainer) return;
        
        // Get all experience items
        const experienceItems = experienceContainer.querySelectorAll('.experience-item');
        if (!experienceItems.length) return;
        
        // Add interactive features to each experience item
        experienceItems.forEach((item, index) => {
            // Remove animation classes
            
            // Make the title interactive
            const title = item.querySelector('h3');
            if (title) {
                title.style.cursor = 'pointer';
                title.classList.add('interactive-title');
                
                // Add icon to indicate expandable content
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down';
                icon.style.marginLeft = '10px';
                icon.style.fontSize = '0.8em';
                icon.style.transition = 'transform 0.3s ease';
                title.appendChild(icon);
                
                // Get the details list
                const detailsList = item.querySelector('ul');
                if (detailsList) {
                    // Initially show details (not retracted by default)
                    detailsList.style.display = 'block';
                    detailsList.style.overflow = 'hidden';
                    detailsList.style.transition = 'max-height 0.5s ease';
                    detailsList.style.maxHeight = detailsList.scrollHeight + 'px';
                    // Rotate icon to show expanded state
                    icon.style.transform = 'rotate(180deg)';
                    
                    // Toggle details on title click
                    title.addEventListener('click', () => {
                        const isExpanded = detailsList.style.display !== 'none';
                        
                        if (isExpanded) {
                            // Collapse
                            detailsList.style.maxHeight = '0';
                            setTimeout(() => {
                                detailsList.style.display = 'none';
                            }, 500);
                            icon.style.transform = 'rotate(0deg)';
                        } else {
                            // Expand
                            detailsList.style.display = 'block';
                            detailsList.style.maxHeight = detailsList.scrollHeight + 'px';
                            icon.style.transform = 'rotate(180deg)';
                        }
                        
                        // Add highlight effect
                        item.classList.add('highlight-pulse');
                        setTimeout(() => {
                            item.classList.remove('highlight-pulse');
                        }, 1000);
                    });
                }
            }
            
            // Skill badges are now added directly in the shared.js file
            // Add hover effect for visual feedback to existing badges
            const badges = item.querySelectorAll('.skill-badge');
            badges.forEach(badge => {
                badge.addEventListener('mouseenter', () => {
                    badge.classList.add('badge-hover');
                });
                
                badge.addEventListener('mouseleave', () => {
                    badge.classList.remove('badge-hover');
                });
            });
        });
    }
    
    function addAnimations() {
        // Only animate progress bars
        animateProgressBars();
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
    
    /**
     * Make skill sections collapsible
     */
    function enhanceSkillSections() {
        const skillSections = document.querySelectorAll('.skills-section');
        
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;
        
        skillSections.forEach((section, index) => {
            // Make the heading interactive
            const heading = section.querySelector('h4');
            if (heading) {
                heading.style.cursor = 'pointer';
                heading.classList.add('interactive-title');
                
                // Add icon to indicate expandable content
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down';
                icon.style.marginLeft = '10px';
                icon.style.fontSize = '0.8em';
                icon.style.transition = 'transform 0.3s ease';
                heading.appendChild(icon);
                
                // Get the skills list
                const skillsList = section.querySelector('ul');
                if (skillsList) {
                    // Set up transition properties
                    skillsList.style.overflow = 'hidden';
                    skillsList.style.transition = 'max-height 0.5s ease';
                    
                    // Default state based on device
                    if (isMobile) {
                        // On mobile, collapse by default
                        skillsList.style.maxHeight = '0px';
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        // On desktop, expand by default
                        skillsList.style.maxHeight = skillsList.scrollHeight + 'px';
                        icon.style.transform = 'rotate(180deg)';
                    }
                    
                    // Toggle skills on heading click
                    heading.addEventListener('click', () => {
                        const isExpanded = skillsList.style.maxHeight !== '0px';
                        
                        if (isExpanded) {
                            // Collapse
                            skillsList.style.maxHeight = '0px';
                            icon.style.transform = 'rotate(0deg)';
                        } else {
                            // Expand
                            skillsList.style.maxHeight = skillsList.scrollHeight + 'px';
                            icon.style.transform = 'rotate(180deg)';
                        }
                        
                        // Add highlight effect
                        section.classList.add('highlight-pulse');
                        setTimeout(() => {
                            section.classList.remove('highlight-pulse');
                        }, 1000);
                    });
                }
            }
        });
        
        // Handle window resize to adjust skill sections
        window.addEventListener('resize', function() {
            const newIsMobile = window.innerWidth <= 768;
            
            // Only update if mobile state changed
            if (newIsMobile !== isMobile) {
                // Reload the page to apply new defaults
                // This is a simple approach - a more complex solution would
                // dynamically update all sections without reload
                location.reload();
            }
        });
    }
    
    // Handle profile picture if needed
    function setupProfilePicture(data, renderer) {
        const profilePic = document.getElementById('profile-pic');
        if (!profilePic || !data.profilePic) return;
        
        profilePic.src = data.profilePic;
        profilePic.alt = renderer.getTranslation(data, 'name');
        profilePic.style.display = data.profilePic ? 'block' : 'none';
        
        // Add animation to profile picture
        profilePic.classList.add('fade-in');
    }
});
