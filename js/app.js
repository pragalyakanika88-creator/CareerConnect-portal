/**
 * CareerConnect Portal - Master Application Controller
 * Handles SPA navigation, step-by-step wizard, interactive roadmap, explore search,
 * offline assistant, dashboard, and modal state management.
 */

const App = (function () {
  // SVG Icon Helpers (100% offline, zero network requests)
  const ICONS = {
    bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    bookmarkFilled: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    briefcase: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    graduation: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    compass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    message: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
    print: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
    sliders: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`
  };

  // State Variables
  let currentView = 'home';
  let currentWizardStep = 2; // 2: Details, 3: Interests, 4: Skills, 5: Assessment
  let currentQuestionIndex = 0; // 0 to 4 for the 5 questions
  let selectedCategoryFilter = 'All';
  let searchQuery = '';

  // DOM Elements Cache
  const views = {};

  function init() {
    // Cache views
    ['home', 'wizard', 'recommendations', 'explore', 'compare', 'dashboard', 'report', 'assistant'].forEach(v => {
      views[v] = document.getElementById(`view-${v}`);
    });

    // Populate dynamic wizard elements
    renderInterestsSelectionGrid();
    renderSkillsSelectionGrid();
    renderSubjectsSelectionGrid();
    renderQuestionCard();

    // Init Explore filters & comparison dropdowns
    populateCategoryFilters();
    populateComparisonDropdowns();
    renderExploreCareers();

    // Check saved state
    const savedStep = CareerStorage.getWizardStep();
    if (savedStep && savedStep > 1 && savedStep < 6) {
      currentWizardStep = savedStep;
    }

    // Attach event listeners
    setupEventListeners();

    // Show initial view
    navigateTo('home');
  }

  // Navigation Controller
  function navigateTo(viewName) {
    currentView = viewName;

    // Update active view
    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === viewName) {
          views[key].classList.add('active');
        } else {
          views[key].classList.remove('active');
        }
      }
    });

    // Update navbar active link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // View-specific initializations
    if (viewName === 'wizard') {
      showWizardStep(currentWizardStep);
    } else if (viewName === 'recommendations') {
      renderRecommendationsView();
    } else if (viewName === 'explore') {
      renderExploreCareers();
    } else if (viewName === 'compare') {
      renderComparisonView();
    } else if (viewName === 'dashboard') {
      renderDashboardView();
    } else if (viewName === 'report') {
      renderReportView();
    } else if (viewName === 'assistant') {
      initAssistantChat();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // WIZARD CONTROLLER
  function showWizardStep(stepNumber) {
    currentWizardStep = stepNumber;
    CareerStorage.saveWizardStep(stepNumber);

    // Update Stepper Node UI
    for (let i = 2; i <= 6; i++) {
      const node = document.getElementById(`step-node-${i}`);
      if (node) {
        node.classList.remove('active', 'completed');
        if (i === stepNumber) {
          node.classList.add('active');
        } else if (i < stepNumber) {
          node.classList.add('completed');
        }
      }
    }

    // Hide all step sections, show current
    for (let i = 2; i <= 5; i++) {
      const stepElem = document.getElementById(`wizard-step-${i}`);
      if (stepElem) {
        stepElem.style.display = (i === stepNumber) ? 'block' : 'none';
      }
    }

    // If step 5 (Questions), make sure correct question is shown
    if (stepNumber === 5) {
      renderQuestionCard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextWizardStep() {
    if (currentWizardStep === 2) {
      // Validate Basic Details
      const nameInput = document.getElementById('student-name');
      const name = nameInput ? nameInput.value.trim() : '';
      if (!name) {
        showToast('Please enter your name to continue.', 'info');
        if (nameInput) nameInput.focus();
        return;
      }
      saveStep2Details();
      showWizardStep(3);
    } else if (currentWizardStep === 3) {
      // Validate Interests: Max 3, at least 1
      const interests = CareerStorage.getInterests();
      if (!interests || interests.length === 0) {
        showToast('Please select at least 1 interest (maximum 3).', 'info');
        return;
      }
      showWizardStep(4);
    } else if (currentWizardStep === 4) {
      // Validate Skills: at least 1
      const skills = CareerStorage.getSkills();
      if (!skills || skills.length === 0) {
        showToast('Please select at least 1 skill or strength.', 'info');
        return;
      }
      currentQuestionIndex = 0;
      showWizardStep(5);
    } else if (currentWizardStep === 5) {
      // Step 5 handles questions next/prev
      saveCurrentQuestionAnswer();
      const questions = RecommendationEngine.getAssessmentQuestions();
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestionCard();
      } else {
        // Complete Assessment & Calculate!
        finishAssessment();
      }
    }
  }

  function prevWizardStep() {
    if (currentWizardStep === 2) {
      navigateTo('home');
    } else if (currentWizardStep === 3) {
      showWizardStep(2);
    } else if (currentWizardStep === 4) {
      showWizardStep(3);
    } else if (currentWizardStep === 5) {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestionCard();
      } else {
        showWizardStep(4);
      }
    }
  }

  // STEP 2: Basic Details Logic
  function saveStep2Details() {
    const profile = CareerStorage.getProfile();
    const nameEl = document.getElementById('student-name');
    const classEl = document.querySelector('input[name="student-class"]:checked');
    const groupEl = document.getElementById('academic-group');
    const marksEl = document.getElementById('student-marks');

    profile.name = nameEl ? nameEl.value.trim() : '';
    profile.currentClass = classEl ? classEl.value : '10th';
    profile.academicGroup = groupEl ? groupEl.value : 'general';
    profile.marks = marksEl ? marksEl.value.trim() : '';

    // Collect checked favorite subjects
    const checkedSubjects = [];
    document.querySelectorAll('.subject-chip.selected').forEach(chip => {
      checkedSubjects.push(chip.dataset.subject);
    });
    profile.favouriteSubjects = checkedSubjects;

    CareerStorage.saveProfile(profile);
  }

  function renderSubjectsSelectionGrid() {
    const subjects = [
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Computer Science', 'Economics', 'Accountancy',
      'Business Studies', 'English', 'History / Political Science',
      'Psychology', 'Fine Arts'
    ];
    const container = document.getElementById('subjects-chips-container');
    if (!container) return;

    const profile = CareerStorage.getProfile();
    const favSubjects = profile.favouriteSubjects || [];

    container.innerHTML = subjects.map(sub => {
      const isSelected = favSubjects.includes(sub);
      return `
        <div class="chip-option subject-chip ${isSelected ? 'selected' : ''}" data-subject="${sub}" onclick="App.toggleSubject('${sub}', this)">
          <span class="chip-check"></span>
          <span>${sub}</span>
        </div>
      `;
    }).join('');
  }

  function toggleSubject(sub, el) {
    el.classList.toggle('selected');
    saveStep2Details();
  }

  // STEP 3: Interests Selection (Max 3)
  function renderInterestsSelectionGrid() {
    const interestsList = [
      { name: "Technology", icon: "💻", desc: "Software, coding, data & AI" },
      { name: "Medical", icon: "🩺", desc: "Doctors, surgery & clinical health" },
      { name: "Engineering", icon: "⚙️", desc: "Machines, robotics & structures" },
      { name: "Business", icon: "📈", desc: "Management, strategy & marketing" },
      { name: "Government Jobs", icon: "🏛️", desc: "Civil services, defense & banking" },
      { name: "Arts and Design", icon: "🎨", desc: "UI/UX, visual design & animation" },
      { name: "Science and Research", icon: "🔬", desc: "ISRO, biology & laboratory R&D" },
      { name: "Teaching", icon: "📚", desc: "Schools, universities & mentoring" },
      { name: "Finance", icon: "💰", desc: "Investment, CA, banking & stock markets" },
      { name: "Other fields", icon: "✈️", desc: "Aviation, law & psychology" }
    ];

    const container = document.getElementById('interests-grid-container');
    if (!container) return;

    const savedInterests = CareerStorage.getInterests();
    updateInterestCounter(savedInterests.length);

    container.innerHTML = interestsList.map(item => {
      const isSelected = savedInterests.includes(item.name);
      return `
        <div class="selectable-card interest-card ${isSelected ? 'selected' : ''}" data-interest="${item.name}" onclick="App.toggleInterest('${item.name}', this)">
          <div class="card-icon-round">${item.icon}</div>
          <div class="selectable-card-title">${item.name}</div>
          <p class="text-muted" style="font-size: 0.75rem;">${item.desc}</p>
        </div>
      `;
    }).join('');
  }

  function toggleInterest(interestName, cardEl) {
    let savedInterests = CareerStorage.getInterests();
    const index = savedInterests.indexOf(interestName);

    if (index > -1) {
      savedInterests.splice(index, 1);
      cardEl.classList.remove('selected');
    } else {
      if (savedInterests.length >= 3) {
        showToast('Maximum 3 interests allowed. Deselect one first.', 'info');
        return;
      }
      savedInterests.push(interestName);
      cardEl.classList.add('selected');
    }

    CareerStorage.saveInterests(savedInterests);
    updateInterestCounter(savedInterests.length);
  }

  function updateInterestCounter(count) {
    const counterEl = document.getElementById('interest-counter-badge');
    if (counterEl) {
      counterEl.textContent = `${count} of 3 selected`;
    }
  }

  // STEP 4: Skills Selection
  function renderSkillsSelectionGrid() {
    const skillsList = [
      "Problem-solving",
      "Communication",
      "Creativity",
      "Leadership",
      "Logical thinking",
      "Mathematics",
      "Computer knowledge",
      "Helping people",
      "Drawing and designing",
      "Analytical thinking"
    ];

    const container = document.getElementById('skills-chips-container');
    if (!container) return;

    const savedSkills = CareerStorage.getSkills();

    container.innerHTML = skillsList.map(skill => {
      const isSelected = savedSkills.includes(skill);
      return `
        <div class="chip-option skill-chip ${isSelected ? 'selected' : ''}" data-skill="${skill}" onclick="App.toggleSkill('${skill}', this)">
          <span class="chip-check"></span>
          <span>${skill}</span>
        </div>
      `;
    }).join('');
  }

  function toggleSkill(skillName, chipEl) {
    let savedSkills = CareerStorage.getSkills();
    const index = savedSkills.indexOf(skillName);

    if (index > -1) {
      savedSkills.splice(index, 1);
      chipEl.classList.remove('selected');
    } else {
      savedSkills.push(skillName);
      chipEl.classList.add('selected');
    }

    CareerStorage.saveSkills(savedSkills);
  }

  // STEP 5: Short Assessment Questions Logic
  function renderQuestionCard() {
    const questions = RecommendationEngine.getAssessmentQuestions();
    const q = questions[currentQuestionIndex];
    if (!q) return;

    // Progress
    const total = questions.length;
    const currentNum = currentQuestionIndex + 1;
    const pct = Math.round((currentNum / total) * 100);

    const progressFill = document.getElementById('question-progress-fill');
    const progressLabel = document.getElementById('question-progress-label');
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressLabel) progressLabel.textContent = `Question ${currentNum} of ${total}`;

    // Question Text
    const qBadge = document.getElementById('q-category-badge');
    const qText = document.getElementById('q-text');
    if (qBadge) qBadge.textContent = q.title;
    if (qText) qText.textContent = q.question;

    // Options
    const optionsContainer = document.getElementById('q-options-container');
    if (!optionsContainer) return;

    const savedAnswers = CareerStorage.getAssessmentAnswers();
    const currentAnswer = savedAnswers[q.id];

    optionsContainer.innerHTML = q.options.map(opt => {
      const isSelected = (currentAnswer === opt.id);
      return `
        <div class="option-card ${isSelected ? 'selected' : ''}" data-option-id="${opt.id}" onclick="App.selectOption('${q.id}', '${opt.id}', this)">
          <div class="option-letter">${opt.id}</div>
          <div class="option-text">${opt.text}</div>
        </div>
      `;
    }).join('');

    // Button Labels
    const nextBtn = document.getElementById('btn-q-next');
    if (nextBtn) {
      if (currentQuestionIndex === total - 1) {
        nextBtn.innerHTML = `Analyse & Recommend ${ICONS.arrowRight}`;
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-primary');
      } else {
        nextBtn.innerHTML = `Next Question ${ICONS.arrowRight}`;
      }
    }
  }

  function selectOption(questionId, optionId, cardEl) {
    document.querySelectorAll('#q-options-container .option-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');

    const answers = CareerStorage.getAssessmentAnswers();
    answers[questionId] = optionId;
    CareerStorage.saveAssessmentAnswers(answers);
  }

  function saveCurrentQuestionAnswer() {
    const questions = RecommendationEngine.getAssessmentQuestions();
    const q = questions[currentQuestionIndex];
    const selected = document.querySelector('#q-options-container .option-card.selected');
    if (selected && q) {
      const answers = CareerStorage.getAssessmentAnswers();
      answers[q.id] = selected.dataset.optionId;
      CareerStorage.saveAssessmentAnswers(answers);
    }
  }

  // STEP 6: Run Recommendation Algorithm
  function finishAssessment() {
    const profile = CareerStorage.getProfile();
    const interests = CareerStorage.getInterests();
    const skills = CareerStorage.getSkills();
    const assessmentAnswers = CareerStorage.getAssessmentAnswers();

    const studentData = {
      currentClass: profile.currentClass,
      academicGroup: profile.academicGroup,
      favouriteSubjects: profile.favouriteSubjects,
      interests: interests,
      skills: skills,
      assessmentAnswers: assessmentAnswers
    };

    // Calculate Top 5 Recommendations
    const topRecs = RecommendationEngine.getRecommendations(studentData, CAREERS_DATA);
    CareerStorage.saveRecommendations(topRecs);

    showToast('Analysis complete! Here are your top career recommendations.', 'success');
    navigateTo('recommendations');
  }

  // RENDER STEP 6 RECOMMENDATIONS
  function renderRecommendationsView() {
    const recs = CareerStorage.getRecommendations();
    const container = document.getElementById('recommendations-list');
    const emptyState = document.getElementById('recs-empty-state');
    const profile = CareerStorage.getProfile();

    if (!container) return;

    if (!recs || recs.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      container.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const studentName = profile.name ? `${profile.name}'s` : "Your";
    const subHeader = document.getElementById('recs-sub-title');
    if (subHeader) {
      subHeader.textContent = `Tailored for ${studentName} interests, skills, and academic stream.`;
    }

    container.innerHTML = recs.map((rec, index) => {
      const isSaved = CareerStorage.isCareerSaved(rec.id);
      const isTop = index === 0;

      return `
        <div class="rec-card ${isTop ? 'top-rank' : ''}">
          <div class="rec-card-header">
            <div class="rec-card-rank">
              <div class="rank-badge">#${index + 1}</div>
              <div class="rec-card-titles">
                <span class="badge badge-primary mb-1">${rec.category}</span>
                <h3>${rec.title}</h3>
              </div>
            </div>
            <div class="rec-match-score">
              <div class="match-pct">${rec.matchPercentage}%</div>
              <div class="match-label">Match Score</div>
            </div>
          </div>

          <p class="text-body">${rec.shortDescription}</p>

          <div class="rec-why-box">
            <strong>Why it suits you:</strong> ${rec.whySuitsYou || rec.whySuits}
          </div>

          <div class="rec-meta-grid">
            <div class="rec-meta-item">
              <strong>Required Degree</strong>
              <span>${rec.requiredQualification}</span>
            </div>
            <div class="rec-meta-item">
              <strong>Duration</strong>
              <span>${rec.courseDuration}</span>
            </div>
            <div class="rec-meta-item">
              <strong>Key Entrance Exams</strong>
              <span>${rec.entranceExams.slice(0, 3).join(', ')}</span>
            </div>
            <div class="rec-meta-item">
              <strong>Indicative Fresher Salary</strong>
              <span class="text-success font-weight-bold">${rec.salaryFresher}</span>
            </div>
          </div>

          <div class="rec-card-actions">
            <div class="tag-cloud">
              ${rec.requiredSkills.slice(0, 3).map(s => `<span class="tag tag-accent">${s}</span>`).join('')}
            </div>
            <div class="d-flex align-center gap-2">
              <button class="btn-bookmark ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Saved in bookmarks' : 'Save career'}" onclick="App.toggleBookmark('${rec.id}', this)">
                ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
              </button>
              <button class="btn btn-sm btn-primary" onclick="App.openCareerDetails('${rec.id}')">
                View Full Details ${ICONS.arrowRight}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // EXPLORE ALL CAREERS & SEARCH
  function populateCategoryFilters() {
    const container = document.getElementById('category-chips-container');
    if (!container) return;

    const categories = [
      'All', 'Technology', 'Engineering', 'Medical', 'Healthcare',
      'Science', 'Commerce', 'Finance', 'Business', 'Arts',
      'Design', 'Government', 'Teaching', 'Research'
    ];

    container.innerHTML = categories.map(cat => {
      const isActive = cat === selectedCategoryFilter;
      return `
        <button class="cat-chip ${isActive ? 'active' : ''}" onclick="App.setCategoryFilter('${cat}')">
          ${cat}
        </button>
      `;
    }).join('');
  }

  function setCategoryFilter(category) {
    selectedCategoryFilter = category;
    populateCategoryFilters();
    renderExploreCareers();
  }

  function handleSearchInput(value) {
    searchQuery = value.toLowerCase().trim();
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      if (searchQuery.length > 0) {
        clearBtn.classList.add('visible');
      } else {
        clearBtn.classList.remove('visible');
      }
    }
    renderExploreCareers();
  }

  function clearSearch() {
    const input = document.getElementById('career-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    searchQuery = '';
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.classList.remove('visible');
    renderExploreCareers();
  }

  function renderExploreCareers() {
    const container = document.getElementById('explore-careers-grid');
    const countBadge = document.getElementById('explore-count-badge');
    const streamFilter = document.getElementById('explore-stream-filter');
    const sortFilter = document.getElementById('explore-sort-filter');

    if (!container) return;

    const streamVal = streamFilter ? streamFilter.value : 'all';
    const sortVal = sortFilter ? sortFilter.value : 'title';

    let filtered = CAREERS_DATA.filter(career => {
      // Category filter
      if (selectedCategoryFilter !== 'All' && career.category !== selectedCategoryFilter) {
        return false;
      }
      // Stream filter
      if (streamVal !== 'all') {
        const streams = career.streamMatch || [];
        if (!streams.includes('any') && !streams.includes(streamVal)) {
          return false;
        }
      }
      // Search Query
      if (searchQuery) {
        const text = `${career.title} ${career.category} ${career.shortDescription} ${career.requiredSkills.join(' ')} ${career.entranceExams.join(' ')}`.toLowerCase();
        if (!text.includes(searchQuery)) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortVal === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'category') {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    if (countBadge) {
      countBadge.textContent = `Showing ${filtered.length} of ${CAREERS_DATA.length} careers`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${ICONS.search}</div>
          <h3>No careers match your search</h3>
          <p>Try searching for a different keyword or resetting your filters.</p>
          <button class="btn btn-outline-primary" onclick="App.resetExploreFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(career => {
      const isSaved = CareerStorage.isCareerSaved(career.id);
      return `
        <div class="career-grid-card">
          <div class="card-top-row">
            <span class="badge badge-primary">${career.category}</span>
            <button class="btn-bookmark ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Saved in bookmarks' : 'Save career'}" onclick="App.toggleBookmark('${career.id}', this)">
              ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
            </button>
          </div>

          <h3>${career.title}</h3>
          <p class="short-desc">${career.shortDescription}</p>

          <div class="career-quick-facts">
            <div><strong>Eligibility:</strong> ${career.eligibility}</div>
            <div><strong>Exams:</strong> ${career.entranceExams.slice(0, 2).join(', ')}</div>
            <div><strong>Fresher Salary:</strong> <span class="text-success font-weight-bold">${career.salaryFresher}</span></div>
          </div>

          <div class="career-card-footer">
            <span class="text-muted" style="font-size: 0.8rem;">${career.courseDuration}</span>
            <button class="btn btn-sm btn-outline-primary" onclick="App.openCareerDetails('${career.id}')">
              Explore Details ${ICONS.arrowRight}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function resetExploreFilters() {
    selectedCategoryFilter = 'All';
    searchQuery = '';
    const searchInput = document.getElementById('career-search-input');
    if (searchInput) searchInput.value = '';
    const streamFilter = document.getElementById('explore-stream-filter');
    if (streamFilter) streamFilter.value = 'all';
    populateCategoryFilters();
    renderExploreCareers();
  }

  // CAREER DETAILS MODAL (10 SECTIONS)
  function openCareerDetails(careerId) {
    const career = CAREERS_DATA.find(c => c.id === careerId);
    if (!career) return;

    const modal = document.getElementById('career-details-modal');
    const modalTitle = document.getElementById('modal-career-title');
    const modalCategory = document.getElementById('modal-career-category');
    const modalBody = document.getElementById('modal-career-body');
    const modalBookmark = document.getElementById('modal-bookmark-btn');

    if (!modal || !modalBody) return;

    if (modalTitle) modalTitle.textContent = career.title;
    if (modalCategory) modalCategory.textContent = career.category;

    const isSaved = CareerStorage.isCareerSaved(career.id);
    if (modalBookmark) {
      modalBookmark.innerHTML = isSaved ? ICONS.bookmarkFilled : ICONS.bookmark;
      modalBookmark.className = `btn-bookmark ${isSaved ? 'saved' : ''}`;
      modalBookmark.onclick = () => {
        const savedNow = CareerStorage.toggleSavedCareer(career.id);
        modalBookmark.innerHTML = savedNow ? ICONS.bookmarkFilled : ICONS.bookmark;
        modalBookmark.className = `btn-bookmark ${savedNow ? 'saved' : ''}`;
        showToast(savedNow ? `Saved ${career.title} to bookmarks` : `Removed ${career.title} from bookmarks`, 'info');
        renderExploreCareers();
        renderDashboardView();
      };
    }

    const completedSteps = CareerStorage.getCareerRoadmapCompleted(career.id);
    const totalSteps = career.roadmap ? career.roadmap.length : 0;
    const completedPct = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

    modalBody.innerHTML = `
      <!-- 1. About this career -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">1</span> About This Career</h4>
        <p>${career.shortDescription}</p>
      </div>

      <!-- 2. Why this career is suitable -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">2</span> Why This Career Is Suitable</h4>
        <p>${career.whySuits}</p>
      </div>

      <!-- 3. Educational qualifications -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">3</span> Educational Qualifications & Eligibility</h4>
        <p><strong>Eligibility:</strong> ${career.eligibility}</p>
        <p class="mt-1"><strong>Primary Degree Required:</strong> ${career.requiredQualification}</p>
      </div>

      <!-- 4. Courses to study after 12th -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">4</span> Course Options & Duration</h4>
        <p><strong>Typical Duration:</strong> ${career.courseDuration}</p>
        <ul style="padding-left: 1.5rem; margin-top: 0.5rem;">
          ${career.courseOptions.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <!-- 5. Entrance examinations -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">5</span> Key Entrance Examinations</h4>
        <div class="tag-cloud">
          ${career.entranceExams.map(e => `<span class="tag tag-primary tag-large">${e}</span>`).join('')}
        </div>
      </div>

      <!-- 6. Skills required -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">6</span> Required Skills & Strengths</h4>
        <div class="tag-cloud">
          ${career.requiredSkills.map(s => `<span class="tag tag-accent tag-large">${s}</span>`).join('')}
        </div>
      </div>

      <!-- 7. Job opportunities -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">7</span> Job Roles & Employment Opportunities</h4>
        <ul style="padding-left: 1.5rem;">
          ${career.jobOpportunities.map(job => `<li>${job}</li>`).join('')}
        </ul>
      </div>

      <!-- 8. Expected salary range -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">8</span> Indicative Salary Ranges in India</h4>
        <div class="salary-highlight-card">
          <div class="salary-figure-group">
            <h5>Indicative Fresher Package</h5>
            <div class="salary-number">${career.salaryFresher}</div>
          </div>
          <div class="salary-figure-group">
            <h5>Indicative Experienced (5-8 Yrs)</h5>
            <div class="salary-number">${career.salaryExperienced}</div>
          </div>
        </div>
        <p class="text-muted" style="font-size: 0.8rem;">${career.salaryNotice}</p>
      </div>

      <!-- 9. Future growth -->
      <div class="details-section-box">
        <h4 class="details-section-title"><span class="section-badge">9</span> Future Career Scope & Industry Trends</h4>
        <p>${career.futureScope}</p>
      </div>

      <!-- 10. Step-by-step learning roadmap -->
      <div class="details-section-box">
        <div class="d-flex align-center justify-between">
          <h4 class="details-section-title" style="border:none; margin:0;"><span class="section-badge">10</span> Step-by-Step Learning Roadmap</h4>
          <span class="roadmap-progress-badge" id="modal-roadmap-progress-badge">
            ${completedSteps.length} / ${totalSteps} Completed (${completedPct}%)
          </span>
        </div>
        <p class="text-muted mt-1" style="font-size:0.88rem;">Click on any step below to check off your milestones as you advance:</p>

        <div class="roadmap-interactive-list">
          ${career.roadmap.map(step => {
            const isDone = completedSteps.includes(step.step);
            return `
              <div class="roadmap-interactive-item ${isDone ? 'completed' : ''}" id="step-row-${career.id}-${step.step}" onclick="App.toggleRoadmapStep('${career.id}', ${step.step})">
                <div class="roadmap-checkbox">
                  ${isDone ? ICONS.check : ''}
                </div>
                <div class="roadmap-step-text">
                  <h5>Step ${step.step}: ${step.title}</h5>
                  <p>${step.desc}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCareerDetails() {
    const modal = document.getElementById('career-details-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function toggleRoadmapStep(careerId, stepNum) {
    const updated = CareerStorage.toggleRoadmapStep(careerId, stepNum);
    const career = CAREERS_DATA.find(c => c.id === careerId);
    if (!career) return;

    const row = document.getElementById(`step-row-${careerId}-${stepNum}`);
    if (row) {
      const isDone = updated.includes(stepNum);
      if (isDone) {
        row.classList.add('completed');
        row.querySelector('.roadmap-checkbox').innerHTML = ICONS.check;
      } else {
        row.classList.remove('completed');
        row.querySelector('.roadmap-checkbox').innerHTML = '';
      }
    }

    // Update progress badge
    const badge = document.getElementById('modal-roadmap-progress-badge');
    if (badge && career.roadmap) {
      const total = career.roadmap.length;
      const pct = Math.round((updated.length / total) * 100);
      badge.textContent = `${updated.length} / ${total} Completed (${pct}%)`;
    }

    renderDashboardView();
  }

  // BOOKMARK TOGGLE
  function toggleBookmark(careerId, btnEl) {
    const isSaved = CareerStorage.toggleSavedCareer(careerId);
    const career = CAREERS_DATA.find(c => c.id === careerId);
    const name = career ? career.title : 'Career';

    if (btnEl) {
      if (isSaved) {
        btnEl.classList.add('saved');
        btnEl.innerHTML = ICONS.bookmarkFilled;
      } else {
        btnEl.classList.remove('saved');
        btnEl.innerHTML = ICONS.bookmark;
      }
    }

    showToast(isSaved ? `Saved ${name} to bookmarks` : `Removed ${name} from bookmarks`, 'info');
    renderExploreCareers();
    renderRecommendationsView();
    renderDashboardView();
  }

  // CAREER COMPARISON VIEW
  function populateComparisonDropdowns() {
    const sel1 = document.getElementById('compare-select-1');
    const sel2 = document.getElementById('compare-select-2');
    if (!sel1 || !sel2) return;

    const optionsHTML = CAREERS_DATA.map(c => `<option value="${c.id}">${c.title} (${c.category})</option>`).join('');
    sel1.innerHTML = optionsHTML;
    sel2.innerHTML = optionsHTML;

    // Pick two default contrasting careers
    sel1.value = 'software-engineer';
    sel2.value = 'general-physician';
  }

  function renderComparisonView() {
    const sel1 = document.getElementById('compare-select-1');
    const sel2 = document.getElementById('compare-select-2');
    const container = document.getElementById('comparison-table-container');

    if (!sel1 || !sel2 || !container) return;

    const c1Id = sel1.value;
    const c2Id = sel2.value;

    container.innerHTML = CareerComparison.renderComparisonTable(c1Id, c2Id, CAREERS_DATA);
  }

  // STUDENT DASHBOARD VIEW
  function renderDashboardView() {
    const profile = CareerStorage.getProfile();
    const recommendations = CareerStorage.getRecommendations();
    const savedIds = CareerStorage.getSavedCareers();
    const roadmapProgress = CareerStorage.getRoadmapProgress();

    // Profile Details
    const nameEl = document.getElementById('dash-student-name');
    const avatarEl = document.getElementById('dash-avatar-initial');
    const classEl = document.getElementById('dash-student-class');
    const groupEl = document.getElementById('dash-student-group');
    const marksEl = document.getElementById('dash-student-marks');

    const name = profile.name || "Student";
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase() || "S";
    if (classEl) classEl.textContent = `${profile.currentClass || '10th'} Standard`;
    if (groupEl) groupEl.textContent = profile.academicGroup || "General";
    if (marksEl) marksEl.textContent = profile.marks ? `${profile.marks}%` : "Not provided";

    // Summary counts
    const recsCountEl = document.getElementById('dash-stat-recs');
    const savedCountEl = document.getElementById('dash-stat-saved');
    if (recsCountEl) recsCountEl.textContent = recommendations.length;
    if (savedCountEl) savedCountEl.textContent = savedIds.length;

    // Recommendations snippet
    const recsSnippetContainer = document.getElementById('dash-recs-snippet');
    if (recsSnippetContainer) {
      if (recommendations.length === 0) {
        recsSnippetContainer.innerHTML = `
          <div class="empty-state">
            <p>You haven't completed the career assessment yet.</p>
            <button class="btn btn-primary btn-sm" onclick="App.navigateTo('wizard')">Start Career Journey</button>
          </div>
        `;
      } else {
        recsSnippetContainer.innerHTML = `
          <div class="recs-list">
            ${recommendations.slice(0, 3).map((r, idx) => `
              <div class="rec-card" style="padding: 1.25rem;">
                <div class="d-flex align-center justify-between">
                  <div class="d-flex align-center gap-2">
                    <span class="rank-badge" style="width:28px; height:28px; font-size:0.85rem;">#${idx + 1}</span>
                    <h4 style="margin:0;">${r.title}</h4>
                  </div>
                  <span class="match-pct" style="font-size:1.2rem;">${r.matchPercentage}%</span>
                </div>
                <p class="text-muted mt-1" style="font-size:0.85rem;">${r.shortDescription}</p>
                <div class="d-flex justify-between align-center mt-2">
                  <span class="badge badge-primary">${r.category}</span>
                  <button class="btn btn-sm btn-outline-primary" onclick="App.openCareerDetails('${r.id}')">View Details</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="text-center mt-2">
            <button class="btn btn-sm btn-outline-primary" onclick="App.navigateTo('recommendations')">View All Recommendations</button>
          </div>
        `;
      }
    }

    // Saved Careers snippet
    const savedSnippetContainer = document.getElementById('dash-saved-snippet');
    if (savedSnippetContainer) {
      if (savedIds.length === 0) {
        savedSnippetContainer.innerHTML = `
          <div class="empty-state">
            <p>No saved careers yet. Browse careers and click the bookmark icon to save them.</p>
            <button class="btn btn-sm btn-outline-primary" onclick="App.navigateTo('explore')">Explore Careers</button>
          </div>
        `;
      } else {
        savedSnippetContainer.innerHTML = `
          <div class="careers-grid">
            ${savedIds.map(id => {
              const c = CAREERS_DATA.find(item => item.id === id);
              if (!c) return '';
              return `
                <div class="career-grid-card" style="padding:1.25rem;">
                  <span class="badge badge-primary mb-1">${c.category}</span>
                  <h4>${c.title}</h4>
                  <p class="text-muted" style="font-size:0.85rem;">${c.shortDescription}</p>
                  <div class="career-card-footer mt-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="App.openCareerDetails('${c.id}')">Details</button>
                    <button class="btn-bookmark saved" onclick="App.toggleBookmark('${c.id}', this)">${ICONS.bookmarkFilled}</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    }

    // Roadmap Progress Overview
    const roadmapContainer = document.getElementById('dash-roadmap-snippet');
    if (roadmapContainer) {
      const trackedCareers = Object.keys(roadmapProgress);
      if (trackedCareers.length === 0) {
        roadmapContainer.innerHTML = `<p class="text-muted">No roadmap steps checked off yet. Open any career details page to mark your progress.</p>`;
      } else {
        roadmapContainer.innerHTML = trackedCareers.map(cid => {
          const c = CAREERS_DATA.find(item => item.id === cid);
          if (!c || !c.roadmap) return '';
          const completed = roadmapProgress[cid].length;
          const total = c.roadmap.length;
          const pct = Math.round((completed / total) * 100);
          return `
            <div class="card mb-2" style="padding:1rem;">
              <div class="d-flex align-center justify-between mb-1">
                <strong>${c.title}</strong>
                <span class="text-primary font-weight-bold">${completed} / ${total} steps (${pct}%)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width:${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // CAREER REPORT VIEW
  function renderReportView() {
    const container = document.getElementById('report-content-container');
    if (container) {
      container.innerHTML = CareerReport.generateReportHTML(CAREERS_DATA);
    }
  }

  function printReport() {
    window.print();
  }

  // OFFLINE CAREER ASSISTANT (CHAT)
  function initAssistantChat() {
    const history = document.getElementById('assistant-chat-history');
    const suggestionsBar = document.getElementById('assistant-suggestions-bar');

    if (!history) return;

    // Render quick suggestion chips
    if (suggestionsBar) {
      const questions = OfflineCareerAssistant.getQuickQuestions();
      suggestionsBar.innerHTML = questions.map(q => `
        <button class="suggestion-chip" onclick="App.askAssistantQuery('${q.replace(/'/g, "\\'")}')">${q}</button>
      `).join('');
    }

    // If chat empty, add welcome message
    if (history.children.length === 0) {
      addChatMessage("assistant", `Hello! I am your <strong>Offline Career Guidance Assistant</strong>.<br><br>
I am powered by pre-compiled local educational data on Indian school streams, degrees, entrance examinations (NEET, JEE, CLAT, UPSC, NDA), and career pathways.<br><br>
You can ask me any question or click any of the suggestion chips below!`);
    }
  }

  function askAssistantQuery(queryText) {
    const input = document.getElementById('assistant-user-input');
    if (input) input.value = queryText;
    submitAssistantMessage();
  }

  function submitAssistantMessage() {
    const input = document.getElementById('assistant-user-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    addChatMessage("user", text);
    input.value = '';

    // Get offline answer
    setTimeout(() => {
      const response = OfflineCareerAssistant.ask(text, CAREERS_DATA);
      addChatMessage("assistant", response.answer);
    }, 200);
  }

  function addChatMessage(sender, htmlContent) {
    const history = document.getElementById('assistant-chat-history');
    if (!history) return;

    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = `
      <div class="msg-bubble">${htmlContent}</div>
    `;

    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
  }

  // TOAST ALERTS
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Event Listeners setup
  function setupEventListeners() {
    // Top Nav clicks
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) navigateTo(view);
      });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCareerDetails();
    });

    // Close modal on overlay click
    const modal = document.getElementById('career-details-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCareerDetails();
      });
    }

    // Assistant Input Enter Key
    const assistantInput = document.getElementById('assistant-user-input');
    if (assistantInput) {
      assistantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitAssistantMessage();
      });
    }

    // Explore Search Input debounce
    const searchInput = document.getElementById('career-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => handleSearchInput(e.target.value));
    }
  }

  // Public Interface
  return {
    init,
    navigateTo,
    showWizardStep,
    nextWizardStep,
    prevWizardStep,
    toggleSubject,
    toggleInterest,
    toggleSkill,
    selectOption,
    finishAssessment,
    setCategoryFilter,
    handleSearchInput,
    clearSearch,
    resetExploreFilters,
    renderExploreCareers,
    openCareerDetails,
    closeCareerDetails,
    toggleRoadmapStep,
    toggleBookmark,
    renderComparisonView,
    printReport,
    askAssistantQuery,
    submitAssistantMessage
  };
})();

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
