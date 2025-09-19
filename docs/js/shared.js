/**
 * CV - Shared functionality for CV display and printing
 */

class CVRenderer {
    constructor() {
        this.currentLanguage = 'fr';
    }

    /**
     * Initialize the CV renderer
     */
    init() {
        return this;
    }

    /**
     * Load CV data from JSON file
     */
    async loadCV(language) {
        this.currentLanguage = language;
        try {
            const response = await fetch('cv.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading CV data:', error);
            throw error;
        }
    }

    /**
     * Get translation for a given object and key
     */
    getTranslation(obj, key) {
        if (!obj || !obj[key]) return '';

        if (typeof obj[key] === 'string') {
            return obj[key];
        }

        return obj[key][this.currentLanguage] || obj[key]['en'] || obj[key]['fr'] || '';
    }

    /**
     * Render page metadata
     */
    renderPageMetadata(data) {
        const titleElement = document.getElementById('page-title');
        if (titleElement && data.pageTitle) {
            titleElement.textContent = this.getTranslation(data, 'pageTitle');
        }

        const nameElement = document.getElementById('name');
        if (nameElement && data.name) {
            nameElement.textContent = this.getTranslation(data, 'name');
        }

        const titleJobElement = document.getElementById('title');
        if (titleJobElement && data.title) {
            titleJobElement.textContent = this.getTranslation(data, 'title');
        }

        const subtitleElement = document.getElementById('subtitle');
        if (subtitleElement && data.subtitle) {
            subtitleElement.textContent = this.getTranslation(data, 'subtitle');
        }

        const profilePicElement = document.getElementById('profile-pic');
        if (profilePicElement && data.profilePic) {
            profilePicElement.src = data.profilePic;
            profilePicElement.alt = this.getTranslation(data, 'name');
        }
    }

    /**
     * Render language buttons
     */
    renderLanguageButtons(data) {
        const frButton = document.getElementById('btn-fr');
        const enButton = document.getElementById('btn-en');

        if (frButton && data.interface && data.interface.languageButtons && data.interface.languageButtons.french) {
            frButton.textContent = this.getTranslation(data.interface.languageButtons.french, this.currentLanguage);
        }

        if (enButton && data.interface && data.interface.languageButtons && data.interface.languageButtons.english) {
            enButton.textContent = this.getTranslation(data.interface.languageButtons.english, this.currentLanguage);
        }
    }

    /**
     * Update language button states
     */
    updateLanguageButtons() {
        const frButton = document.getElementById('btn-fr');
        const enButton = document.getElementById('btn-en');

        if (frButton && enButton) {
            frButton.classList.toggle('active', this.currentLanguage === 'fr');
            enButton.classList.toggle('active', this.currentLanguage === 'en');
        }
    }

    /**
     * Render contact information
     */
    renderContactInfo(data) {
        if (!data.contact) return;

        const emailElement = document.querySelector('#email span');
        if (emailElement && data.contact.email) {
            // Decode base64 email and make it clickable
            const decodedEmail = atob(data.contact.email.trim());
            emailElement.innerHTML = `<a href="mailto:${decodedEmail}" class="secondary-text">${decodedEmail}</a>`;
        }

        const phoneElement = document.querySelector('#phone span');
        if (phoneElement && data.contact.phone) {
            // Decode base64 phone and make it clickable
            const decodedPhone = atob(data.contact.phone.trim());
            const phoneLink = decodedPhone.replace(/\s/g, ''); // Remove spaces for tel: link
            phoneElement.innerHTML = `<a href="tel:${phoneLink}" class="secondary-text">${decodedPhone}</a>`;
        }

        const locationElement = document.querySelector('#location span');
        if (locationElement && data.contact.location) {
            locationElement.textContent = this.getTranslation(data.contact, 'location');
        }

        const linkedinElement = document.getElementById('linkedin');
        if (linkedinElement && data.contact.linkedin) {
            linkedinElement.href = data.contact.linkedin;
        }

        const websiteElement = document.getElementById('website');
        const websiteTextElement = document.getElementById('website-text');
        if (websiteElement && data.contact.website) {
            websiteElement.href = data.contact.website;
            if (websiteTextElement) {
                websiteTextElement.textContent = data.contact.website;
            }
        }
    }

    /**
     * Render skills section
     */
    renderSkills(data) {
        const container = document.getElementById('skills');
        if (!container || !data.skills) return;

        // Clear existing content except title
        const title = container.querySelector('h3');
        container.innerHTML = '';
        if (title) container.appendChild(title);

        data.skills.forEach(skillCategory => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';

            const categoryTitle = document.createElement('h4');
            categoryTitle.classList.add('secondary-text');
            categoryTitle.textContent = this.getTranslation(skillCategory, 'category');
            categoryDiv.appendChild(categoryTitle);

            const skillsList = document.createElement('div');
            skillsList.className = 'skills-list';

            skillCategory.items.forEach(skill => {
                const skillDiv = document.createElement('div');
                skillDiv.className = 'skill-item';

                const skillName = document.createElement('span');
                skillName.classList.add('secondary-text');
                skillName.textContent = this.getTranslation(skill, 'name');

                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';

                const progressBarInner = document.createElement('div');
                progressBarInner.className = 'progress-bar-inner';
                progressBarInner.style.width = skill.level + '%';

                progressBar.appendChild(progressBarInner);
                skillDiv.appendChild(skillName);
                skillDiv.appendChild(progressBar);
                skillsList.appendChild(skillDiv);
            });

            categoryDiv.appendChild(skillsList);
            container.appendChild(categoryDiv);
        });

