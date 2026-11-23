# CareerConnect Portal 🎓
> **Discover Your Interest. Choose Your Career.**

CareerConnect Portal is a complete, professional, simple-to-use, and **100% offline** career guidance web platform built specifically for **10th, 11th, and 12th standard school students**.

It helps students understand what to study after 10th or 12th standard, which career paths align with their natural talents, which college degrees and entrance exams are required in India, and how to prepare step-by-step for future employment.

---

## 🌟 Key Highlights & Architecture

- **100% Offline by Design**: Operates entirely on any laptop without internet access, external CDNs, cloud AI APIs, remote fonts, or online database calls.
- **Zero External Dependencies**: Built with pure HTML5, modern CSS3 variables, and vanilla ES6+ JavaScript. All icons are embedded SVGs.
- **Rich Database of 46 Careers**: Contains 46 richly detailed, realistic career profiles across Engineering, Technology, Medical, Healthcare, Science, Commerce, Finance, Business, Arts, Design, Government Services, Teaching, and Scientific Research.
- **Configurable Recommendation Engine**: An offline weighted matching algorithm that evaluates academic stream compatibility (20%), core interests (35%), self-assessed skills (25%), favorite subjects (10%), and 5 strength assessment questions (10%).
- **Interactive Educational Roadmaps**: Step-by-step milestone checklists for every career (e.g. from 12th board exams to college admission, skill building, internships, and job placement) with clickable checkboxes that save progress in browser `localStorage`.
- **Offline Career Assistant**: A local, pre-compiled knowledge base that answers frequently asked student questions regarding stream selection after 10th, medical careers without NEET, BCA vs B.Tech, UPSC preparation, pilot training, and career profile lookups.
- **Career Comparison Matrix**: Side-by-side comparison of any two careers across eligibility, course options, durations, entrance exams, skills, and indicative fresher/experienced salaries in India.
- **Personalized Printable Report**: Generates a clean, comprehensive guidance document formatted with dedicated `@media print` CSS for saving to PDF or printing.
- **Student Dashboard**: Visual tracking of student profile, top matches, bookmarked careers, and learning roadmap progress.

---

## 📂 Project Structure

```
CareerConnect portal/
│
├── index.html                  # Main SPA container & view templates
│
├── css/
│   └── styles.css              # Professional blue & white theme, responsive grid, print styles
│
├── js/
│   ├── careers-data.js         # Comprehensive 46 career profiles database
│   ├── storage.js              # LocalStorage state management layer
│   ├── recommendation-engine.js# 5-question assessment & weighted scoring algorithm
│   ├── assistant.js            # Predefined offline FAQ knowledge base & career lookup
│   ├── comparison.js           # Side-by-side career comparison matrix
│   ├── report.js               # Printable career guidance report generator
│   └── app.js                  # App router, wizard stepper, modal & event controller
│
├── data/
│   └── careers.json            # JSON export of the 46 career profiles
│
├── build-data.js               # Database compiler script
├── test-suite.js               # Comprehensive 31-point automated test suite
└── README.md                   # Project documentation
```

---

## 🚀 How to Run the Website (100% Offline)

1. **Direct Browser Launch (Easiest)**:
   - Double-click on `index.html` in file explorer.
   - It will open instantly in your default web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
   - No web server or software installation needed!

2. **Optional Local Static Server**:
   If you have Python or Node installed, you can also serve it locally:
   ```bash
   # Using Node (npx)
   npx serve .
   
   # Or using Python 3
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

---

## 🧭 Student Journey Workflow

The student journey is kept simple, intuitive, and distraction-free:

1. **Step 1 – Home Page**: Welcome hero banner, mission overview, and quick links to start the journey or explore the database.
2. **Step 2 – Basic Details**: Name, current class (10th, 11th, 12th), academic stream (General, Science PCM, PCB, PCMB, Commerce, Arts), optional percentage, and favorite subjects.
3. **Step 3 – Interest Selection**: Interactive selectable cards covering 10 major fields (maximum of 3 selections allowed).
4. **Step 4 – Skills Selection**: Multiple-choice strength chips (Problem-solving, Creativity, Leadership, Logical thinking, Mathematics, Helping people, etc.).
5. **Step 5 – Short Assessment**: Exactly 5 simple multiple-choice questions displayed one at a time with a live progress bar and previous/next navigation.
6. **Step 6 – Top 5 Recommendations**: Calculated weighted match scores showing top 5 careers with match percentage, "Why it suits you" personalized reasoning, entrance exams, indicative salaries, and a direct link to view full details.

---

## ⚖️ Recommendation Scoring Model

The matching engine uses a transparent, explainable formula (0 to 100 points):

$$\text{Score} = \text{Interests (35\%)} + \text{Skills (25\%)} + \text{Academic Stream (20\%)} + \text{Subjects (10\%)} + \text{Assessment (10\%)}$$

- **Stream Compatibility (20 pts)**: Verifies whether the student's current stream legally satisfies course eligibility (e.g. Science PCB for MBBS). For 10th standard students, stream eligibility is neutral to help them pick their upcoming 11th standard stream.
- **Interests Overlap (35 pts)**: Proportional match between student's chosen interests and the career's primary domains.
- **Skills Overlap (25 pts)**: Ratio of required career strengths matched by the student.
- **Favorite Subjects (10 pts)**: Affinity between school subjects enjoyed and career coursework.
- **Assessment Affinity (10 pts)**: Bonus points based on real work preference choices from the 5 questions.
- **Match Normalization**: Raw scores are mapped to a realistic 42%–98% scale.

---

## 🧪 Testing and Verification

Run the automated test suite anytime using Node:
```bash
node test-suite.js
```
The test suite validates:
- Schema completeness across all 46 career profiles.
- Representation of all 12 requested career disciplines.
- Recommendation algorithm accuracy across diverse student personas.
- Offline assistant FAQ matching and career profile lookup.
- Comparison matrix rendering.
- Career report data binding.

---

## 🔒 Offline & Privacy Guarantee

- **Zero Cloud Tracking**: All student data, answers, saved bookmarks, and roadmap progress stay exclusively within your computer's browser `localStorage`.
- **No Internet Required**: Continue exploring, taking assessments, comparing careers, and reading roadmaps with the internet completely disconnected.

---
*CareerConnect Portal — Empowering Indian high school students to make confident, informed career decisions.*
