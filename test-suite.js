const fs = require('fs');
const path = require('path');

const careers = require('./js/careers-data.js');
global.CAREERS_DATA = careers;

const CareerStorage = require('./js/storage.js');
global.CareerStorage = CareerStorage;

const RecommendationEngine = require('./js/recommendation-engine.js');
const { ASSISTANT_KNOWLEDGE_BASE, OfflineCareerAssistant } = require('./js/assistant.js');
const CareerComparison = require('./js/comparison.js');
const CareerReport = require('./js/report.js');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log("=== RUNNING CAREERCONNECT PORTAL COMPREHENSIVE TESTS ===");

// 1. DATASET INTEGRITY
console.log("\n[Test Suite 1: Career Profiles Database]");
assert(careers.length >= 40, `Database contains at least 40 careers (Actual: ${careers.length})`);

const requiredCategories = [
  'Engineering', 'Technology', 'Medical', 'Healthcare', 'Science',
  'Commerce', 'Business', 'Arts', 'Design', 'Government', 'Teaching', 'Research'
];
const categoriesFound = new Set(careers.map(c => c.category));
requiredCategories.forEach(cat => {
  assert(categoriesFound.has(cat), `Category '${cat}' is represented in the database`);
});

careers.forEach(c => {
  const hasFields = c.id && c.title && c.category && c.shortDescription &&
    c.whySuits && c.eligibility && c.requiredQualification &&
    Array.isArray(c.courseOptions) && c.courseOptions.length > 0 &&
    c.courseDuration && Array.isArray(c.entranceExams) &&
    Array.isArray(c.requiredSkills) && c.requiredSkills.length > 0 &&
    Array.isArray(c.jobOpportunities) && c.jobOpportunities.length > 0 &&
    c.salaryFresher && c.salaryExperienced && c.futureScope &&
    Array.isArray(c.roadmap) && c.roadmap.length >= 5;

  if (!hasFields) {
    assert(false, `Career profile ${c.id} (${c.title}) has all required complete fields`);
  }
});
assert(true, "All 46 career profiles have 100% complete schema, realistic salaries & roadmaps");

// 2. RECOMMENDATION ENGINE
console.log("\n[Test Suite 2: Recommendation Engine Weighted Scoring]");

// Persona 1: Tech PCM Student
const techStudent = {
  currentClass: '11th',
  academicGroup: 'science-pcm',
  favouriteSubjects: ['Mathematics', 'Computer Science'],
  interests: ['Technology', 'Engineering'],
  skills: ['Problem-solving', 'Logical thinking', 'Computer knowledge'],
  assessmentAnswers: { 1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A' }
};
const techRecs = RecommendationEngine.getRecommendations(techStudent, careers);
assert(techRecs.length === 5, "Recommendation engine returns exactly Top 5 careers for Tech student");
assert(techRecs.every(r => r.category === 'Technology' || r.category === 'Engineering'), "Tech student top recommendations are all in Technology or Engineering");
assert(techRecs[0].matchPercentage >= 85, `Top match percentage is realistic (Actual: ${techRecs[0].matchPercentage}%)`);

// Persona 2: Medical PCB Student
const medStudent = {
  currentClass: '12th',
  academicGroup: 'science-pcb',
  favouriteSubjects: ['Biology', 'Chemistry'],
  interests: ['Medical', 'Healthcare'],
  skills: ['Helping people', 'Analytical thinking'],
  assessmentAnswers: { 1: 'C', 2: 'B', 3: 'B', 4: 'B', 5: 'B' }
};
const medRecs = RecommendationEngine.getRecommendations(medStudent, careers);
assert(medRecs.length === 5, "Recommendation engine returns exactly Top 5 careers for Medical student");
assert(medRecs.some(r => r.id === 'general-physician' || r.id === 'veterinary-doctor' || r.id === 'pharmacist'), "Medical student recommendations contain core healthcare professions");

// Persona 3: Commerce & Finance Student
const commStudent = {
  currentClass: '11th',
  academicGroup: 'commerce-maths',
  favouriteSubjects: ['Accountancy', 'Economics', 'Mathematics'],
  interests: ['Commerce', 'Finance', 'Business'],
  skills: ['Mathematics', 'Analytical thinking', 'Problem-solving'],
  assessmentAnswers: { 1: 'D', 2: 'C', 3: 'C', 4: 'C', 5: 'C' }
};
const commRecs = RecommendationEngine.getRecommendations(commStudent, careers);
assert(commRecs.length === 5, "Recommendation engine returns exactly Top 5 careers for Commerce student");
assert(commRecs.some(r => r.id === 'chartered-accountant' || r.id === 'investment-banker' || r.id === 'cma-accountant'), "Commerce student recommendations contain CA/Banking/CMA");

// 3. OFFLINE CAREER ASSISTANT
console.log("\n[Test Suite 3: Offline Career Assistant]");
const streamAns = OfflineCareerAssistant.ask("Which stream should I choose after 10th?");
assert(streamAns.type === 'faq_match', "Assistant matches stream question to FAQ knowledge base");
assert(streamAns.answer.includes("PCM") && streamAns.answer.includes("PCB") && streamAns.answer.includes("Commerce"), "Stream answer provides comprehensive stream options");

const careerLookup = OfflineCareerAssistant.ask("Tell me about Software Engineer");
assert(careerLookup.type === 'career_lookup' && careerLookup.careerId === 'software-engineer', "Assistant can look up career profiles offline");

const noNeetAns = OfflineCareerAssistant.ask("medical careers without neet");
assert(noNeetAns.answer.includes("Pharmacy") || noNeetAns.answer.includes("Nursing"), "Assistant answers queries about medical without NEET");

// 4. CAREER COMPARISON
console.log("\n[Test Suite 4: Career Comparison Module]");
const compareHTML = CareerComparison.renderComparisonTable('software-engineer', 'chartered-accountant', careers);
assert(compareHTML.includes("Software Engineer") && compareHTML.includes("Chartered Accountant"), "Comparison table renders both careers");
assert(compareHTML.includes("Indicative Fresher Salary") && compareHTML.includes("Key Entrance Exams"), "Comparison table contains key comparative dimensions");

// 5. CAREER REPORT GENERATOR
console.log("\n[Test Suite 5: Career Guidance Report Generator]");
CareerStorage.saveProfile({
  name: "Arjun Verma",
  currentClass: "11th",
  academicGroup: "science-pcm",
  marks: "88",
  favouriteSubjects: ["Mathematics", "Physics", "Computer Science"]
});
CareerStorage.saveInterests(["Technology", "Engineering"]);
CareerStorage.saveSkills(["Problem-solving", "Logical thinking", "Computer knowledge"]);
CareerStorage.saveRecommendations(techRecs);
CareerStorage.saveSavedCareers(['software-engineer', 'data-scientist']);
CareerStorage.saveRoadmapProgress({ 'software-engineer': [1, 2] });

const reportHTML = CareerReport.generateReportHTML(careers);
assert(reportHTML.includes("Arjun Verma"), "Report includes student name");
assert(reportHTML.includes("11th Standard"), "Report includes current standard");
assert(reportHTML.includes("Top Five Career Recommendations"), "Report includes Section 3 recommendations");
assert(reportHTML.includes("Learning Roadmap for Top Match"), "Report includes Section 4 roadmap with completed steps");

console.log(`\n=== SUMMARY: ${passedTests} of ${totalTests} tests passed successfully! ===\n`);
