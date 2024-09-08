namespace ResumeBuilder {
    interface Education {
        degree: string;
        institution: string;
        year: string;
    }

    interface Experience {
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }

    interface ResumeData {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        education: Education[];
        experience: Experience[];
        skills: string[];
    }

    // Get references to DOM elements
    const form = document.getElementById('resume-form') as HTMLFormElement;
    const resumeOutput = document.getElementById('resume-content') as HTMLDivElement;
    const addEducationButton = document.getElementById('add-education') as HTMLButtonElement;
    const addExperienceButton = document.getElementById('add-experience') as HTMLButtonElement;
    const addSkillButton = document.getElementById('add-skill') as HTMLButtonElement;
    const shareButton = document.getElementById('share-resume') as HTMLButtonElement;
    const downloadButton = document.getElementById('download-resume') as HTMLButtonElement;
    const educationSection = document.getElementById('education-section') as HTMLFieldSetElement;
    const experienceSection = document.getElementById('experience-section') as HTMLFieldSetElement;
    const skillsSection = document.getElementById('skills-section') as HTMLFieldSetElement;

    let educationCount = 0;
    let experienceCount = 0;
    let skillCount = 0;

    // Helper function to create input fields
    const createInputField = (type: string, name: string, placeholder: string): HTMLInputElement => {
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.placeholder = placeholder;
        input.required = true;
        return input;
    };

    // Add new education field
    const addEducation = (): void => {
        educationCount++;
        const educationDiv = document.createElement('div');
        educationDiv.innerHTML = `
            <h4>Education ${educationCount}</h4>
            <label for="degree-${educationCount}">Degree:</label>
            ${createInputField('text', `degree-${educationCount}`, 'Degree').outerHTML}
            <label for="institution-${educationCount}">Institution:</label>
            ${createInputField('text', `institution-${educationCount}`, 'Institution').outerHTML}
            <label for="year-${educationCount}">Year:</label>
            ${createInputField('text', `year-${educationCount}`, 'Year').outerHTML}
        `;
        educationSection.appendChild(educationDiv);
    };

    // Add new work experience field
    const addExperience = (): void => {
        experienceCount++;
        const experienceDiv = document.createElement('div');
        experienceDiv.innerHTML = `
            <h4>Experience ${experienceCount}</h4>
            <label for="title-${experienceCount}">Title:</label>
            ${createInputField('text', `title-${experienceCount}`, 'Title').outerHTML}
            <label for="company-${experienceCount}">Company:</label>
            ${createInputField('text', `company-${experienceCount}`, 'Company').outerHTML}
            <label for="startDate-${experienceCount}">Start Date:</label>
            ${createInputField('date', `startDate-${experienceCount}`, 'Start Date').outerHTML}
            <label for="endDate-${experienceCount}">End Date:</label>
            ${createInputField('date', `endDate-${experienceCount}`, 'End Date').outerHTML}
            <label for="description-${experienceCount}">Description:</label>
            ${createInputField('text', `description-${experienceCount}`, 'Description').outerHTML}
        `;
        experienceSection.appendChild(experienceDiv);
    };

    // Add new skill field
    const addSkill = (): void => {
        skillCount++;
        const skillDiv = document.createElement('div');
        skillDiv.innerHTML = `
            <label for="skill-${skillCount}">Skill ${skillCount}:</label>
            ${createInputField('text', `skill-${skillCount}`, 'Skill').outerHTML}
        `;
        skillsSection.appendChild(skillDiv);
    };

    // Gather dynamic data from form fields
    const gatherDynamicData = (sectionId: string, fields: string[]): any[] => {
        const section = document.getElementById(sectionId) as HTMLFieldSetElement;
        const items: any[] = [];
        const inputGroups = section.querySelectorAll('div');

        inputGroups.forEach((group) => {
            const item: any = {};
            fields.forEach((field) => {
                const input = group.querySelector(`input[name="${field}"]`) as HTMLInputElement;
                if (input) item[field] = input.value;
            });
            items.push(item);
        });

        return items;
    };

    // Generate resume based on form data
    const generateResume = (data: ResumeData): void => {
        resumeOutput.innerHTML = `
            <h3>${data.firstName} ${data.lastName}</h3>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone}</p>
            <h3>Education</h3>
            ${data.education.map(e => `<p>${e.degree}, ${e.institution}, ${e.year}</p>`).join('')}
            <h3>Experience</h3>
            ${data.experience.map(exp => `
                <p>${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}</p>
            `).join('')}
            <h3>Skills</h3>
            ${data.skills.map(skill => `<p>${skill}</p>`).join('')}
        `;
    };

    // Copy resume link to clipboard
    const copyLinkToClipboard = (): void => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert("Resume link copied to clipboard!");
        });
    };

    // Download resume as PDF
    const downloadResumeAsPDF = (): void => {
        const resumeContent = document.getElementById('resume-content') as HTMLElement;
        if ((window as any).html2pdf) {
            (window as any).html2pdf().from(resumeContent).save();
        } else {
            alert('PDF generation library is not loaded.');
        }
    };

    // Event listeners
    addEducationButton.addEventListener('click', addEducation);
    addExperienceButton.addEventListener('click', addExperience);
    addSkillButton.addEventListener('click', addSkill);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const resumeData: ResumeData = {
            firstName: (document.getElementById('firstName') as HTMLInputElement).value,
            lastName: (document.getElementById('lastName') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            education: gatherDynamicData('education-section', ['degree', 'institution', 'year']),
            experience: gatherDynamicData('experience-section', ['title', 'company', 'startDate', 'endDate', 'description']),
            skills: gatherDynamicData('skills-section', ['skill']).map((s: any) => s.skill)
        };
        generateResume(resumeData);
    });
    shareButton.addEventListener('click', copyLinkToClipboard);
    downloadButton.addEventListener('click', downloadResumeAsPDF);
}
