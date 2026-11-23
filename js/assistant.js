/**
 * CareerConnect Portal - Offline Career Assistant Knowledge Base
 * 100% offline knowledge base containing pre-compiled answers to common career questions,
 * stream selection guidance, entrance exams, and career lookups for Indian students.
 */

const ASSISTANT_KNOWLEDGE_BASE = [
  {
    keywords: ["10th", "after 10th", "which stream", "stream selection", "pcm vs pcb", "commerce vs science", "choose stream"],
    question: "How should I choose my stream after 10th standard?",
    answer: `Choosing your stream after 10th depends on your genuine interests, aptitude, and long-term career aspirations:
• <strong>Science (PCM):</strong> Best if you enjoy mathematics, physics, computing, engineering, architecture, or aviation. Opens doors to B.Tech, BCA, Data Science, and Defense (NDA).
• <strong>Science (PCB):</strong> Best if you are drawn to biology, medicine, healthcare, pharma, or biotechnology. Required for MBBS, BDS, BAMS, BPT, and Nursing.
• <strong>Science (PCMB):</strong> Combines both PCM & PCB, keeping all engineering and medical doors open, but requires high study discipline.
• <strong>Commerce:</strong> Ideal if you enjoy economics, financial numbers, business models, and trade. Leads to CA, CS, CMA, Investment Banking, B.Com, and BBA.
• <strong>Arts / Humanities:</strong> Excellent for law, civil services (UPSC), psychology, journalism, graphic design, and public administration.`
  },
  {
    keywords: ["doctor", "mbbs", "without neet", "medical without neet", "neet"],
    question: "Can I enter the medical and healthcare field without NEET?",
    answer: `Yes, absolutely! While <strong>NEET-UG</strong> is compulsory for MBBS, BDS, BAMS, and BHMS in India, there are rewarding allied healthcare careers that do not require NEET:
• <strong>Bachelor of Pharmacy (B.Pharm):</strong> Admission via state pharmacy CETs or merit. Leads to pharmaceutical formulation and clinical research.
• <strong>B.Sc in Nursing:</strong> Many state universities and private hospitals admit based on 12th PCB marks or state nursing entrances.
• <strong>B.Sc Medical Laboratory Technology (BMLT):</strong> Operates pathology and molecular diagnostic labs.
• <strong>B.Sc Radiologic & Imaging Technology:</strong> Operates MRI, CT scan, and X-ray systems.
• <strong>Clinical Psychology:</strong> Accessible from any stream (BA/B.Sc Psychology) without NEET.
• <strong>Biotechnology / Biomedical Science:</strong> Focuses on genetic engineering and vaccine development.`
  },
  {
    keywords: ["bca vs btech", "bca or b.tech", "btech or bca", "software without pcm", "coding without math"],
    question: "What is the difference between B.Tech CSE and BCA?",
    answer: `Both degrees lead to successful careers in software development and IT, but they differ in focus and eligibility:
• <strong>B.Tech in CSE:</strong> 4-year engineering program. Requires Class 12 with PCM. Strong focus on computer hardware, operating systems, mathematical algorithms, and engineering theory. Top tech campus placements often prioritize B.Tech.
• <strong>BCA (Bachelor of Computer Applications):</strong> 3-year application-focused degree. Open to students from Commerce, Arts, or Science (often requires 12th math or computer science, though many colleges accept any stream). Focuses on web development, databases, and software languages.
• <em>Tip:</em> BCA students can match B.Tech placement opportunities by pursuing an MCA or building strong open-source GitHub coding portfolios.`
  },
  {
    keywords: ["upsc", "ias", "ips", "civil services", "government job after 12th", "prepare for upsc"],
    question: "How do I prepare for UPSC Civil Services (IAS / IPS)?",
    answer: `To become an IAS or IPS officer through UPSC CSE:
1. <strong>Eligibility:</strong> You must complete graduation in <em>any stream</em> (BA, B.Com, B.Sc, B.Tech, MBBS) and be at least 21 years old.
2. <strong>During School (10th-12th):</strong> Build strong daily habits: read national newspapers (The Hindu or Indian Express), understand Indian geography and history, and master NCERT textbooks.
3. <strong>Degree Selection:</strong> Choose a graduation subject you genuinely love and can consider as your optional subject (e.g. Political Science, History, Economics, or Engineering).
4. <strong>Three-Tier Exam:</strong>
   • <em>Prelims:</em> Objective tests (GS 1 + CSAT).
   • <em>Mains:</em> 9 descriptive written papers (Essay, GS 1-4, Optional 1 & 2, and language papers).
   • <em>Personality Test (Interview):</em> Tests integrity, judgment, and mental alertness.`
  },
  {
    keywords: ["pilot", "commercial pilot", "how to become pilot", "aviation", "flying"],
    question: "How can I become a Commercial Airline Pilot in India?",
    answer: `To become an airline pilot in India:
1. <strong>Academic Eligibility:</strong> Pass Class 12 with Physics and Mathematics (minimum 50% aggregate).
2. <strong>Medical Fitness:</strong> Clear DGCA Class 2 medical exam, followed by the rigorous Class 1 medical test with DGCA-empaneled medical examiners.
3. <strong>Training Routes:</strong>
   • <em>Cadet Pilot Program:</em> Airline-sponsored programs (IndiGo, Air India) with letter of intent for employment upon completion.
   • <em>Conventional Route:</em> Join a DGCA-approved Flying Training Organization (e.g. IGRUA Amethi or international flying academies).
4. <strong>Flight Hours:</strong> Complete 200 hours of flying time (single-engine, multi-engine, instrument, and night flying).
5. <strong>Theory Exams:</strong> Clear 5 DGCA ground theory exams (Air Navigation, Meteorology, Air Regs, etc.).
6. <strong>Commercial Pilot License (CPL):</strong> Obtain CPL and complete Type Rating on Airbus A320 or Boeing 737 to join an airline.`
  },
  {
    keywords: ["commerce", "best career in commerce", "high paying commerce", "without maths commerce"],
    question: "What are the best career options in Commerce?",
    answer: `Commerce offers prestigious and high-paying professional pathways:
• <strong>Chartered Accountant (CA):</strong> The gold standard in auditing, corporate taxation, and CFO roles. Handled by ICAI.
• <strong>Investment Banking & Financial Analysis:</strong> Mergers & acquisitions, stock markets, and equity research. Highly lucrative after B.Com/BBA + CFA or IIM MBA.
• <strong>Company Secretary (CS):</strong> Corporate governance and legal compliance under ICSI.
• <strong>Certified Management Accountant (CMA):</strong> Industrial costing, pricing strategy, and manufacturing profitability.
• <strong>Actuarial Science:</strong> High-math risk assessment for insurance and pension giants.
• <strong>BBA / Integrated IPM at IIMs:</strong> 5-year direct management programs at IIM Indore and Rohtak right after Class 12.`
  },
  {
    keywords: ["design", "ui ux", "nid", "uceed", "creative careers", "graphic design"],
    question: "How can I build a career in Design (UI/UX, Graphic, Product)?",
    answer: `Creative design has evolved into a high-demand tech and product discipline:
• <strong>Entrance Exams after 12th:</strong>
   • <em>UCEED:</em> Entrance for B.Des programs at IIT Bombay, IIT Delhi, IIT Guwahati, and IIITDM Jabalpur.
   • <em>NID DAT:</em> National Institute of Design Prelims & Mains for industrial and communication design.
   • <em>NIFT:</em> For fashion, textile, and accessory design.
• <strong>UI/UX Design:</strong> One of the fastest-growing tech roles. Involves researching user behavior and designing mobile app interfaces in Figma. Open to all streams!
• <strong>Portfolio Matters Most:</strong> Unlike traditional degrees, design hiring depends 80% on your creative portfolio (Behance, Dribbble, Figma case studies) and only 20% on certificates.`
  },
  {
    keywords: ["nda", "defense", "army", "navy", "air force", "join army after 12th"],
    question: "How can I join the Indian Armed Forces after Class 12?",
    answer: `The primary pathway to become a commissioned military officer right after school is the <strong>National Defence Academy (NDA)</strong>:
• <strong>Eligibility:</strong>
   • <em>Army Wing:</em> Class 12 pass in any stream (Arts, Commerce, or Science).
   • <em>Air Force & Naval Wings:</em> Class 12 with Physics and Mathematics.
   • Unmarried male and female candidates aged 16.5 to 19.5 years.
• <strong>Selection Process:</strong>
   1. UPSC NDA Written Exam (Mathematics 300 marks + General Ability 600 marks).
   2. 5-Day SSB (Services Selection Board) interview assessing officer-like qualities (OLQs).
   3. Strict Military Medical Board examination.
• <strong>Training:</strong> 3 years at NDA Khadakwasla (Pune), followed by 1 year at IMA (Dehradun), INA (Ezhimala), or AFA (Dundigal).`
  },
  {
    keywords: ["isro", "drdo", "scientist", "scientific research", "become a scientist"],
    question: "How do I become a Research Scientist at ISRO or DRDO?",
    answer: `To become a scientist at national research organizations like ISRO or DRDO:
1. <strong>After 12th Science (PCM):</strong>
   • Appear for <em>JEE Advanced</em> and join <strong>IIST (Indian Institute of Space Science and Technology)</strong> in Thiruvananthapuram. Top graduates from IIST are absorbed directly into ISRO centers!
   • Crack <em>IAT (IISER Aptitude Test)</em> or <em>NEST</em> for 5-Year BS-MS dual degree programs at IISc Bangalore or IISERs.
2. <strong>Through Engineering (B.Tech):</strong> Complete B.Tech in Aerospace, Mechanical, Electrical, CSE, or Electronics with first class honors (minimum 65%), then appear for <strong>ISRO ICRB exam</strong> or <strong>GATE</strong> for DRDO Scientist 'B' posts.
3. <strong>Through Pure Sciences:</strong> Complete B.Sc + M.Sc + Ph.D in Physics, Chemistry, or Mathematics and qualify CSIR-NET JRF.`
  },
  {
    keywords: ["salary", "highest paying", "best salary", "top package"],
    question: "Which careers offer the highest indicative starting salaries in India?",
    answer: `While passion and skills matter most, these fields historically command high starting and experienced compensation in the Indian market:
1. <strong>Investment Banking & Corporate Finance:</strong> ₹9.0 - ₹20.0 LPA fresher; ₹30+ LPA experienced.
2. <strong>Commercial Airline Pilots:</strong> ₹15.0 - ₹25.0 LPA starting First Officer salary.
3. <strong>Data Science & AI Engineering:</strong> ₹6.0 - ₹12.0 LPA fresher; ₹25+ LPA experienced.
4. <strong>Software Engineering (Tier-1 Product / Big Tech):</strong> ₹6.0 - ₹15.0 LPA fresher; ₹25+ LPA experienced.
5. <strong>Management Consulting (MBB / Top IIM MBA):</strong> ₹12.0 - ₹28.0 LPA starting.
6. <strong>Chartered Accountancy (Rank Holders):</strong> ₹8.0 - ₹15.0 LPA fresher.
7. <strong>Specialist Surgeons / Medical MDs:</strong> High lifetime earning potential and private clinical independence.
<em>Note: All salaries are indicative and depend on institution pedigree, demonstrated skills, and economic conditions.</em>`
  }
];

