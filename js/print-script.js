document.addEventListener('DOMContentLoaded', function () {
    let currentLanguage = 'en';

    if (window.location.hash) {
        currentLanguage = window.location.hash.substring(1);
    }
    // Fonction pour récupérer les traductions en fonction de la langue
    function getTranslation(data, field) {
        return data && data[field] && (data[field][currentLanguage] || data[field]['en']) || '';
    }

    // Fonction pour charger le CV et les traductions
    function loadCV(language) {
        currentLanguage = language;
        fetch('cv.json')
            .then(response => response.json())
            .then(data => {
                // Mise à jour des informations de contact
                document.getElementById('name').textContent = getTranslation(data, 'name');
                document.getElementById('title').textContent = getTranslation(data, 'title');

                document.getElementById('email').textContent = data.contact.email || '';
                document.getElementById('phone').textContent = data.contact.phone || '';
                document.getElementById('location').textContent = getTranslation(data.contact, 'location');

                // Chargement du résumé (profil)
                const profileElement = document.getElementById('profile');
                if (profileElement) {
                    profileElement.textContent = getTranslation(data, 'profile');
                }

                // Mettre à jour les titres des sections dynamiquement
                document.getElementById('languages-title').textContent = getTranslation(data.sections, 'languages');
                document.getElementById('education-title').textContent = getTranslation(data.sections, 'education');
                document.getElementById('hobbies-title').textContent = getTranslation(data.sections, 'hobbies');
                document.getElementById('certifications-title').textContent = getTranslation(data.sections, 'certifications');
                document.getElementById('professional-interests-title').textContent = getTranslation(data.sections, 'professionalInterests');
                document.getElementById('summary-title').textContent = getTranslation(data.sections, 'summary');
                document.getElementById('experience-title').textContent = getTranslation(data.sections, 'experience');

                // Charger les compétences
                const skillsContainer = document.getElementById('skills');
                skillsContainer.innerHTML = ''; // Réinitialiser avant de charger les compétences
                data.skills.forEach(skillCategory => {
                    const section = document.createElement('div');
                    section.className = 'skills-section';

                    // Titre de la catégorie de compétences
                    const h4 = document.createElement('h4');
                    h4.textContent = getTranslation(skillCategory, 'category');
                    section.appendChild(h4);

                    // Liste des compétences
                    const ul = document.createElement('ul');
                    skillCategory.items.forEach(skill => {
                        const li = document.createElement('li');
                        li.innerHTML = `${getTranslation(skill, 'name')}
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${skill.level}%;"></div>
                            </div>`;
                        ul.appendChild(li);
                    });
                    section.appendChild(ul);
                    skillsContainer.appendChild(section);
                });

                // Charger les langues
                const languagesContainer = document.getElementById('languages');
                languagesContainer.innerHTML = '';
                data.languages.forEach(language => {
                    const li = document.createElement('li');
                    li.innerHTML = `${getTranslation(language, 'name')}
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${language.level}%;"></div>
                        </div>`;
                    languagesContainer.appendChild(li);
                });

                // Charger les expériences
                const experienceContainer = document.getElementById('experience');
                experienceContainer.innerHTML = ''; // Réinitialiser avant de charger les expériences
                data.experience.forEach(exp => {
                    const section = document.createElement('div');
                    section.className = 'experience-item';

                    // Titre de l'expérience
                    const h3 = document.createElement('h3');
                    h3.textContent = `${exp.startDate} - ${exp.endDate} : ${getTranslation(exp, 'title')}`;
                    section.appendChild(h3);

                    // Détails de l'employeur
                    const p = document.createElement('p');
                    p.innerHTML = `<i>${exp.employer}, ${exp.city} (${exp.country})</i>`;
                    section.appendChild(p);

                    // Détails des tâches
                    const ul = document.createElement('ul');
                    getTranslation(exp, 'details').forEach(detail => {
                        const li = document.createElement('li');
                        li.textContent = detail;
                        ul.appendChild(li);
                    });
                    section.appendChild(ul);
                    experienceContainer.appendChild(section);
                });

                // Charger l'éducation
                const educationContainer = document.getElementById('education');
                educationContainer.innerHTML = '';
                data.education.forEach(edu => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${edu.year} : ${getTranslation(edu, 'degree')}</strong>
                        <i>${edu.city} (${edu.country})</i>
                        <p>${getTranslation(edu, 'details')}</p>`;
                    educationContainer.appendChild(li);
                });

                // Charger les hobbies
                const hobbiesContainer = document.getElementById('hobbies');
                hobbiesContainer.innerHTML = '';
                data.hobbies.forEach(hobby => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="${hobby.icon}"></i> ${getTranslation(hobby, 'name')}`;
                    hobbiesContainer.appendChild(li);
                });

                // Charger les certifications
                const certificationsContainer = document.getElementById('certifications');
                certificationsContainer.innerHTML = '';
                data.certifications.forEach(cert => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${cert.year} :</strong> ${getTranslation(cert, 'title')}`;
                    certificationsContainer.appendChild(li);
                });

                // Charger les intérêts professionnels
                const professionalInterestsContainer = document.getElementById('professional-interests');
                professionalInterestsContainer.innerHTML = '';
                data.professionalInterests.forEach(interest => {
                    const li = document.createElement('li');
                    li.textContent = getTranslation(interest, 'name');
                    professionalInterestsContainer.appendChild(li);
                });

                // Mettre à jour l'état des boutons de langue
                updateLanguageButtons();
            })
            .catch(error => console.error('Erreur lors du chargement du CV:', error));
    }

    // Fonction pour mettre à jour les boutons de langue
    function updateLanguageButtons() {
        document.getElementById('btn-fr').classList.remove('button-active');
        document.getElementById('btn-en').classList.remove('button-active');
        if (currentLanguage === 'fr') {
            document.getElementById('btn-fr').classList.add('button-active');
        } else {
            document.getElementById('btn-en').classList.add('button-active');
        }
    }

    // Gestion du changement de langue
    window.changeLanguage = function (language) {
        loadCV(language);
    };

    // Charger la version par défaut en français
    loadCV(currentLanguage);
});
