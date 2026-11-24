/**
 * CareerConnect Portal - Career Comparison Module
 * Allows students to compare two career paths side-by-side.
 */

const CareerComparison = (function () {
  function renderComparisonTable(career1Id, career2Id, careersData = (typeof CAREERS_DATA !== 'undefined' ? CAREERS_DATA : [])) {
    const c1 = careersData.find(c => c.id === career1Id);
    const c2 = careersData.find(c => c.id === career2Id);

    if (!c1 || !c2) {
      return `
        <div class="empty-state">
          <p>Please select two different careers to view a side-by-side comparison.</p>
        </div>
      `;
    }

    const comparisonRows = [
      {
        label: "Field & Category",
        val1: `<span class="badge badge-primary">${c1.category}</span>`,
        val2: `<span class="badge badge-primary">${c2.category}</span>`
      },
      {
        label: "Eligibility Criteria",
        val1: c1.eligibility,
        val2: c2.eligibility
      },
      {
        label: "Primary Qualification",
        val1: `<strong>${c1.requiredQualification}</strong>`,
        val2: `<strong>${c2.requiredQualification}</strong>`
      },
      {
        label: "Course Duration",
        val1: c1.courseDuration,
        val2: c2.courseDuration
      },
      {
        label: "Popular Courses",
        val1: `<ul>${c1.courseOptions.map(o => `<li>${o}</li>`).join('')}</ul>`,
        val2: `<ul>${c2.courseOptions.map(o => `<li>${o}</li>`).join('')}</ul>`
      },
      {
        label: "Key Entrance Exams",
        val1: `<div class="tag-cloud">${c1.entranceExams.map(e => `<span class="tag">${e}</span>`).join('')}</div>`,
        val2: `<div class="tag-cloud">${c2.entranceExams.map(e => `<span class="tag">${e}</span>`).join('')}</div>`
      },
      {
        label: "Key Skills Needed",
        val1: `<div class="tag-cloud">${c1.requiredSkills.map(s => `<span class="tag tag-accent">${s}</span>`).join('')}</div>`,
        val2: `<div class="tag-cloud">${c2.requiredSkills.map(s => `<span class="tag tag-accent">${s}</span>`).join('')}</div>`
      },
      {
        label: "Indicative Fresher Salary",
        val1: `<div class="salary-box"><strong>${c1.salaryFresher}</strong></div>`,
        val2: `<div class="salary-box"><strong>${c2.salaryFresher}</strong></div>`
      },
      {
        label: "Indicative Experienced Salary",
        val1: `<div class="salary-box"><strong>${c1.salaryExperienced}</strong></div>`,
        val2: `<div class="salary-box"><strong>${c2.salaryExperienced}</strong></div>`
      },
      {
        label: "Future Career Scope",
        val1: `<p class="scope-text">${c1.futureScope}</p>`,
        val2: `<p class="scope-text">${c2.futureScope}</p>`
      },
      {
        label: "Roadmap Milestones",
        val1: `<span>${c1.roadmap ? c1.roadmap.length : 0} Structured Steps</span>`,
        val2: `<span>${c2.roadmap ? c2.roadmap.length : 0} Structured Steps</span>`
      }
    ];

    let html = `
      <div class="comparison-scroll-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        <span>Swipe horizontally to compare both careers side-by-side</span>
      </div>
      <div class="comparison-scroll-wrapper">
        <div class="comparison-grid">
          <div class="comparison-header">
            <div class="comparison-col col-feature">Feature / Dimension</div>
            <div class="comparison-col col-c1">
              <div class="compare-title-block">
                <h3>${c1.title}</h3>
                <p class="text-muted">${c1.shortDescription}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="App.openCareerDetails('${c1.id}')">View Details</button>
              </div>
            </div>
            <div class="comparison-col col-c2">
              <div class="compare-title-block">
                <h3>${c2.title}</h3>
                <p class="text-muted">${c2.shortDescription}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="App.openCareerDetails('${c2.id}')">View Details</button>
              </div>
            </div>
          </div>
          <div class="comparison-body">
    `;

    comparisonRows.forEach(row => {
      html += `
        <div class="comparison-row">
          <div class="comparison-col col-feature"><strong>${row.label}</strong></div>
          <div class="comparison-col col-c1">${row.val1}</div>
          <div class="comparison-col col-c2">${row.val2}</div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </div>
      <p class="salary-disclaimer text-center mt-3 text-muted">
        * Note: Salary ranges shown are realistic market estimates for India. All figures are strictly indicative and depend on institute, competence, employer, and geographic tier.
      </p>
    `;

    return html;
  }

  return {
    renderComparisonTable
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CareerComparison;
}
