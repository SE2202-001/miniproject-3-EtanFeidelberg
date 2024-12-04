let jobs = [];
show(false);

document.getElementById('file-upload').addEventListener('change', function(event) {
    show(false);
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            try {
                let jobData = JSON.parse(e.target.result);
                initializeJobs(jobData);
            } catch (error) {
                alert('Invalid JSON format');
            }
        };
        reader.readAsText(file);
    }
});

function show(show){
    let x = document.getElementById("main-content");
    if (show === false) {
        x.style.display = "none";
    } else if(show === true){
        x.style.display = "block";
    }
}

function initializeJobs(data) {
    jobs = data.map(job => new Job(job.Title, job.Posted, job.Type, job.Level, job.Skill, job.Detail));
    displayJobs(jobs);
    displayFilters(jobs);
    show(true);
}

class Job {
    constructor(title, postedTime, type, level, skill, detail) {
        this.title = title || 'Unknown';
        this.postedTime = postedTime || 'Unknown';
        this.type = type || 'Unknown';
        this.level = level || 'Unknown';
        this.skill = skill || 'Unknown';
        this.detail = detail || 'Unknown';
    }

    getFormattedTime() {
        let time = this.postedTime.split(' ');
        let num = parseInt(time[0]);
        let unit = time[1];
        if (unit === 'minutes') {
            return num;
        } else if (unit === 'hours') {
            return num * 60;
        } else if (unit === 'days') {
            return num * 60 * 24;
        } else if (unit === 'weeks') {
            return num * 60 * 24 * 7;
        } else if (unit === 'months') {
            return num * 60 * 24 * 30;
        } else if (unit === 'years') {
            return num * 60 * 24 * 365;
        }
        
    }
}

function displayFilters(jobList) {
    const typeContainer = document.getElementById('type-filter');
    const levelContainer = document.getElementById('level-filter');
    const skillContainer = document.getElementById('skill-filter');
    typeContainer.innerHTML = '';
    levelContainer.innerHTML = '';
    skillContainer.innerHTML = '';
    const typeOption = document.createElement('option');
    typeOption.classList.add('type-option');
    typeOption.innerHTML = '<p>All</p>';
    typeContainer.appendChild(typeOption);
    const levelOption = document.createElement('option');
    levelOption.classList.add('level-option');
        levelOption.innerHTML = '<p>All</p>';
    levelContainer.appendChild(levelOption);
    const skillOption = document.createElement('option');
    skillOption.classList.add('skill-option');
    skillOption.innerHTML = '<p>All</p>';
    skillContainer.appendChild(skillOption);
    const uniqueTypes = [...new Set(jobList.map(job => job.type))];
    const uniqueLevels = [...new Set(jobList.map(job => job.level))];
    const uniqueSkills = [...new Set(jobList.map(job => job.skill))];
    uniqueTypes.forEach(type => {
        const typeOption = document.createElement('option');
        typeOption.classList.add('type-option');
        typeOption.innerHTML = '<p>' + type + '</p>';
        typeContainer.appendChild(typeOption);
    });
    uniqueLevels.forEach(level => {
        const levelOption = document.createElement('option');
        levelOption.classList.add('level-option');
        levelOption.innerHTML = '<p>' + level + '</p>';
        levelContainer.appendChild(levelOption);
    });
    uniqueSkills.forEach(skill => {
        const skillOption = document.createElement('option');
        skillOption.classList.add('skill-option');
        skillOption.innerHTML = '<p>' + skill + '</p>';
        skillContainer.appendChild(skillOption);
    });
}

function displayJobs(jobList) {

    let display = document.getElementById('jobs-display');
    display.innerHTML = '';
    jobList.forEach(job => {
        let jobDiv = document.createElement('div');
        let lineDiv = document.createElement('hr');
        jobDiv.classList.add('job');
        jobDiv.innerHTML = `
            <p>${job.title}</p>
        `;
        jobDiv.addEventListener('click', () => {
            alert(`
Job Title: ${job.title}
Type: ${job.type}
Posted: ${job.postedTime}
Level: ${job.level}
Skill: ${job.skill}
Description: ${job.detail}
            `);
        }); 
        display.appendChild(lineDiv);
        display.appendChild(jobDiv);
    });
}

document.getElementById('filter-jobs').addEventListener('click', function() {
    let type = document.getElementById('type-filter').value;
    let level = document.getElementById('level-filter').value;
    let skill = document.getElementById('skill-filter').value;
    let filteredJobs = jobs.filter(job => {
        return (type === 'All' || job.type === type) &&
            (level === 'All' || job.level === level) &&
            (skill === 'All' || job.skill === skill);
    });
    
    displayJobs(filteredJobs);
});

document.getElementById('sort-jobs').addEventListener('click', function() {
    let sortType = document.getElementById('sort-filter').value;
    let sortedJobs = jobs.slice();
    if (sortType === 'tf') {
        sortedJobs.sort((a, b) => a.getFormattedTime() - b.getFormattedTime());
    } else if (sortType === 'tl') {
        sortedJobs.sort((a, b) => a.getFormattedTime() - b.getFormattedTime()).reverse();
    }else if (sortType === 'az') {
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    }else if (sortType === 'za') {
        sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
    }
    displayJobs(sortedJobs);
});