        // Set skills title
        const skillsTitle = document.getElementById('skills-title');
        if (skillsTitle && data.interface && data.interface.skills) {
            skillsTitle.textContent = this.getTranslation(data.interface, 'skills');
        }
    }

    /**
     * Render languages
     */
    renderLanguages(data) {
        const container = document.getElementById('languages');
        if (!container || !data.languages) return;

        container.innerHTML = '';

        data.languages.forEach(language => {
            const li = document.createElement('li');
            li.classList.add('secondary-text');

            const name = this.getTranslation(language, 'name');
            const level = language.level;

            // Create language name
            const languageName = document.createElement('span');
            languageName.innerHTML = `<strong>${name}</strong>`;
            li.appendChild(languageName);

            // Create progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';

            const progressBarInner = document.createElement('div');
            progressBarInner.className = 'progress-bar-inner';
            progressBarInner.style.width = level + '%';

            progressBar.appendChild(progressBarInner);
            li.appendChild(progressBar);

            container.appendChild(li);
        });
    }

    /**
     * Render education
     */
    renderEducation(data) {
        const container = document.getElementById('education');
        if (!container || !data.education) return;

        container.innerHTML = '';

        data.education.forEach(edu => {
            const li = document.createElement('li');
            li.classList.add('secondary-text');

            const degree = this.getTranslation(edu, 'degree');
            const details = this.getTranslation(edu, 'details');

            li.innerHTML = `
                <strong>${edu.year} - ${degree}</strong><br>
                <em>${edu.city}, ${edu.country}</em><br>
                ${details}
            `;
            container.appendChild(li);
        });
    }

    /**
     * Render certifications
     */
    renderCertifications(data) {
        const container = document.getElementById('certifications');
        if (!container || !data.certifications) return;

        container.innerHTML = '';

        data.certifications.forEach(cert => {
            const li = document.createElement('li');
            li.classList.add('secondary-text');

            const title = this.getTranslation(cert, 'title');

            li.innerHTML = `<strong>${cert.year}</strong> - ${title}`;
            container.appendChild(li);
        });
    }

    /**
     * Render the CV based on loaded data
     * @param {String} language - The language to render
     * @returns {Promise} - Promise that resolves when rendering is complete
     */
    async render(language) {
        try {
            const data = await this.loadCV(language);
            console.log('CV data loaded:', data);

            // Render all sections
            this.renderPageMetadata(data);
            this.renderLanguageButtons(data);
            this.renderContactInfo(data);
            this.renderSectionTitles(data);
            this.renderProfileSection(data);
            this.renderKeyPoints(data);
            this.renderSkills(data);
            this.renderExperience(data);
            this.renderLanguages(data);
            this.renderEducation(data);
            this.renderCertifications(data);
            this.renderTechnicalInterests(data);
            this.renderContinuousLearning(data);

            // Update language buttons if they exist
            if (document.getElementById('btn-fr') && document.getElementById('btn-en')) {
                this.updateLanguageButtons();
            }

            return true;
        } catch (error) {
            console.error('Error rendering CV:', error);
            return false;
        }
    }

    /**
     * Render profile section
     */
    renderProfileSection(data) {
        const profileElement = document.getElementById('profile-text');
        if (profileElement && data.profile) {
            profileElement.innerHTML = this.getTranslation(data, 'profile');
        }
    }

    /**
     * Render section titles for CV
     */
    renderSectionTitles(data) {
        // Key Points
        const keyPointsTitle = document.getElementById('keyPoints-title');
        if (keyPointsTitle && data.sections.keyPoints) {
            keyPointsTitle.textContent = this.getTranslation(data.sections, 'keyPoints');
        }

        // Experience
        const experienceTitle = document.getElementById('experience-title');
        if (experienceTitle && data.interface && data.interface.experience) {
            experienceTitle.textContent = this.getTranslation(data.interface, 'experience');
        }


        // Technical Interests
        const technicalInterestsTitle = document.getElementById('technicalInterests-title');
        if (technicalInterestsTitle && data.sections.technicalInterests) {
            technicalInterestsTitle.textContent = this.getTranslation(data.sections, 'technicalInterests');
        }

        // Continuous Learning
        const continuousLearningTitle = document.getElementById('continuousLearning-title');
        if (continuousLearningTitle && data.sections.continuousLearning) {
            continuousLearningTitle.textContent = this.getTranslation(data.sections, 'continuousLearning');
        }

        // Standard sections
        const standardSections = ['languages', 'education', 'certifications', 'summary'];
        standardSections.forEach(section => {
            const element = document.getElementById(`${section}-title`);
            if (element && data.sections[section]) {
                element.textContent = this.getTranslation(data.sections, section);
            }
        });
    }

    /**
     * Render "Key Points" section
     */
    renderKeyPoints(data) {
        const container = document.getElementById('keyPoints');
        if (!container || !data.keyPoints) return;

        container.innerHTML = '';

        data.keyPoints.forEach(item => {
            const div = document.createElement('div');
            div.className = 'key-points-item';

            const title = this.getTranslation(item, 'title');
            const description = this.getTranslation(item, 'description');

            div.innerHTML = `
                <i class="${item.icon}"></i>
                <div>
                    <strong>${title}</strong>
                    <span>${description}</span>
                </div>
            `;

            container.appendChild(div);
        });
    }


    /**
     * Render unified experience section
     */
    renderExperience(data) {
        const container = document.getElementById('experience');
        if (!container) {
            console.error('Experience container not found');
            return;
        }

        // Handle both old and new data structure for backward compatibility
        let experiences = [];
        if (data.experience) {
            experiences = data.experience;
        } else if (data.freelanceMissions && data.previousEmployment) {
            // Merge old structure into new one
            experiences = [...data.freelanceMissions, ...data.previousEmployment];
        } else {
            console.error('No experience data found', data);
            return;
        }

        // Clear existing content except the title
        const title = container.querySelector('h2');
        container.innerHTML = '';
        if (title) container.appendChild(title);

        experiences.forEach(exp => {
            const section = document.createElement('div');
            section.className = 'experience-item';

            // Experience title and dates
            const h3 = document.createElement('h3');
            h3.classList.add('primary-text');
            h3.textContent = `${exp.startDate} - ${exp.endDate} : ${this.getTranslation(exp, 'title')}`;
            section.appendChild(h3);

            // Employer info
            const employerContainer = document.createElement('div');
            employerContainer.style.display = 'flex';
            employerContainer.style.alignItems = 'center';
            employerContainer.style.marginBottom = '5px';

            // Add logo if it exists
            if (exp.logo) {
                const logo = document.createElement('img');
                logo.src = exp.logo;
                logo.alt = `${exp.employer} logo`;
                logo.style.width = '50px';
                logo.style.height = '50px';
                logo.style.marginRight = '15px';
                logo.style.objectFit = 'contain';
                employerContainer.appendChild(logo);
            }

            // Employer and location
            const p = document.createElement('p');
            p.classList.add('tertiary-text');
            p.style.margin = '0';
            p.innerHTML = `<i>${exp.employer}, ${exp.city} (${exp.country})</i>`;
            employerContainer.appendChild(p);

            section.appendChild(employerContainer);

            // Add skill badges
            if (exp.skills && exp.skills.length > 0) {
                const skillBadgesContainer = document.createElement('div');
                skillBadgesContainer.className = 'skill-badges';
                skillBadgesContainer.style.marginBottom = '10px';
                skillBadgesContainer.style.display = 'flex';
                skillBadgesContainer.style.flexWrap = 'wrap';
                skillBadgesContainer.style.gap = '8px';

                exp.skills.forEach(skill => {
                    const badge = document.createElement('span');
                    badge.className = 'skill-badge';
                    const skillName = skill.name[this.currentLanguage] || skill.name['en'];
                    badge.innerHTML = `<i class="${skill.icon}"></i> ${skillName}`;
                    skillBadgesContainer.appendChild(badge);
                });

                section.appendChild(skillBadgesContainer);
            }

            // Experience details
            const ul = document.createElement('ul');
            this.getTranslation(exp, 'details').forEach(detail => {
                const li = document.createElement('li');
                li.classList.add('secondary-text');
                li.innerHTML = detail;
                ul.appendChild(li);
            });
            section.appendChild(ul);

            container.appendChild(section);
        });
    }

    /**
     * Render technical interests
     */
    renderTechnicalInterests(data) {
        const container = document.getElementById('technicalInterests');
        if (!container || !data.technicalInterests) return;

        container.innerHTML = '';

        data.technicalInterests.forEach(interest => {
            const li = document.createElement('li');
            li.classList.add('secondary-text');
            li.textContent = this.getTranslation(interest, 'name');
            container.appendChild(li);
        });
    }

    /**
     * Render continuous learning
     */
    renderContinuousLearning(data) {
        const container = document.getElementById('continuousLearning');
        if (!container || !data.continuousLearning) return;

        container.innerHTML = '';

        data.continuousLearning.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('secondary-text');
            li.textContent = this.getTranslation(item, 'name');
            container.appendChild(li);
        });
    }
}

// Export the renderer
window.CVRenderer = CVRenderer;