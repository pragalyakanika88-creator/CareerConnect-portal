/**
 * CareerConnect Portal - Recommendation Engine
 * Configurable, weighted, explainable offline career recommendation algorithm.
 */

const RecommendationEngine = (function () {
  // Predefined 5 Short Assessment Questions
  const ASSESSMENT_QUESTIONS = [
    {
      id: 1,
      title: "Work Environment Preference",
      question: "Which type of day-to-day work environment would energize you the most?",
      options: [
        {
          id: "A",
          text: "Building digital software, working on computers, and solving algorithmic puzzles.",
          tags: ["Technology"],
          keywords: ["software", "coding", "computers"]
        },
        {
          id: "B",
          text: "Working with machines, physical structures, aviation, or high-tech equipment.",
          tags: ["Engineering"],
          keywords: ["machines", "structures", "hardware"]
        },
        {
          id: "C",
          text: "Hospitals, clinics, or laboratories directly helping sick patients heal.",
          tags: ["Medical", "Healthcare"],
          keywords: ["patients", "healing", "biology"]
        },
        {
          id: "D",
          text: "Corporate offices, financial markets, startup boardrooms, and business strategy.",
          tags: ["Business", "Finance", "Commerce"],
          keywords: ["corporate", "finance", "strategy"]
        },
        {
          id: "E",
          text: "Creative design studios, media houses, or public service and governance.",
          tags: ["Arts and Design", "Government Jobs", "Teaching"],
          keywords: ["creative", "design", "governance"]
        }
      ]
    },
    {
      id: 2,
      title: "Problem Solving Approach",
      question: "When faced with a complex new challenge, what is your natural instinct?",
      options: [
        {
          id: "A",
          text: "Break it down with mathematical logic, computational rules, or step-by-step code.",
          tags: ["Technology", "Engineering"],
          skills: ["Logical thinking", "Problem-solving", "Mathematics"]
        },
        {
          id: "B",
          text: "Investigate scientific causes, examine biological evidence, or run tests.",
          tags: ["Medical", "Healthcare", "Science and Research"],
          skills: ["Analytical thinking", "Helping people"]
        },
        {
          id: "C",
          text: "Analyze financial numbers, calculate costs vs profits, and create budgets.",
          tags: ["Finance", "Commerce", "Business"],
          skills: ["Mathematics", "Analytical thinking"]
        },
        {
          id: "D",
          text: "Sketch creative visual ideas, reimagine the aesthetics, or craft user experiences.",
          tags: ["Arts and Design"],
          skills: ["Creativity", "Drawing and designing"]
        },
        {
          id: "E",
          text: "Discuss with people, negotiate perspectives, or create structured rules for teams.",
          tags: ["Government Jobs", "Teaching", "Business"],
          skills: ["Leadership", "Communication"]
        }
      ]
    },
    {
      id: 3,
      title: "Daily Activity Enjoyment",
      question: "Which of these tasks would you find most satisfying to do every day?",
      options: [
        {
          id: "A",
          text: "Writing programs, building web apps, and automating repetitive tasks.",
          tags: ["Technology"],
          skills: ["Computer knowledge", "Problem-solving"]
        },
        {
          id: "B",
          text: "Examining diagnostic reports, treating injuries, or conducting lab experiments.",
          tags: ["Medical", "Healthcare", "Science and Research"],
          skills: ["Helping people", "Analytical thinking"]
        },
        {
          id: "C",
          text: "Managing investments, auditing corporate books, or closing sales deals.",
          tags: ["Commerce", "Finance", "Business"],
          skills: ["Mathematics", "Leadership"]
        },
        {
          id: "D",
          text: "Designing mobile screens, drawing 3D animations, or styling fashion collections.",
          tags: ["Arts and Design"],
          skills: ["Drawing and designing", "Creativity"]
        },
        {
          id: "E",
          text: "Teaching concepts to learners, administering public policies, or defending the nation.",
          tags: ["Teaching", "Government Jobs"],
          skills: ["Teaching", "Communication", "Leadership"]
        }
      ]
    },
    {
      id: 4,
      title: "Impact & Career Purpose",
      question: "What kind of difference do you ultimately want to make in your career?",
      options: [
        {
          id: "A",
          text: "Inventing intelligent technology, AI tools, and software that power the globe.",
          tags: ["Technology", "Engineering"],
          skills: ["Problem-solving", "Computer knowledge"]
        },
        {
          id: "B",
          text: "Saving lives, curing illnesses, and alleviating physical human pain.",
          tags: ["Medical", "Healthcare"],
          skills: ["Helping people"]
        },
        {
          id: "C",
          text: "Leading companies, expanding businesses, and creating jobs and wealth.",
          tags: ["Business", "Finance", "Commerce"],
          skills: ["Leadership", "Analytical thinking"]
        },
        {
          id: "D",
          text: "Inspiring society through captivating visual design, art, films, and media.",
          tags: ["Arts and Design"],
          skills: ["Creativity", "Drawing and designing"]
        },
        {
          id: "E",
          text: "Protecting citizens, ensuring equal justice, and educating future generations.",
          tags: ["Government Jobs", "Teaching"],
          skills: ["Leadership", "Helping people", "Communication"]
        }
      ]
    },
    {
      id: 5,
      title: "Learning Style & Subject Strength",
      question: "Which combination of subjects or learning styles feels most natural to you?",
      options: [
        {
          id: "A",
          text: "Mathematics, Computer Science, and algorithmic logic.",
          tags: ["Technology", "Engineering"],
          subjects: ["Mathematics", "Computer Science"]
        },
        {
          id: "B",
          text: "Biology, Chemistry, human anatomy, and laboratory experiments.",
          tags: ["Medical", "Healthcare", "Science and Research"],
          subjects: ["Biology", "Chemistry"]
        },
        {
          id: "C",
          text: "Accountancy, Economics, business case studies, and commercial math.",
          tags: ["Commerce", "Finance", "Business"],
          subjects: ["Accountancy", "Economics", "Business Studies"]
        },
        {
          id: "D",
          text: "Fine Arts, sketching, creative writing, and digital media.",
          tags: ["Arts and Design"],
          subjects: ["Fine Arts", "English"]
        },
        {
          id: "E",
          text: "History, Political Science, legal jurisprudence, and social science.",
          tags: ["Government Jobs", "Teaching", "Arts"],
          subjects: ["History / Political Science", "English", "Psychology"]
        }
      ]
    }
  ];

  // Configurable Weights (Sum to 100)
  const WEIGHTS = {
    INTERESTS: 35, // High weight: student's passionate interests
    SKILLS: 25,    // Demonstrated or chosen skills
    STREAM: 20,    // Stream eligibility & group compatibility
    SUBJECTS: 10,  // Favorite subjects overlap
    ASSESSMENT: 10 // 5 Assessment questions bonus
  };

  /**
   * Calculate matching score for a single career
   */
  function scoreCareer(career, studentData) {
    const {
      currentClass = '10th',
      academicGroup = 'general',
      favouriteSubjects = [],
      interests = [],
      skills = [],
      assessmentAnswers = {}
    } = studentData;

    // 1. STREAM & ACADEMIC GROUP COMPATIBILITY (Max 20 pts)
    let streamScore = 0;
    const isClass10 = currentClass === '10th' || academicGroup === 'general';

    if (isClass10) {
      // For 10th students, stream is open; full stream baseline
      streamScore = WEIGHTS.STREAM;
    } else {
      const careerStreams = career.streamMatch || [];
      if (careerStreams.includes('any')) {
        streamScore = WEIGHTS.STREAM;
      } else if (careerStreams.includes(academicGroup)) {
        streamScore = WEIGHTS.STREAM;
      } else {
        // Check partial bridges (e.g. pcmb can enter both pcm and pcb)
        if (academicGroup === 'science-pcmb' && (careerStreams.includes('science-pcm') || careerStreams.includes('science-pcb'))) {
          streamScore = WEIGHTS.STREAM;
        } else if (academicGroup === 'commerce-maths' && careerStreams.includes('commerce')) {
          streamScore = WEIGHTS.STREAM;
        } else {
          // Incompatible stream (e.g. Arts for MBBS or Mechanical Engineering)
          streamScore = 2; // Low compatibility penalty
        }
      }
    }

    // 2. INTERESTS MATCH (Max 35 pts)
    let interestScore = 0;
    const matchedInterests = [];
    if (Array.isArray(interests) && interests.length > 0) {
      const careerInterests = career.interests || [];
      const careerCategory = career.category;

      interests.forEach(intName => {
        let matched = false;
        if (careerInterests.includes(intName)) {
          matched = true;
        } else if (intName === careerCategory) {
          matched = true;
        } else if (intName === 'Technology' && careerCategory === 'Engineering') {
          matched = true;
        } else if (intName === 'Medical' && careerCategory === 'Healthcare') {
          matched = true;
        } else if (intName === 'Healthcare' && careerCategory === 'Medical') {
          matched = true;
        } else if (intName === 'Commerce' && (careerCategory === 'Finance' || careerCategory === 'Business')) {
          matched = true;
        } else if (intName === 'Finance' && (careerCategory === 'Commerce' || careerCategory === 'Business')) {
          matched = true;
        }

        if (matched && !matchedInterests.includes(intName)) {
          matchedInterests.push(intName);
        }
      });

      if (matchedInterests.length === 1) interestScore = 20;
      else if (matchedInterests.length === 2) interestScore = 30;
      else if (matchedInterests.length >= 3) interestScore = 35;
      else interestScore = 5; // Minimal baseline
    } else {
      interestScore = 15;
    }

    // 3. SKILLS MATCH (Max 25 pts)
    let skillScore = 0;
    const matchedSkills = [];
    if (Array.isArray(skills) && skills.length > 0 && Array.isArray(career.requiredSkills)) {
      career.requiredSkills.forEach(reqSkill => {
        if (skills.includes(reqSkill)) {
          matchedSkills.push(reqSkill);
        }
      });
      const ratio = matchedSkills.length / Math.max(career.requiredSkills.length, 1);
      skillScore = Math.min(WEIGHTS.SKILLS, Math.round(ratio * WEIGHTS.SKILLS * 1.3));
      // Give floor if at least 1 skill matched
      if (matchedSkills.length >= 1 && skillScore < 8) skillScore = 8;
    } else {
      skillScore = 10;
    }

    // 4. FAVOURITE SUBJECTS MATCH (Max 10 pts)
    let subjectScore = 0;
    const matchedSubjects = [];
    if (Array.isArray(favouriteSubjects) && favouriteSubjects.length > 0 && Array.isArray(career.favouriteSubjects)) {
      career.favouriteSubjects.forEach(sub => {
        if (favouriteSubjects.includes(sub)) {
          matchedSubjects.push(sub);
        }
      });
      const subRatio = matchedSubjects.length / Math.max(career.favouriteSubjects.length, 1);
      subjectScore = Math.min(WEIGHTS.SUBJECTS, Math.round(subRatio * WEIGHTS.SUBJECTS * 1.5));
      if (matchedSubjects.length >= 1 && subjectScore < 4) subjectScore = 4;
    } else {
      subjectScore = 4;
    }

    // 5. SHORT ASSESSMENT ANSWERS (Max 10 pts)
    let assessmentScore = 0;
    ASSESSMENT_QUESTIONS.forEach(q => {
      const selectedOptionId = assessmentAnswers[q.id];
      if (selectedOptionId) {
        const option = q.options.find(o => o.id === selectedOptionId);
        if (option && option.tags) {
          const hasTag = option.tags.some(t =>
            (career.interests && career.interests.includes(t)) ||
            career.category === t
          );
          if (hasTag) {
            assessmentScore += 2;
          }
        }
      }
    });
    assessmentScore = Math.min(WEIGHTS.ASSESSMENT, assessmentScore);

    // TOTAL RAW SCORE (0 to 100)
    const rawScore = streamScore + interestScore + skillScore + subjectScore + assessmentScore;

    // NORMALIZE MATCH PERCENTAGE (between 45% and 98%)
    // Scale raw score so that strong matches feel realistic (85-98%)
    let matchPercentage = Math.round(rawScore * 0.94 + 5);
    if (matchPercentage > 98) matchPercentage = 98;
    if (matchPercentage < 42) matchPercentage = 42;

    // Generate personalized "Why it suits you" text
    const reasons = [];
    if (matchedInterests.length > 0) {
      reasons.push(`Directly matches your interest in ${matchedInterests.slice(0, 2).join(' and ')}.`);
    }
    if (matchedSkills.length > 0) {
      reasons.push(`Leverages your strengths in ${matchedSkills.slice(0, 3).join(', ')}.`);
    }
    if (matchedSubjects.length > 0) {
      reasons.push(`Builds naturally upon your favorite subject ${matchedSubjects[0]}.`);
    }
    if (streamScore === WEIGHTS.STREAM) {
      reasons.push(`Fully aligned with your current academic stream.`);
    }

    const whySuitsYou = reasons.length > 0
      ? reasons.join(' ')
      : career.whySuits;

    return {
      careerId: career.id,
      careerTitle: career.title,
      category: career.category,
      matchPercentage,
      rawScore,
      scoreBreakdown: {
        streamScore,
        interestScore,
        skillScore,
        subjectScore,
        assessmentScore
      },
      matchedInterests,
      matchedSkills,
      matchedSubjects,
      whySuitsYou
    };
  }

  /**
   * Recommend TOP FIVE Careers based on student data
   */
  function getRecommendations(studentData, careersData = (typeof CAREERS_DATA !== 'undefined' ? CAREERS_DATA : [])) {
    if (!Array.isArray(careersData) || careersData.length === 0) {
      return [];
    }

    const scored = careersData.map(career => {
      const matchDetails = scoreCareer(career, studentData);
      return {
        ...career,
        ...matchDetails
      };
    });

    // Sort descending by matchPercentage, then rawScore
    scored.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return b.rawScore - a.rawScore;
    });

    // Return Top 5
    return scored.slice(0, 5);
  }

  return {
    getAssessmentQuestions() {
      return ASSESSMENT_QUESTIONS;
    },
    getWeights() {
      return { ...WEIGHTS };
    },
    scoreCareer,
    getRecommendations
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecommendationEngine;
}