const OfflineCareerAssistant = (function () {
  /**
   * Find matching response for user's query
   */
  function ask(query, careersData = (typeof CAREERS_DATA !== 'undefined' ? CAREERS_DATA : [])) {
    if (!query || typeof query !== 'string') {
      return {
        answer: "Please enter a career question or keyword (e.g., 'What stream after 10th?', 'How to become a pilot?', or search for any career like 'Data Scientist').",
        type: 'general',
        suggestions: getQuickQuestions()
      };
    }

    const cleanQuery = query.toLowerCase().trim();

    // 1. Check for specific career match by title or slug or title segments
    if (Array.isArray(careersData) && careersData.length > 0) {
      const matchedCareer = careersData.find(c => {
        const titleLower = c.title.toLowerCase();
        const idLower = c.id.toLowerCase();
        const segments = titleLower.split(/[/,&()]/).map(s => s.trim()).filter(s => s.length > 3);

        return cleanQuery.includes(idLower) ||
               cleanQuery.includes(titleLower) ||
               titleLower.includes(cleanQuery) ||
               segments.some(seg => cleanQuery.includes(seg));
      });

      if (matchedCareer) {
        return {
          answer: `Here is a quick summary for <strong>${matchedCareer.title}</strong> (${matchedCareer.category}):<br><br>
• <strong>About:</strong> ${matchedCareer.shortDescription}<br>
• <strong>Eligibility:</strong> ${matchedCareer.eligibility}<br>
• <strong>Required Qualification:</strong> ${matchedCareer.requiredQualification}<br>
• <strong>Entrance Exams:</strong> ${matchedCareer.entranceExams.join(', ')}<br>
• <strong>Indicative Fresher Salary:</strong> ${matchedCareer.salaryFresher}<br>
• <strong>Future Scope:</strong> ${matchedCareer.futureScope.substring(0, 160)}...<br><br>
<em>You can click the career card in 'Explore Careers' or your recommendations to view the complete 10-section breakdown and interactive learning roadmap!</em>`,
          type: 'career_lookup',
          careerId: matchedCareer.id,
          suggestions: getQuickQuestions()
        };
      }
    }

    // 2. Check FAQ Knowledge Base using keyword score
    let bestMatch = null;
    let highestScore = 0;

    ASSISTANT_KNOWLEDGE_BASE.forEach(entry => {
      let score = 0;
      entry.keywords.forEach(kw => {
        if (cleanQuery.includes(kw)) {
          score += kw.length; // longer matching phrases get higher weight
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    });

    if (bestMatch && highestScore > 0) {
      return {
        answer: bestMatch.answer,
        type: 'faq_match',
        matchedQuestion: bestMatch.question,
        suggestions: getQuickQuestions()
      };
    }

    // 3. Fallback answer with helpful offline prompt
    return {
      answer: `I am an <strong>Offline Career Assistant</strong> running 100% locally on your laptop without internet access.<br><br>
I can help you with:
• Choosing streams after 10th (Science PCM/PCB, Commerce, Arts)
• Medical and Engineering entrance exams (NEET, JEE, BITSAT)
• Commercial pilot training, Defense NDA, UPSC Civil Services
• Careers in Design, UI/UX, Law, CA, and Data Science
• Looking up any of the 46 career profiles in this portal.<br><br>
Try clicking one of the suggested topics below or typing a specific question!`,
      type: 'fallback',
      suggestions: getQuickQuestions()
    };
  }

  function getQuickQuestions() {
    return [
      "How to choose stream after 10th?",
      "Medical careers without NEET?",
      "Difference between BCA and B.Tech?",
      "How to become a commercial pilot?",
      "Best careers in Commerce?",
      "How to join NDA after 12th?",
      "How to prepare for UPSC IAS?",
      "Highest paying careers in India?"
    ];
  }

  return {
    ask,
    getQuickQuestions,
    getKnowledgeBase() {
      return ASSISTANT_KNOWLEDGE_BASE;
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ASSISTANT_KNOWLEDGE_BASE, OfflineCareerAssistant };
}
