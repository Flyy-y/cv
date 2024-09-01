document.addEventListener('DOMContentLoaded', function() {
    let currentLanguage = 'fr';

    function getTranslation(data, field) {
        return data && data[field] && (data[field][currentLanguage] || data[field]['en']) || '';
    }

    function loadLanguage(language) {
        currentLanguage = language;
        fetch('cv.json')
            .then(response => response.json())
            .then(data => {
                // Mettre à jour les informations de contact
                document.getElementById('name').textContent = getTranslation(data, 'name');
                document.getElementById('title').textContent = getTranslation(data, 'title');
                
                document.getElementById('email').textContent = data.contact.email || '';
                document.getElementById('phone').textContent = data.contact.phone || '';
                document.getElementById('location').textContent = getTranslation(data.contact, 'location');
                
                if (data.contact.linkedin) {
                    document.getElementById('linkedin').href = data.contact.linkedin;
                    document.getElementById('linkedin').style.display = 'block';
                } else {
                    document.getElementById('linkedin').style.display = 'none';
                }

                if (data.contact.website) {
                    document.getElementById('website').href = data.contact.website;
                    document.getElementById('website').style.display = 'block';
                } else {
                    document.getElementById('website').style.display = 'none';
                }

                if (data.profilePic) {
                    document.getElementById('profile-pic').src = data.profilePic;
                    document.getElementById('profile-pic').alt = getTranslation(data, 'name');
                } else {
                    document.getElementById('profile-pic').style.display = 'none';
                }

                // Mettre à jour les titres des sections
                document.getElementById('languages-title').textContent = getTranslation(data.sections, 'languages');
                document.getElementById('education-title').textContent = getTranslation(data.sections, 'education');
                document.getElementById('hobbies-title').textContent = getTranslation(data.sections, 'hobbies');

                // Charger les compétences
                const skillsContainer = document.getElementById('skills');
                skillsContainer.innerHTML = '';
                data.skills.forEach(skillCategory => {
                    const section = document.createElement('div');
                    section.className = 'skills-section';
                    section.innerHTML = `<h4>${getTranslation(skillCategory, 'category')}</h4>`;
                    
                    const ul = document.createElement('ul');
                    skillCategory.items.forEach(skill => {
                        const li = document.createElement('li');
                        li.innerHTML = `${getTranslation(skill, 'name')}<div class="progress-bar"><div class="progress-bar-inner" style="width: ${skill.level}%;"></div></div>`;
                        ul.appendChild(li);
                    });
                    section.appendChild(ul);
                    skillsContainer.appendChild(section);
                });

                // Charger l'expérience professionnelle
                const experienceContainer = document.getElementById('experience');
                experienceContainer.innerHTML = `
                    <h2 class="section-title"><i class="fas fa-user"></i> ${getTranslation(data.sections, 'summary')}</h2>
                    <p>${getTranslation(data, 'profile')}</p>
                    <h2 class="section-title"><i class="fas fa-briefcase"></i> ${getTranslation(data.sections, 'experience')}</h2>
                `;
                data.experience.forEach(exp => {
                    const section = document.createElement('div');
                    section.className = 'experience-item';
                    section.innerHTML = `<h3>${exp.startDate} - ${exp.endDate} : ${getTranslation(exp, 'title')}</h3>
                                        <p><i>${exp.employer}, ${exp.city} (${exp.country})</i></p>`;
                    const ul = document.createElement('ul');
                    getTranslation(exp, 'details').forEach(detail => {
                        const li = document.createElement('li');
                        li.textContent = detail;
                        ul.appendChild(li);
                    });
                    section.appendChild(ul);
                    experienceContainer.appendChild(section);
                });

                // Charger la section Éducation
                const educationContainer = document.getElementById('education');
                educationContainer.innerHTML = '';
                data.education.forEach(edu => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${edu.year} : ${getTranslation(edu, 'degree')}</strong><i>${edu.city ? edu.city + ',' : ''} ${edu.country ? `(${edu.country})` : ''}</i><p>${getTranslation(edu, 'details')}</p>`;
                    educationContainer.appendChild(li);
                });

                // Charger les langues
                const languagesContainer = document.getElementById('languages');
                languagesContainer.innerHTML = '';
                data.languages.forEach(language => {
                    const li = document.createElement('li');
                    li.innerHTML = `${getTranslation(language, 'name')}<div class="progress-bar"><div class="progress-bar-inner" style="width: ${language.level}%;"></div></div>`;
                    languagesContainer.appendChild(li);
                });

                // Charger les hobbies
                const hobbiesContainer = document.getElementById('hobbies');
                hobbiesContainer.innerHTML = '';
                data.hobbies.forEach(hobby => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="${hobby.icon}"></i> ${getTranslation(hobby, 'name')}`;
                    hobbiesContainer.appendChild(li);
                });

                // Gérer l'état actif des boutons de langue
                document.getElementById('btn-fr').classList.remove('active');
                document.getElementById('btn-en').classList.remove('active');
                if (language === 'fr') {
                    document.getElementById('btn-fr').classList.add('active');
                } else {
                    document.getElementById('btn-en').classList.add('active');
                }
            })
            .catch(error => console.error('Erreur lors du chargement du CV:', error));
    }

    // Charger la langue par défaut
    loadLanguage(currentLanguage);

    // Fonction pour changer la langue
    window.changeLanguage = function(language) {
        loadLanguage(language);
    };
});
