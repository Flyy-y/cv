/**
 * Shared functionality for CV display and printing
 */

// CV data loading and rendering functions
class CVRenderer {
  constructor() {
    this.currentLanguage = 'en';
    this.data = null;
  }

  /**
   * Initialize the renderer with the current language
   */
  init() {
    // Get language from URL hash if available
    if (window.location.hash) {
      this.currentLanguage = window.location.hash.substring(1);
    } else {
      // Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      // If browser language starts with 'fr', use French, otherwise use English
      this.currentLanguage = browserLang.startsWith('fr') ? 'fr' : 'en';
    }
    
    return this;
  }

  /**
   * Get translation based on the current language
   * @param {Object} data - The data object containing translations
   * @param {String} field - The field to get translation for
   * @returns {String} - The translated text
   */
  getTranslation(data, field) {
    // Use optional chaining and nullish coalescing for cleaner code
    const text = data?.[field]?.[this.currentLanguage] ?? data?.[field]?.['en'] ?? '';
    
    // Check if text is a string before applying replace
    return typeof text === 'string' ? text.replace(/\n/g, '<br>') : text;
  }

  /**
   * Load CV data from JSON file
   * @param {String} language - The language to load
   * @returns {Promise} - Promise that resolves when data is loaded
   */
  async loadCV(language) {
    this.currentLanguage = language;
    
    try {
      const response = await fetch('cv.json');
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading CV data:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle errors in a user-friendly way
   * @param {Error} error - The error that occurred
   */
  handleError(error) {
    document.body.innerHTML = `
      <div style="text-align: center; margin-top: 50px;">
        <h2>Error loading CV data</h2>
        <p>Please try again later or contact the administrator.</p>
        <p>Details: ${error.message}</p>
      </div>
    `;
  }

  /**
   * Render contact information
   * @param {Object} data - The CV data
   */
  renderContactInfo(data) {
    document.getElementById('name').textContent = this.getTranslation(data, 'name');
    document.getElementById('title').textContent = this.getTranslation(data, 'title');
    
    // Safely decode email and phone from base64 if they exist
    try {
      const emailEl = document.getElementById('email');
      const phoneEl = document.getElementById('phone');
      
      // Check if we're on the main page (with spans) or print page (without spans)
      if (emailEl.tagName === 'SPAN' || phoneEl.tagName === 'SPAN') {
        emailEl.textContent = data.contact.email ? atob(data.contact.email) : '';
        phoneEl.textContent = data.contact.phone ? atob(data.contact.phone) : '';
      } else {
        emailEl.textContent = data.contact.email ? atob(data.contact.email) : '';
        phoneEl.textContent = data.contact.phone ? atob(data.contact.phone) : '';
      }
    } catch (e) {
      console.error('Error decoding contact information:', e);
      // Use raw data if decoding fails
      document.getElementById('email').textContent = data.contact.email || '';
      document.getElementById('phone').textContent = data.contact.phone || '';
    }
    
    document.getElementById('location').textContent = this.getTranslation(data.contact, 'location');
    
    // LinkedIn and Website links (only on main page)
    const linkedin = document.getElementById('linkedin');
    const website = document.getElementById('website');
    
    if (linkedin && website) {
      linkedin.href = data.contact.linkedin || '#';
      linkedin.style.display = data.contact.linkedin ? 'block' : 'none';
      website.href = data.contact.website || '#';
      website.style.display = data.contact.website ? 'block' : 'none';
    }
  }

  /**
   * Render section titles
   * @param {Object} data - The CV data
   */
  renderSectionTitles(data) {
    const sectionIds = [
      'skills-title',
      'languages-title',
      'education-title',
      'hobbies-title',
      'certifications-title',
      'professional-interests-title',
      'summary-title',
      'experience-title'
    ];
    
    const sectionMappings = {
      'skills-title': 'skills',
      'languages-title': 'languages',
      'education-title': 'education',
      'hobbies-title': 'hobbies',
      'certifications-title': 'certifications',
      'professional-interests-title': 'professionalInterests',
      'summary-title': 'summary',
      'experience-title': 'experience'
    };
    
    // Update all section titles that exist in the DOM
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element && data.sections[sectionMappings[id]]) {
        element.textContent = this.getTranslation(data.sections, sectionMappings[id]);
      }
    });
  }

  /**
   * Render skills section
   * @param {Object} data - The CV data
   */
  renderSkills(data) {
    const skillsContainer = document.getElementById('skills');
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = '';
    
    data.skills.forEach(skillCategory => {
      const section = document.createElement('div');
      section.className = 'skills-section';
      
      // Category heading
      const h4 = document.createElement('h4');
      if (document.querySelector('.primary-text')) {
        h4.classList.add('primary-text');
      }
      h4.textContent = this.getTranslation(skillCategory, 'category');
      section.appendChild(h4);
      
      // Skill list
      const ul = document.createElement('ul');
      skillCategory.items.forEach(skill => {
        const li = document.createElement('li');
        
        // Determine if we're on the main page or print page
        const isMainPage = document.querySelector('.middle-column');
        
        // Use appropriate classes based on the page type
        let progressBarClass, progressFillClass;
        if (isMainPage) {
          progressBarClass = 'progress-bar progress-bar-bg';
          progressFillClass = 'progress-bar-inner progress-bar-fill';
        } else {
          progressBarClass = 'progress-bar';
          progressFillClass = 'progress-bar-fill';
        }
        
        li.innerHTML = `${this.getTranslation(skill, 'name')}
          <div class="${progressBarClass}">
            <div class="${progressFillClass}" style="width: ${skill.level}%;"></div>
          </div>`;
        ul.appendChild(li);
      });
      
      section.appendChild(ul);
      skillsContainer.appendChild(section);
    });
  }

  /**
   * Render languages section
   * @param {Object} data - The CV data
   */
  renderLanguages(data) {
    const languagesContainer = document.getElementById('languages');
    if (!languagesContainer) return;
    
    languagesContainer.innerHTML = '';
    
    data.languages.forEach(language => {
      const li = document.createElement('li');
      
      // Determine if we're on the main page or print page
      const isMainPage = document.querySelector('.middle-column');
      
      // Use appropriate classes based on the page type
      let progressBarClass, progressFillClass;
      if (isMainPage) {
        progressBarClass = 'progress-bar progress-bar-bg';
        progressFillClass = 'progress-bar-inner progress-bar-fill';
      } else {
        progressBarClass = 'progress-bar';
        progressFillClass = 'progress-bar-fill';
      }
      
      li.innerHTML = `${this.getTranslation(language, 'name')}
        <div class="${progressBarClass}">
          <div class="${progressFillClass}" style="width: ${language.level}%;"></div>
        </div>`;
      languagesContainer.appendChild(li);
    });
  }

  /**
   * Render education section
   * @param {Object} data - The CV data
   */
  renderEducation(data) {
    const educationContainer = document.getElementById('education');
    if (!educationContainer) return;
    
    educationContainer.innerHTML = '';
    
    data.education.forEach(edu => {
      const li = document.createElement('li');
      const hasClasses = document.querySelector('.primary-text');
      
      li.innerHTML = `
        <strong ${hasClasses ? 'class="primary-text"' : ''}>${edu.year} : ${this.getTranslation(edu, 'degree')}</strong>
        <i ${hasClasses ? 'class="tertiary-text"' : ''}>${edu.city} (${edu.country})</i>
        <p ${hasClasses ? 'class="secondary-text"' : ''}>${this.getTranslation(edu, 'details')}</p>`;
      educationContainer.appendChild(li);
    });
  }

  /**
   * Render certifications section
   * @param {Object} data - The CV data
   */
  renderCertifications(data) {
    const certificationsContainer = document.getElementById('certifications');
    const certificationsTitle = document.getElementById('certifications-title');
    if (!certificationsContainer || !certificationsTitle) return;
    
    certificationsContainer.innerHTML = '';
    
    if (data.certifications && data.certifications.length > 0) {
      certificationsTitle.style.display = 'block';
      
      data.certifications.forEach(cert => {
        const li = document.createElement('li');
        const hasClasses = document.querySelector('.primary-text');
        
        if (hasClasses) li.classList.add('secondary-text');
        
        li.innerHTML = `<strong ${hasClasses ? 'class="primary-text"' : ''}>${cert.year}:</strong> ${this.getTranslation(cert, 'title')}`;
        certificationsContainer.appendChild(li);
      });
    } else {
      certificationsTitle.style.display = 'none';
    }
  }

  /**
   * Render professional interests section
   * @param {Object} data - The CV data
   */
  renderProfessionalInterests(data) {
    const interestsContainer = document.getElementById('professional-interests');
    const interestsTitle = document.getElementById('professional-interests-title');
    if (!interestsContainer || !interestsTitle) return;
    
    interestsContainer.innerHTML = '';
    
    if (data.professionalInterests && data.professionalInterests.length > 0) {
      interestsTitle.style.display = 'block';
      
      data.professionalInterests.forEach(interest => {
        const li = document.createElement('li');
        if (document.querySelector('.secondary-text')) {
          li.classList.add('secondary-text');
        }
        li.textContent = this.getTranslation(interest, 'name');
        interestsContainer.appendChild(li);
      });
    } else {
      interestsTitle.style.display = 'none';
    }
  }

  /**
   * Render hobbies section
   * @param {Object} data - The CV data
   */
  renderHobbies(data) {
    const hobbiesContainer = document.getElementById('hobbies');
    if (!hobbiesContainer) return;
    
    hobbiesContainer.innerHTML = '';
    
    data.hobbies.forEach(hobby => {
      const li = document.createElement('li');
      if (document.querySelector('.secondary-text')) {
        li.classList.add('secondary-text');
      }
      li.innerHTML = `<i class="${hobby.icon}"></i> ${this.getTranslation(hobby, 'name')}`;
      hobbiesContainer.appendChild(li);
    });
  }

  /**
   * Render experience section
   * @param {Object} data - The CV data
   */
  renderExperience(data) {
    const experienceContainer = document.getElementById('experience');
    if (!experienceContainer) return;
    
    // Check if we're on the main page or print page
    const isMainPage = document.querySelector('.middle-column');
    
    if (isMainPage) {
      // Main page has a different structure with summary included
      experienceContainer.innerHTML = `
        <h2 class="section-title primary-text"><i class="fas fa-user"></i> ${this.getTranslation(data.sections, 'summary')}</h2>
        <p class="secondary-text">${this.getTranslation(data, 'profile')}</p>
        <h2 class="section-title primary-text"><i class="fas fa-briefcase"></i> ${this.getTranslation(data.sections, 'experience')}</h2>
      `;
    } else {
      // Print page just clears the container
      experienceContainer.innerHTML = '';
      
      // Render profile separately on print page
      const profileElement = document.getElementById('profile');
      if (profileElement) {
        profileElement.innerHTML = this.getTranslation(data, 'profile');
      }
    }
    
    // Render experiences
    data.experience.forEach(exp => {
      const section = document.createElement('div');
      section.className = 'experience-item';
      
      // Experience title and dates
      const h3 = document.createElement('h3');
      if (document.querySelector('.primary-text')) {
        h3.classList.add('primary-text');
      }
      h3.textContent = `${exp.startDate} - ${exp.endDate} : ${this.getTranslation(exp, 'title')}`;
      section.appendChild(h3);
      
      // Create a container for employer info and logo
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
      if (document.querySelector('.tertiary-text')) {
        p.classList.add('tertiary-text');
      }
      p.style.margin = '0';
      p.innerHTML = `<i>${exp.employer}, ${exp.city} (${exp.country})</i>`;
      employerContainer.appendChild(p);
      
      section.appendChild(employerContainer);
      
      // Add skill badges on a new line
      if (exp.skills && exp.skills.length > 0) {
        const skillBadgesContainer = document.createElement('div');
        skillBadgesContainer.className = 'skill-badges';
        
        // Determine if we're on the main page or print page
        const isMainPage = document.querySelector('.middle-column');
        
        // Only apply inline styles on the main page, use CSS classes for print page
        if (isMainPage) {
          skillBadgesContainer.style.marginBottom = '10px';
          skillBadgesContainer.style.display = 'flex';
          skillBadgesContainer.style.flexWrap = 'wrap';
          skillBadgesContainer.style.gap = '8px';
        }
        
        exp.skills.forEach(skill => {
          const badge = document.createElement('span');
          badge.className = 'skill-badge';
          
          // Get the skill name in the current language
          const skillName = skill.name[this.currentLanguage] || skill.name['en'];
          badge.innerHTML = `<i class="${skill.icon}"></i> ${skillName}`;
          
          // Set the title in the current language
          if (this.currentLanguage === 'fr') {
            badge.title = `Compétences en ${skillName} utilisées dans ce rôle`;
          } else {
            badge.title = `${skillName} skills used in this role`;
          }
          
          skillBadgesContainer.appendChild(badge);
        });
        
        section.appendChild(skillBadgesContainer);
      }
      
      // Experience details
      const ul = document.createElement('ul');
      this.getTranslation(exp, 'details').forEach(detail => {
        const li = document.createElement('li');
        if (document.querySelector('.secondary-text')) {
          li.classList.add('secondary-text');
        }
        li.textContent = detail;
        ul.appendChild(li);
      });
      
      section.appendChild(ul);
      
      // Add progress bar if level is defined
      if (exp.level !== undefined) {
        const progressBarContainer = document.createElement('div');
        const progressBarClass = document.querySelector('.progress-bar-bg') ?
          'progress-bar progress-bar-bg' : 'progress-bar';
        const progressFillClass = document.querySelector('.progress-bar-inner') ?
          'progress-bar-inner progress-bar-fill' : 'progress-bar-fill';
          
        progressBarContainer.innerHTML = `
          <div class="${progressBarClass}">
            <div class="${progressFillClass}" style="width: ${exp.level}%;"></div>
          </div>`;
        section.appendChild(progressBarContainer);
      }
      
      experienceContainer.appendChild(section);
    });
  }

  /**
   * Render the entire CV
   * @param {String} language - The language to render
   */
  async render(language) {
    try {
      const data = await this.loadCV(language);
      
      this.renderContactInfo(data);
      this.renderSectionTitles(data);
      this.renderSkills(data);
      this.renderLanguages(data);
      this.renderEducation(data);
      this.renderCertifications(data);
      this.renderProfessionalInterests(data);
      this.renderHobbies(data);
      this.renderExperience(data);
      
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
   * Update language button states
   */
  updateLanguageButtons() {
    document.getElementById('btn-fr').classList.remove('button-active', 'active');
    document.getElementById('btn-en').classList.remove('button-active', 'active');
    
    if (this.currentLanguage === 'fr') {
      document.getElementById('btn-fr').classList.add('button-active');
    } else {
      document.getElementById('btn-en').classList.add('button-active');
    }
  }
}

// Export the renderer for use in other scripts
window.CVRenderer = CVRenderer;