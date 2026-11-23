/**
 * CareerConnect Portal - Local Storage & State Management
 * 100% offline persistence using browser localStorage with in-memory fallback.
 */

const CareerStorage = (function () {
  const STORAGE_KEY_PREFIX = 'careerconnect_';

  const KEYS = {
    PROFILE: STORAGE_KEY_PREFIX + 'student_profile',
    INTERESTS: STORAGE_KEY_PREFIX + 'selected_interests',
    SKILLS: STORAGE_KEY_PREFIX + 'selected_skills',
    ASSESSMENT: STORAGE_KEY_PREFIX + 'assessment_answers',
    RECOMMENDATIONS: STORAGE_KEY_PREFIX + 'recommendations',
    SAVED_CAREERS: STORAGE_KEY_PREFIX + 'saved_careers',
    ROADMAP_PROGRESS: STORAGE_KEY_PREFIX + 'roadmap_progress',
    WIZARD_STEP: STORAGE_KEY_PREFIX + 'current_wizard_step'
  };

  // Memory fallback if localStorage is disabled or restricted
  const memoryStore = {};

  function isLocalStorageAvailable() {
    try {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasLocalStorage = isLocalStorageAvailable();

  function getItem(key, defaultValue = null) {
    try {
      if (hasLocalStorage) {
        const val = window.localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      }
      return memoryStore[key] ? JSON.parse(memoryStore[key]) : defaultValue;
    } catch (e) {
      console.warn('Error reading from storage:', e);
      return defaultValue;
    }
  }

  function setItem(key, value) {
    try {
      const str = JSON.stringify(value);
      if (hasLocalStorage) {
        window.localStorage.setItem(key, str);
      }
      memoryStore[key] = str;
      return true;
    } catch (e) {
      console.warn('Error writing to storage:', e);
      return false;
    }
  }

  function removeItem(key) {
    try {
      if (hasLocalStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryStore[key];
    } catch (e) {
      console.warn('Error removing from storage:', e);
    }
  }

  return {
    // Student Profile
    getProfile() {
      return getItem(KEYS.PROFILE, {
        name: '',
        currentClass: '10th',
        academicGroup: 'general',
        marks: '',
        favouriteSubjects: []
      });
    },
    saveProfile(profile) {
      return setItem(KEYS.PROFILE, profile);
    },

    // Interests
    getInterests() {
      return getItem(KEYS.INTERESTS, []);
    },
    saveInterests(interests) {
      return setItem(KEYS.INTERESTS, interests);
    },

    // Skills
    getSkills() {
      return getItem(KEYS.SKILLS, []);
    },
    saveSkills(skills) {
      return setItem(KEYS.SKILLS, skills);
    },

    // Assessment Answers
    getAssessmentAnswers() {
      return getItem(KEYS.ASSESSMENT, {});
    },
    saveAssessmentAnswers(answers) {
      return setItem(KEYS.ASSESSMENT, answers);
    },

    // Current wizard step
    getWizardStep() {
      return getItem(KEYS.WIZARD_STEP, 1);
    },
    saveWizardStep(step) {
      return setItem(KEYS.WIZARD_STEP, step);
    },

    // Recommendations
    getRecommendations() {
      return getItem(KEYS.RECOMMENDATIONS, []);
    },
    saveRecommendations(recommendations) {
      return setItem(KEYS.RECOMMENDATIONS, recommendations);
    },

    // Saved/Bookmarked Careers
    getSavedCareers() {
      return getItem(KEYS.SAVED_CAREERS, []);
    },
    saveSavedCareers(savedList) {
      return setItem(KEYS.SAVED_CAREERS, savedList);
    },
    toggleSavedCareer(careerId) {
      const saved = this.getSavedCareers();
      const index = saved.indexOf(careerId);
      let isSaved = false;
      if (index > -1) {
        saved.splice(index, 1);
        isSaved = false;
      } else {
        saved.push(careerId);
        isSaved = true;
      }
      this.saveSavedCareers(saved);
      return isSaved;
    },
    isCareerSaved(careerId) {
      const saved = this.getSavedCareers();
      return saved.includes(careerId);
    },

    // Roadmap Progress: { [careerId]: [step1, step2] }
    getRoadmapProgress() {
      return getItem(KEYS.ROADMAP_PROGRESS, {});
    },
    saveRoadmapProgress(progress) {
      return setItem(KEYS.ROADMAP_PROGRESS, progress);
    },
    toggleRoadmapStep(careerId, stepNumber) {
      const progress = this.getRoadmapProgress();
      if (!progress[careerId]) {
        progress[careerId] = [];
      }
      const idx = progress[careerId].indexOf(stepNumber);
      if (idx > -1) {
        progress[careerId].splice(idx, 1);
      } else {
        progress[careerId].push(stepNumber);
      }
      this.saveRoadmapProgress(progress);
      return progress[careerId];
    },
    getCareerRoadmapCompleted(careerId) {
      const progress = this.getRoadmapProgress();
      return progress[careerId] || [];
    },

    // Reset everything
    clearAllData() {
      Object.values(KEYS).forEach(k => removeItem(k));
      return true;
    },

    // Check if assessment has been completed
    hasCompletedAssessment() {
      const recs = this.getRecommendations();
      return Array.isArray(recs) && recs.length > 0;
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CareerStorage;
}
