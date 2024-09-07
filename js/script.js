document.addEventListener('DOMContentLoaded', function () {
    let currentLanguage = 'en';

    let lastScrollTop = 0;
    const languageSelectorContainer = document.querySelector('.language-selector-container');

    window.addEventListener('scroll', function () {
        // Check how far from the top the user has scrolled
        if (window.scrollY === 0) {
            // User is at the top of the page, show the language selector
            languageSelectorContainer.classList.remove('language-hidden');
        } else {
            // User has scrolled down, hide the language selector
            languageSelectorContainer.classList.add('language-hidden');
        }
    });

    function getTranslation(data, field) {
        return data && data[field] && (data[field][currentLanguage] || data[field]['en']) || '';
    }

    function loadLanguage(language) {
        currentLanguage = language;
        fetch('cv.json')
            .then(response => response.json())
            .then(data => {
                // Update contact information
                document.getElementById('name').textContent = getTranslation(data, 'name');
                document.getElementById('title').textContent = getTranslation(data, 'title');

                document.getElementById('email').textContent = data.contact.email || '';
                document.getElementById('phone').textContent = data.contact.phone || '';
                document.getElementById('location').textContent = getTranslation(data.contact, 'location');

                // LinkedIn and Website links
                const linkedin = document.getElementById('linkedin');
                const website = document.getElementById('website');
                linkedin.href = data.contact.linkedin || '#';
                linkedin.style.display = data.contact.linkedin ? 'block' : 'none';
                website.href = data.contact.website || '#';
                website.style.display = data.contact.website ? 'block' : 'none';

                // Profile picture
                const profilePic = document.getElementById('profile-pic');
                if (data.profilePic) {
                    profilePic.src = data.profilePic;
                    profilePic.alt = getTranslation(data, 'name');
                } else {
                    profilePic.style.display = 'none';
                }

                // Update section titles
                document.getElementById('languages-title').textContent = getTranslation(data.sections, 'languages');
                document.getElementById('education-title').textContent = getTranslation(data.sections, 'education');
                document.getElementById('hobbies-title').textContent = getTranslation(data.sections, 'hobbies');
                document.getElementById('certifications-title').textContent = getTranslation(data.sections, 'certifications');
                document.getElementById('professional-interests-title').textContent = getTranslation(data.sections, 'professionalInterests');

                // Load skills
                const skillsContainer = document.getElementById('skills');
                skillsContainer.innerHTML = '';
                data.skills.forEach(skillCategory => {
                    const section = document.createElement('div');
                    section.className = 'skills-section';

                    // Category heading
                    const h4 = document.createElement('h4');
                    h4.classList.add('primary-text');
                    h4.textContent = getTranslation(skillCategory, 'category');
                    section.appendChild(h4);

                    // Skill list
                    const ul = document.createElement('ul');
                    skillCategory.items.forEach(skill => {
                        const li = document.createElement('li');
                        li.innerHTML = `${getTranslation(skill, 'name')}
                            <div class="progress-bar progress-bar-bg">
                                <div class="progress-bar-inner progress-bar-fill" style="width: ${skill.level}%;"></div>
                            </div>`;
                        ul.appendChild(li);
                    });
                    section.appendChild(ul);
                    skillsContainer.appendChild(section);
                });

                // Load experience
                const experienceContainer = document.getElementById('experience');
                experienceContainer.innerHTML = `
                    <h2 class="section-title primary-text"><i class="fas fa-user"></i> ${getTranslation(data.sections, 'summary')}</h2>
                    <p class="secondary-text">${getTranslation(data, 'profile')}</p>
                    <h2 class="section-title primary-text"><i class="fas fa-briefcase"></i> ${getTranslation(data.sections, 'experience')}</h2>
                `;
                data.experience.forEach(exp => {
                    const section = document.createElement('div');
                    section.className = 'experience-item';

                    // Experience title and dates
                    const h3 = document.createElement('h3');
                    h3.classList.add('primary-text');
                    h3.textContent = `${exp.startDate} - ${exp.endDate} : ${getTranslation(exp, 'title')}`;
                    section.appendChild(h3);

                    // Employer and location
                    const p = document.createElement('p');
                    p.classList.add('tertiary-text');
                    p.innerHTML = `<i>${exp.employer}, ${exp.city} (${exp.country})</i>`;
                    section.appendChild(p);

                    // Experience details
                    const ul = document.createElement('ul');
                    getTranslation(exp, 'details').forEach(detail => {
                        const li = document.createElement('li');
                        li.classList.add('secondary-text');
                        li.textContent = detail;
                        ul.appendChild(li);
                    });
                    section.appendChild(ul);
                    experienceContainer.appendChild(section);
                });

                // Load education
                const educationContainer = document.getElementById('education');
                educationContainer.innerHTML = '';
                data.education.forEach(edu => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong class="primary-text">${edu.year} : ${getTranslation(edu, 'degree')}</strong>
                        <i class="tertiary-text">${edu.city} (${edu.country})</i>
                        <p class="secondary-text">${getTranslation(edu, 'details')}</p>`;
                    educationContainer.appendChild(li);
                });

                // Load languages
                const languagesContainer = document.getElementById('languages');
                languagesContainer.innerHTML = '';
                data.languages.forEach(language => {
                    const li = document.createElement('li');
                    li.innerHTML = `${getTranslation(language, 'name')}
                        <div class="progress-bar progress-bar-bg">
                            <div class="progress-bar-inner progress-bar-fill" style="width: ${language.level}%;"></div>
                        </div>`;
                    languagesContainer.appendChild(li);
                });

                // Load hobbies
                const hobbiesContainer = document.getElementById('hobbies');
                hobbiesContainer.innerHTML = '';
                data.hobbies.forEach(hobby => {
                    const li = document.createElement('li');
                    li.classList.add('secondary-text');
                    li.innerHTML = `<i class="${hobby.icon}"></i> ${getTranslation(hobby, 'name')}`;
                    hobbiesContainer.appendChild(li);
                });

                // Load certifications
                const certificationsContainer = document.getElementById('certifications');
                certificationsContainer.innerHTML = '';
                if (data.certifications && data.certifications.length > 0) {
                    document.getElementById('certifications-title').style.display = 'block';
                    data.certifications.forEach(cert => {
                        const li = document.createElement('li');
                        li.classList.add('secondary-text');
                        li.innerHTML = `<strong class="primary-text">${cert.year}:</strong> ${getTranslation(cert, 'title')}`;
                        certificationsContainer.appendChild(li);
                    });
                } else {
                    document.getElementById('certifications-title').style.display = 'none';
                }

                // Load professional interests
                const professionalInterestsContainer = document.getElementById('professional-interests');
                professionalInterestsContainer.innerHTML = '';
                if (data.professionalInterests && data.professionalInterests.length > 0) {
                    document.getElementById('professional-interests-title').style.display = 'block';
                    data.professionalInterests.forEach(interest => {
                        const li = document.createElement('li');
                        li.classList.add('secondary-text');
                        li.textContent = getTranslation(interest, 'name');
                        professionalInterestsContainer.appendChild(li);
                    });
                } else {
                    document.getElementById('professional-interests-title').style.display = 'none';
                }

                // Manage active state of language buttons
                document.getElementById('btn-fr').classList.remove('active');
                document.getElementById('btn-en').classList.remove('active');
                if (language === 'fr') {
                    document.getElementById('btn-fr').classList.add('button-active');
                } else {
                    document.getElementById('btn-en').classList.add('button-active');
                }
            })
            .catch(error => console.error('Erreur lors du chargement du CV:', error));
    }

    // Load default language
    loadLanguage(currentLanguage);

    // Function to change the language
    window.changeLanguage = function (language) {
        loadLanguage(language);
    };
});
