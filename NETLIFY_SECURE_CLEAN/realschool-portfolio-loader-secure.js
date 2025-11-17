// SECURE VERSION - Uses Netlify Functions (no exposed API token)

class RealSchoolPortfolioLoader {
    constructor(config) {
        this.studentName = config.studentName; // "Fiona", "Hope", or "Olivia"
        this.useNetlifyFunction = true; // Always use serverless function
    }

    // Fetch experiences via Netlify Function (secure!)
    async loadExperiences() {
        try {
            // Call Netlify function instead of Airtable directly
            const response = await fetch(`/.netlify/functions/get-experiences?student=${this.studentName.toLowerCase()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.records || [];

        } catch (error) {
            console.error('Error loading experiences:', error);
            this.showError();
            return [];
        }
    }

    // All other methods stay the same...
    renderToTimeline(records, timelineSelector = '.timeline') {
        const timeline = document.querySelector(timelineSelector);
        if (!timeline) return;

        if (records.length === 0) {
            timeline.innerHTML = '<div style="text-align: center; padding: 60px; color: #718096;"><h3>No experiences found</h3><p>Check your Airtable view filter.</p></div>';
            return;
        }

        timeline.innerHTML = records.map((record, index) => 
            this.createExperienceCard(record.fields, index)
        ).join('');

        this.initScrollAnimations();
    }

    createExperienceCard(fields, index) {
        const category = this.mapCategoryToClass(fields.Category_Primary);
        
        return `
            <div class="timeline-item" data-category="${category}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="experience-card-premium">
                        ${this.createImageSection(fields)}
                        ${this.createContentSection(fields)}
                        ${this.createGallerySection(fields)}
                    </div>
                </div>
            </div>
        `;
    }

    createImageSection(fields) {
        const imageUrl = this.getImageUrl(fields);
        const hours = fields.Total_Hours || 0;
        const category = fields.Category_Primary || 'Learning';
        
        return `
            <div class="exp-image-container">
                <img src="${imageUrl}" alt="${fields.Experience_Name}" loading="lazy">
                <div class="exp-category-badge">${this.getCategoryIcon(category)} ${category}</div>
                <div class="exp-hours-badge">⏱️ ${hours} hours</div>
                <div class="exp-overlay">
                    <h3 class="exp-title-overlay">${fields.Experience_Name}</h3>
                </div>
            </div>
        `;
    }

    createContentSection(fields) {
        return `
            <div class="exp-content">
                ${this.createMetaInfo(fields)}
                ${this.createDescription(fields)}
                ${this.createSkillsSection(fields)}
                ${this.createLearningSection(fields)}
                ${this.createAchievementsSection(fields)}
                ${this.createContactSection(fields)}
            </div>
        `;
    }

    createMetaInfo(fields) {
        const parts = [];
        
        if (fields.Term_Season || fields.Academic_Year) {
            const season = fields.Term_Season || '';
            const year = fields.Academic_Year || '';
            parts.push(`
                <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>${season} ${year}${this.formatDateRange(fields)}</span>
                </div>
            `);
        }
        
        if (fields.Organization_Name || fields.Location_Venue) {
            const location = fields.Organization_Name || fields.Location_Venue;
            const city = fields.City ? `, ${fields.City}` : '';
            parts.push(`
                <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    <span>${location}${city}</span>
                </div>
            `);
        }
        
        if (fields.Total_Hours) {
            parts.push(`
                <div class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    <span>${fields.Total_Hours} hours</span>
                </div>
            `);
        }
        
        if (fields.Grade || fields.Age) {
            const grade = fields.Grade ? `Grade ${fields.Grade}` : '';
            const age = fields.Age ? `Age ${fields.Age}` : '';
            const separator = grade && age ? ' • ' : '';
            parts.push(`
                <div class="meta-item">
                    <span class="meta-icon">🎓</span>
                    <span>${grade}${separator}${age}</span>
                </div>
            `);
        }
        
        return parts.length > 0 ? `
            <div class="exp-meta-info">
                ${parts.join('')}
            </div>
        ` : '';
    }

    formatDateRange(fields) {
        if (!fields.Start_Date) return '';
        
        const start = new Date(fields.Start_Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const end = fields.End_Date ? new Date(fields.End_Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        
        if (end) {
            return ` (${start} - ${end})`;
        }
        return ` (${start})`;
    }

    createDescription(fields) {
        if (!fields.Full_Description) return '';
        return `<p class="exp-description">${fields.Full_Description}</p>`;
    }

    createSkillsSection(fields) {
        if (!fields.Skills) return '';
        
        const skills = fields.Skills.split(',').map(s => s.trim()).filter(s => s);
        
        if (skills.length === 0) return '';
        
        return `
            <div class="exp-skills">
                <h4 class="exp-skills-title">Skills Developed</h4>
                <div class="skills-grid">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    createLearningSection(fields) {
        const parts = [];
        
        if (fields.What_Did_You_Learn) {
            parts.push(`
                <div class="exp-learning">
                    <h4 class="exp-learning-title">💡 What I Learned</h4>
                    <p class="exp-learning-text">${fields.What_Did_You_Learn}</p>
                </div>
            `);
        }
        
        if (fields.Surprise) {
            parts.push(`
                <div class="exp-learning">
                    <h4 class="exp-learning-title">✨ What Surprised Me</h4>
                    <p class="exp-learning-text">${fields.Surprise}</p>
                </div>
            `);
        }
        
        if (fields.Challenges) {
            parts.push(`
                <div class="exp-learning">
                    <h4 class="exp-learning-title">💪 Challenges I Faced</h4>
                    <p class="exp-learning-text">${fields.Challenges}</p>
                </div>
            `);
        }
        
        return parts.join('');
    }

    createAchievementsSection(fields) {
        if (!fields.Key_Achievements && !fields.Key_Take_Aways) return '';
        
        const content = fields.Key_Achievements || fields.Key_Take_Aways;
        
        return `
            <div class="exp-achievements">
                <h4 class="exp-achievements-title">
                    <span>🏆</span>
                    Key Achievements
                </h4>
                <p class="exp-achievements-text">${content}</p>
            </div>
        `;
    }

    createContactSection(fields) {
        if (!fields.Instructor_Names && !fields.Main_Contact) return '';
        
        const instructor = fields.Instructor_Names || fields.Main_Contact || '';
        const credentials = fields.Instructor_Credentials || fields.Their_Role_Title || '';
        
        if (!instructor) return '';
        
        return `
            <div class="exp-contact">
                <div class="contact-info">
                    <span class="contact-icon">👤</span>
                    <div>
                        <div class="contact-name">${instructor}</div>
                        ${credentials ? `<div class="contact-role">${credentials}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createGallerySection(fields) {
        const photos = this.extractPhotos(fields);
        
        if (photos.length === 0) return '';
        
        return `
            <div class="exp-gallery">
                <div class="gallery-grid">
                    ${photos.slice(0, 6).map(photo => `
                        <div class="gallery-item" onclick="window.open('${photo}', '_blank')">
                            <img src="${photo}" alt="Experience photo" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    extractPhotos(fields) {
        const photos = [];
        
        if (fields.Photos) {
            const matches = fields.Photos.match(/https:\/\/[^\s)]+/g);
            if (matches) {
                photos.push(...matches);
            }
        }
        
        if (fields.Key_Image) {
            const matches = fields.Key_Image.match(/https:\/\/[^\s)]+/g);
            if (matches) {
                photos.push(...matches);
            }
        }
        
        return photos;
    }

    getImageUrl(fields) {
        if (fields.Key_Image) {
            const match = fields.Key_Image.match(/https:\/\/[^\s)]+/);
            if (match) return match[0];
        }
        
        if (fields.Photos) {
            const match = fields.Photos.match(/https:\/\/[^\s)]+/);
            if (match) return match[0];
        }
        
        return this.getDefaultImage(fields.Category_Primary);
    }

    getDefaultImage(category) {
        const defaults = {
            'Performing Arts': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
            'Theatre': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
            'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
            'Environmental Science': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
            'Travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
            'Visual Arts': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
            'Animal Care': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80',
            'Writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
            'Athletics': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
            'default': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
        };
        
        return defaults[category] || defaults.default;
    }

    getCategoryIcon(category) {
        const icons = {
            'Performing Arts': '🎭',
            'Theatre': '🎭',
            'Science': '🔬',
            'Environmental Science': '🌱',
            'Travel': '✈️',
            'Visual Arts': '🎨',
            'Animal Care': '🐾',
            'Writing': '✍️',
            'Athletics': '🏃',
            'Indigenous Studies': '🪶'
        };
        
        return icons[category] || '📖';
    }

    mapCategoryToClass(category) {
        const map = {
            'Performing Arts': 'arts',
            'Theatre': 'arts',
            'Science': 'science',
            'Travel': 'travel',
            'Visual Arts': 'arts',
            'Animal Care': 'animals',
            'Writing': 'writing',
            'Athletics': 'sports'
        };
        
        return (map[category] || 'other').toLowerCase();
    }

    updateStats(records) {
        const totalExperiences = records.length;
        const totalHours = records.reduce((sum, r) => sum + (r.fields.Total_Hours || 0), 0);
        
        const allSkills = new Set();
        records.forEach(r => {
            if (r.fields.Skills) {
                r.fields.Skills.split(',').forEach(skill => {
                    allSkills.add(skill.trim());
                });
            }
        });
        
        const experiencesEl = document.getElementById('total-experiences');
        const hoursEl = document.getElementById('total-hours');
        const skillsEl = document.getElementById('total-skills');
        
        if (experiencesEl) experiencesEl.textContent = totalExperiences;
        if (hoursEl) hoursEl.textContent = totalHours;
        if (skillsEl) skillsEl.textContent = allSkills.size + '+';
    }

    showError() {
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #718096;">
                    <h3>⚠️ Unable to load experiences</h3>
                    <p>Please check your configuration.</p>
                </div>
            `;
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.timeline-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });
    }

    async init() {
        console.log('Loading experiences from Netlify Function...');
        const records = await this.loadExperiences();
        console.log(`Loaded ${records.length} experiences`);
        
        this.renderToTimeline(records);
        this.updateStats(records);
        
        return records;
    }
}
