/**
 * CareerConnect Portal - Career Guidance Report Generator
 * Creates an extensive, well-structured, printable summary report of the student's career assessment.
 */

const CareerReport = (function () {
  function generateReportHTML(careersData = (typeof CAREERS_DATA !== 'undefined' ? CAREERS_DATA : [])) {
    const storage = typeof CareerStorage !== 'undefined'
      ? CareerStorage
      : (typeof global !== 'undefined' && global.CareerStorage ? global.CareerStorage : null);

    const profile = storage ? storage.getProfile() : {};
    const interests = storage ? storage.getInterests() : [];
    const skills = storage ? storage.getSkills() : [];
    const recommendations = storage ? storage.getRecommendations() : [];
    const savedCareerIds = storage ? storage.getSavedCareers() : [];
    const roadmapProgress = storage ? storage.getRoadmapProgress() : {};

    const studentName = profile.name || "Student";
    const studentClass = profile.currentClass || "Not specified";
    const academicGroup = profile.academicGroup || "General";
    const marks = profile.marks ? `${profile.marks}%` : "Not specified";
    const favSubjects = profile.favouriteSubjects && profile.favouriteSubjects.length > 0
      ? profile.favouriteSubjects.join(', ')
      : "None selected";

    const topCareer = recommendations.length > 0 ? recommendations[0] : null;

    // Format academic group nicely
    const streamNames = {
      'general': 'General / Not Decided (10th Standard)',
      'science-pcm': 'Science with Physics, Chemistry & Mathematics (PCM)',
      'science-pcb': 'Science with Physics, Chemistry & Biology (PCB)',
      'science-pcmb': 'Science with PCMB (Maths & Biology)',
      'commerce-maths': 'Commerce with Mathematics',
      'commerce': 'Commerce without Mathematics',
      'arts': 'Humanities / Arts'
    };
    const streamLabel = streamNames[academicGroup] || academicGroup;

    const todayDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let html = `
      <div class="report-container">
        <!-- Report Header -->
        <div class="report-header">
          <div class="report-brand">
            <div class="brand-logo-report">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>CareerConnect Portal</span>
            </div>
            <p class="report-tagline">Discover Your Interest. Choose Your Career.</p>
          </div>
          <div class="report-meta">
            <h2>Personalized Career Guidance Report</h2>
            <p class="report-date">Generated on: <strong>${todayDate}</strong></p>
            <p class="badge-offline">100% Offline Assessment Report</p>
          </div>
        </div>

        <hr class="report-divider"/>

        <!-- Section 1: Student Profile -->
        <div class="report-section">
          <h3 class="section-title"><span class="section-num">1</span> Student Academic Profile</h3>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Student Name:</span>
              <span class="profile-value">${studentName}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Current Standard:</span>
              <span class="profile-value">${studentClass} Standard</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Academic Group / Stream:</span>
              <span class="profile-value">${streamLabel}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Recent Score / Marks:</span>
              <span class="profile-value">${marks}</span>
            </div>
            <div class="profile-item full-width">
              <span class="profile-label">Favorite Subjects:</span>
              <span class="profile-value">${favSubjects}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Assessment Strengths & Interests -->
        <div class="report-section">
          <h3 class="section-title"><span class="section-num">2</span> Selected Interests & Core Skills</h3>
          <div class="two-col-grid">
            <div class="sub-card">
              <h4>Primary Interests (${interests.length}/3)</h4>
              <div class="tag-cloud">
                ${interests.length > 0
                  ? interests.map(i => `<span class="tag tag-primary">${i}</span>`).join('')
                  : '<span class="text-muted">No specific interest selected</span>'
                }
              </div>
            </div>
            <div class="sub-card">
              <h4>Key Skills & Strengths (${skills.length})</h4>
              <div class="tag-cloud">
                ${skills.length > 0
                  ? skills.map(s => `<span class="tag tag-accent">${s}</span>`).join('')
                  : '<span class="text-muted">No skills selected</span>'
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Top 5 Career Recommendations -->
        <div class="report-section">
          <h3 class="section-title"><span class="section-num">3</span> Top Five Career Recommendations</h3>
          <p class="section-desc">Calculated via our offline weighted algorithm matching your stream, interests, skills, and assessment responses.</p>

          ${recommendations.length === 0
            ? '<p class="text-muted">No assessment results recorded yet. Please complete the assessment wizard to see your recommendations.</p>'
            : `<div class="recs-report-list">
                ${recommendations.map((rec, index) => {
                  return `
                    <div class="rec-report-card">
                      <div class="rec-report-header">
                        <div class="rec-report-rank">#${index + 1}</div>
                        <div class="rec-report-main">
                          <h4>${rec.title}</h4>
                          <span class="badge badge-primary">${rec.category}</span>
                        </div>
                        <div class="rec-report-score">
                          <span class="score-pct">${rec.matchPercentage}%</span>
                          <span class="score-sub">Match Fit</span>
                        </div>
                      </div>
                      <div class="rec-report-body">
                        <p class="rec-desc"><strong>Overview:</strong> ${rec.shortDescription}</p>
                        <p class="rec-why"><strong>Why it suits you:</strong> ${rec.whySuitsYou || rec.whySuits}</p>
                        <div class="rec-quick-meta">
                          <div><strong>Eligibility:</strong> ${rec.eligibility}</div>
                          <div><strong>Degree:</strong> ${rec.requiredQualification}</div>
                          <div><strong>Duration:</strong> ${rec.courseDuration}</div>
                          <div><strong>Key Entrance Exams:</strong> ${rec.entranceExams.join(', ')}</div>
                          <div><strong>Indicative Fresher Salary:</strong> ${rec.salaryFresher}</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>`
          }
          <p class="salary-disclaimer mt-2">
            * All salary figures are indicative Indian industry ranges intended for career planning.
          </p>
        </div>

        <!-- Section 4: Recommended Action Pathway (Top Match) -->
        ${topCareer && topCareer.roadmap ? `
          <div class="report-section page-break">
            <h3 class="section-title"><span class="section-num">4</span> Learning Roadmap for Top Match: ${topCareer.title}</h3>
            <p class="section-desc">A step-by-step educational pathway designed to guide your preparation from school to your first job.</p>
            <div class="report-roadmap">
              ${topCareer.roadmap.map((step, idx) => {
                const completedSteps = roadmapProgress[topCareer.id] || [];
                const isDone = completedSteps.includes(step.step);
                return `
                  <div class="roadmap-report-item ${isDone ? 'completed' : ''}">
                    <div class="step-marker">${isDone ? '✓' : step.step}</div>
                    <div class="step-content">
                      <h5>${step.title} ${isDone ? '<span class="status-done">(Completed)</span>' : ''}</h5>
                      <p>${step.desc}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Section 5: Saved / Bookmarked Careers -->
        <div class="report-section">
          <h3 class="section-title"><span class="section-num">5</span> Bookmarked Careers for Further Exploration</h3>
          ${savedCareerIds.length === 0
            ? '<p class="text-muted">No careers bookmarked yet. You can bookmark careers in the Explore section to track them here.</p>'
            : `<div class="tag-cloud">
                ${savedCareerIds.map(id => {
                  const c = careersData.find(item => item.id === id);
                  return c ? `<span class="tag tag-large">${c.title} (${c.category})</span>` : '';
                }).join('')}
              </div>`
          }
        </div>

        <!-- Section 6: Next Steps Guidance -->
        <div class="report-section">
          <h3 class="section-title"><span class="section-num">6</span> Strategic Next Steps for School Students</h3>
          <div class="guidance-box">
            <ul>
              <li><strong>If you are in Class 10:</strong> Focus on maintaining strong marks across all subjects while observing which disciplines give you genuine energy. Use this report to guide your 11th standard stream selection.</li>
              <li><strong>If you are in Class 11:</strong> Solidify fundamental concepts early. Build deep clarity in your core subjects and research the entrance examinations required for your top careers.</li>
              <li><strong>If you are in Class 12:</strong> Balance your board examination syllabus with dedicated previous-year question practice for relevant entrance tests (JEE, NEET, CUET, CLAT, NIFT, NDA, etc.).</li>
              <li><strong>Skill Building:</strong> Academic marks matter, but practical skills (problem-solving, communication, digital tools) differentiate top performers. Start working on small projects early!</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="report-footer">
          <p>CareerConnect Portal • Offline Career Discovery System for School Students</p>
          <p>Strictly offline tool • No external data collection • All assessments stored locally</p>
        </div>
      </div>
    `;

    return html;
  }

  return {
    generateReportHTML
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CareerReport;
}
