import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Calendar, CheckSquare, Shield, Map as MapIcon, 
  GraduationCap, ShieldCheck, Briefcase, Eye, Moon, FileText, 
  Menu, X, Moon as MoonIcon, Sun, ChevronDown, ChevronRight, Search, Check
} from 'lucide-react';

// --- INITIAL DATA SEEDING ---

const initialChecklists = {
  Morning: [
    { id: 'm1', text: 'Strength Training', completed: false },
    { id: 'm2', text: 'Water', completed: false },
    { id: 'm3', text: 'Protein Breakfast', completed: false },
    { id: 'm4', text: 'Review Schedule', completed: false }
  ],
  School: [
    { id: 's1', text: 'Attend Classes', completed: false },
    { id: 's2', text: 'Complete Assignments', completed: false },
    { id: 's3', text: 'Review Notes', completed: false }
  ],
  Career: [
    { id: 'c1', text: 'Security+', completed: false },
    { id: 'c2', text: 'AWS', completed: false },
    { id: 'c3', text: 'GitHub', completed: false },
    { id: 'c4', text: 'Portfolio', completed: false }
  ],
  Health: [
    { id: 'h1', text: 'Walk', completed: false },
    { id: 'h2', text: 'Mobility', completed: false },
    { id: 'h3', text: 'Nutrition', completed: false },
    { id: 'h4', text: 'Sleep Preparation', completed: false }
  ],
  Connection: [
    { id: 'con1', text: 'Family', completed: false },
    { id: 'con2', text: 'Friends', completed: false },
    { id: 'con3', text: 'Community', completed: false }
  ],
  Evening: [
    { id: 'e1', text: 'Prepare Tomorrow', completed: false },
    { id: 'e2', text: 'Reflection', completed: false },
    { id: 'e3', text: 'Bedtime Routine', completed: false }
  ]
};

const initialSchedule = {
  Monday: [{ id: 'mon1', time: '11:00 AM', activity: 'MATH 263' }, { id: 'mon2', time: '12:30 PM', activity: 'ITEC 315' }, { id: 'mon3', time: '6:00 PM', activity: 'Security+' }],
  Tuesday: [{ id: 'tue1', time: '', activity: 'Assignments' }, { id: 'tue2', time: '', activity: 'AWS Study Block' }, { id: 'tue3', time: '7:00 PM', activity: 'ITEC 357' }],
  Wednesday: [{ id: 'wed1', time: '11:00 AM', activity: 'MATH 263' }, { id: 'wed2', time: '12:30 PM', activity: 'ITEC 315' }, { id: 'wed3', time: '2:00 PM', activity: 'Therapy' }, { id: 'wed4', time: '6:00 PM', activity: 'Security+' }],
  Thursday: [{ id: 'thu1', time: '', activity: 'AWS Study Block' }, { id: 'thu2', time: '', activity: 'Portfolio Block' }, { id: 'thu3', time: '', activity: 'Assignments' }],
  Friday: [{ id: 'fri1', time: '11:00 AM', activity: 'MATH 263' }, { id: 'fri2', time: '6:00 PM', activity: 'Security+' }],
  Saturday: [{ id: 'sat1', time: '', activity: 'Catch Up' }, { id: 'sat2', time: '', activity: 'Life Administration' }, { id: 'sat3', time: '', activity: 'Optional Social Activity' }],
  Sunday: [{ id: 'sun1', time: '', activity: 'Weekly Planning' }, { id: 'sun2', time: '', activity: 'Reset' }, { id: 'sun3', time: '', activity: 'Recovery' }]
};

const initialDegreePlan = [
  { term: 'Fall 2026', courses: [{ id: 'f26-1', code: 'ITEC 315', completed: false }, { id: 'f26-2', code: 'MATH 263', completed: false }, { id: 'f26-3', code: 'ITEC 357', completed: false }] },
  { term: 'Spring 2027', courses: [{ id: 's27-1', code: 'ITEC 411', completed: false }, { id: 's27-2', code: 'ITEC 345', completed: false }, { id: 's27-3', code: 'ITEC 325', completed: false }] },
  { term: 'Summer 2027', courses: [{ id: 'su27-1', code: 'ITEC 397 Internship', completed: false }, { id: 'su27-2', code: 'ITEC 423', completed: false }] },
  { term: 'Fall 2027', courses: [{ id: 'f27-1', code: 'CIS 435', completed: false }, { id: 'f27-2', code: 'ITEC 217', completed: false }, { id: 'f27-3', code: 'ENGL 317', completed: false }] }
];

const initialVisionGoals = [
  { category: 'Peace, Healing & Emotional Well-Being', goals: ["Improve my thought patterns", "Improve my behavior that stems from my thoughts", "Add good habits to my life that will genuinely help and fit me", "Learn where my self sabotage comes from. Implement some stops to decrease it", "Use my time and energy more wisely", "Practice releasing shame", "Remind myself what I’m grateful for", "Discover and increase joy", "Be content and make adjustments accordingly", "Improve my sleep and bedtime routine so I have more energy and feel less tired", "Continue therapy and learning how to manage depressive episodes and anxiety", "Practice not identifying myself as a problem and just recognize the problem", "Create systems that are sustainable not just organized", "When depressive episodes occur, return to my support systems instead of isolating.", "Treat setbacks as information rather than proof of failure.", "Allow myself periods of rest without abandoning my larger goals."] },
  { category: 'Physical Health, Vitality & Confidence', goals: ["Work at a body recomp.", "Continue even when progress feels slow", "Use increased energy as a marker", "Decrease my pain", "Learn how to defend myself and have better awareness of my surroundings", "Learn how to swim to save my life or someone else", "Increase my hiking endurance.", "Take a pole dancing class", "Improve how to walk in heels", "Improve my posture.", "Practice at the gun range.", "Continue learning how to sail a sailboat and lead a small crew", "Invest in my appearance because I like looking good and feeling good", "Maintain my preventive care to ensure as I age I’m as healthy as I can possibly be", "Build and maintain mobility, muscle and strength to make sure I can function independently as an older person and enjoy my golden years"] },
  { category: 'Learning, Growth & Mastery', goals: ["Finish my Bachelor's degree.", "Obtain my Security+ certification", "Earn AWS Solutions Architect certification.", "Become fluent in Spanish through immersion", "Improve my communication skills: speech and written", "Find the spots that have clothes that fit my body and aesthetic", "Learn and play golf and tennis", "Learn sewing", "Take a cooking lesson", "Continue learning about nutrition and what works for my body"] },
  { category: 'Career & Business', goals: ["Build a personal brand and client base.", "Learn and implement delegating and having collaboration partners", "Independent Cloud Architect Consultant focused on migrations and support.", "Develop a tech project portfolio focused on real life solutions: automation, global scale, etc", "Contribute to Git Hub.", "Write an essay and have it published", "Start a Substack for women 40 and up who want to pivot into technology", "Build a support team of allies, mentors, and a professional sponsor"] },
  { category: 'Financial Freedom, Stability & Ownership', goals: ["Secure a strategic contract job to fund becoming an independent private contractor.", "Save a substantial, protective nest egg.", "Review finances regular and remain flexible", "Bypass full-time traditional employment completely.", "Become financially literate.", "File Chapter 7 this year to clean the slate, heal, and strategically scale finances through investment.", "Build $200,000+ across real estate, investments, and liquid funds.", "Establish and scale robust business credit.", "Fully utilize available financial programs and veteran benefits.", "Increase my VA disability", "Strategically transition from VASH to homeownership.", "Command diversified capital portfolios that generate continuous passive abundance.", "Purchase a piece of land and commercial property.", "Protect wealth"] },
  { category: 'Love, Partnership & Intimacy', goals: ["Take purposeful time away from dating to prepare for my lifetime partner.", "Walk away quickly from anyone who doesn’t align with values", "Meet a compatible partner who makes me feel safe, desired, and adored.", "Maintain my strong sense of self while creating space for them to join.", "Decrease my anxiety, suspicion, and doubt by becoming a more secure partner", "Embrace complete freedom of sexual expression with an aligned partner.", "Learn how to handle conflict with my partner", "Negotiate the small things. Pick your battles"] },
  { category: 'Family & Connections', goals: ["Protect my peace by vetting whose voices and opinions I respect.", "Establish healthy boundaries and dynamics with my daughter.", "Learn how to be a mom to a young adult. Seek support as needed", "Establish better time and energy boundaries with my mom", "Intentionally invest time in maintaining friendships", "Check in more with people I care about", "Work through misunderstandings when appropriate instead of withdrawing", "Be more involved in my niece's life.", "Host a family trip and getaway with my mom.", "Incorporate my kittens' lives into my plans.", "Build a tight tribe of 2–3 close, progressive, and non-judgmental friends.", "Have an accountability partner", "Grow a community of friends and network", "Belong to healing communities", "Surround myself with healthy-minded individuals who laugh until their stomachs hurt, are serious yet open-minded, young-hearted, and light enough to have fun and try new things.", "Engage in community activities, social groups, book clubs, and other special interests"] },
  { category: 'Home, Environment & Daily Life', goals: ["Declutter, organize, and build functional, intentional systems that work for how I operate.", "Make self-care, hobbies, and travel non-negotiable.", "When financially ready, hire a cleaning person", "Protect time for slow mornings and freshly cooked nourishing meals.", "I want to be at peace where cooking or preparing food is a part of my peace, and I do not want to meal prep, eat junk food, or processed food.", "Buy a cozy, high-ceiling home with natural light, hardwood floors, large kitchen with island and built-in bookshelves.", "Build an art collection, create a workout and crafting area (including a sewing machine), and create an area to display and listen to music.", "Design a family room for hosting family and friends, for movies and games.", "Build an enclosed outdoor sanctuary out back to meditate, read, and escape, including fruit trees and a small koi pond.", "Live within short driving distance to a beach", "Live in a safe, fun, and culturally rich neighborhood and city", "Drive a BMW", "Prioritize slow mornings and an intentional life over busyness and hustle.", "Designed for Sovereign Living"] },
  { category: 'Travel, Adventure & Exploration', goals: ["Live abroad for 90 days a piece: Thailand, Portugal, and Colombia", "Set foot on every US state.", "Journey through Brazil, Italy, Ghana, Cuba, France, Japan, Korea, Philippines, Netherlands, Norway, London, and Canada.", "Visit sacred temples and beautiful, historic landmarks.", "Capture nature and wildlife through photography.", "Experience the magic of meeting an orca and seeing whales up close."] },
  { category: 'Spirituality, Values & Alignment', goals: ["Live a spiritual life free from tradition religion", "Implement practices from diverse cultures", "I want to use technology responsibly and intentionally, especially AI.", "Start closing the gap between my reality and the life I want to live as much as I can until death", "Reserve grace and second chances for myself and people who do not inflict harm on me", "Establish my personal boundaries and stand by them.", "Right any wrongs I have inflicted on others."] },
  { category: 'Service, Legacy & Impact', goals: ["Volunteer in genealogy to help the African American community trace their lineage and build their trees.", "Volunteer with marine animals.", "Leave behind a legacy to my daughter and nieces that you never stop and that you can restart as many times and that you can build a life you want and that healing and knowing yourself will take you further than any other external advice anyone can give you. Trust yourself and get support when needed.", "Expect seasons of progress and seasons of recovery.", "Restart as many times as necessary.", "Trust that temporary setbacks do not determine the rest of my life."] },
  { category: 'Identity', goals: ["Feel at home in my body and life", "Reignite exploration and curiosity", "Know I’m deserving of a abundant life."] }
].map(cat => ({
  category: cat.category,
  goals: cat.goals.map((g, i) => ({ id: `${cat.category.substring(0,3)}-${i}`, text: g, status: 'Active' }))
}));

const initialCareers = {
  'Junior Cloud Architect': {
    title: 'Junior Cloud Architect / Practice Architect – GCP & AWS Cloud Infrastructure',
    education: 'Bachelor’s degree in Computer Science, Applied Information Technology, or a closely related technical engineering discipline.',
    certifications: 'AWS/GCP foundational or associate.',
    skills: 'Cloud infrastructure platforms (AWS/GCP), configuration files (YAML), scripting languages (Python/Bash), containerization basics (Docker/Kubernetes), continuous integration tooling.',
    experience: '3 to 5 years of strictly dedicated enterprise cloud architecture experience generally requested.',
    paths: 'Work-study (TU OTS/AWS resources), Internships (Cloud Engineering/DevOps), Junior titles (Junior Cloud Support Associate, IT Infrastructure Specialist, Cloud Operations Technician).',
    transferable: '13+ years of production IT experience. Lead for cloud-based virtual lab serving 28k customers. Linux CLI, database administration, hands-on serverless AWS refactoring (S3, Lambda, API Gateway, DynamoDB).',
    notes: 'Fits precisely with my 13+ years of experience. Allows transition from reactive support to proactive design. Fully remote/asynchronous nature accommodates PTSD well.'
  },
  'Associate Solutions Architect': {
    title: 'Associate Solutions Architect',
    education: 'Bachelor’s degree in Computer Science, Information Systems, or Applied Information Technology (Graduation Aug 2024 - Aug 2026).',
    certifications: 'AWS Cloud Practitioner or Associate certification.',
    skills: 'Practical experience applying established frameworks and design patterns to deliver working software. Excellent, articulate communication skills.',
    experience: 'Prioritizes verified foundational knowledge, academic projects, and professional communication abilities over decades of legacy infrastructure tenure.',
    paths: 'Internships (client-facing IT consulting or systems integration), Junior titles (Junior Cloud Migration Analyst, Technical Support Specialist Tier 2, Cloud Technical Account Associate).',
    transferable: '13+ years in IT. Requirements gathering, stakeholder management, customized technical training at Chemonics. Independent project migrating legacy app from Netlify to AWS (Python, API Gateway, DynamoDB).',
    notes: 'Bridges extensive operational background with modern Applied IT degree. Focuses on scheduled, proactive advisory sessions, shielding from acute sensory overload.'
  },
  'Cloud Systems Engineer': {
    title: 'Cloud Systems Engineer / Azure & AWS Cloud Engineer',
    education: 'Bachelor’s degree in Applied Information Technology, Computer Information Systems, or a related technical discipline.',
    certifications: 'CompTIA Security+ and foundational AWS/Azure cloud certifications.',
    skills: 'Linux CLI, bash scripting, Windows Server administration, Active Directory/IAM policies, basic containerization tools (Docker), Infrastructure as Code (IaC).',
    experience: 'Meets/exceeds foundational requirements via 13+ years of professional IT operations, systems administration, and hardware lifecycle management.',
    paths: 'Internships (Cloud Systems Infrastructure or DevOps), Junior titles (Tier-2 Help Desk Analyst, NOC Technician, Junior Linux Administrator).',
    transferable: 'COVID-19 remote work migration for 1,000+ staff at JHU (VPNs, workstations, security). USAF Aviation Resource Manager experience (mission-critical systems, secure databases).',
    notes: 'Most natural direct technical step up from Senior Technical Support Analyst. Highly structured back-end environment provides excellent environmental autonomy.'
  }
};

const initialNotes = {
  general: '',
  weeklyReview: '',
  therapyInsights: '',
  schoolNotes: '',
  careerNotes: ''
};

const initialSecurityPlusTracker = {
  attendance: Array(30).fill(false), // Rough estimate of sessions
  progressPercent: 0,
  studyNotes: ''
};


// --- HOOKS ---

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


// --- COMPONENTS ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ value, max = 100, color = 'bg-teal-500' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2 overflow-hidden">
      <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};


// --- VIEWS ---

const DashboardView = ({ checklists, degreePlan, securityTracker }) => {
  // Calculate aggregate metrics
  const totalChecklistItems = Object.values(checklists).flat().length;
  const completedChecklistItems = Object.values(checklists).flat().filter(item => item.completed).length;
  const checklistPercent = totalChecklistItems === 0 ? 0 : Math.round((completedChecklistItems / totalChecklistItems) * 100);

  const totalCourses = degreePlan.flatMap(t => t.courses).length;
  const completedCourses = degreePlan.flatMap(t => t.courses).filter(c => c.completed).length;
  const degreePercent = totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">OS Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Sovereign Living & Intentional Systems.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 border-teal-100 dark:border-teal-900">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Current Season</h3>
          <p className="text-3xl font-bold text-teal-700 dark:text-teal-400 mt-2">Season 1</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">August 2026 - May 2027</p>
        </Card>
        
        <Card>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Daily Routines</h3>
            <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{checklistPercent}%</span>
          </div>
          <ProgressBar value={checklistPercent} color="bg-cyan-500" />
        </Card>

        <Card>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Degree Plan</h3>
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">{degreePercent}%</span>
          </div>
          <ProgressBar value={degreePercent} color="bg-teal-500" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-teal-600" /> Active Priorities
          </h3>
          <ul className="space-y-3">
            {['Bachelor\'s Degree', 'Security+', 'Physical Fitness', 'Therapy', 'AWS Foundations'].map((priority, i) => (
              <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-teal-500 mr-3"></div>
                {priority}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-cyan-600" /> Today's Focus
          </h3>
          <div className="space-y-2">
            {checklists['Morning'].map(item => (
              <div key={item.id} className="flex items-center opacity-80">
                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${item.completed ? 'bg-teal-500 border-teal-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-slate-700 dark:text-slate-300 ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>{item.text}</span>
              </div>
            ))}
            <div className="text-sm text-cyan-600 dark:text-cyan-400 mt-4 cursor-pointer hover:underline">View full checklist &rarr;</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const WeeklyScheduleView = ({ schedule, setSchedule }) => {
  const handleEdit = (day, id, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Weekly Schedule</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Structured blocks, not minute-by-minute anxiety.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {days.map(day => (
          <Card key={day} className="flex flex-col h-full">
            <h3 className="text-lg font-bold mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 text-slate-800 dark:text-slate-200">{day}</h3>
            <div className="space-y-3 flex-grow">
              {schedule[day].map(slot => (
                <div key={slot.id} className="flex flex-col space-y-1">
                  <input 
                    type="text" 
                    placeholder="Time (e.g. 11:00 AM)" 
                    value={slot.time} 
                    onChange={(e) => handleEdit(day, slot.id, 'time', e.target.value)}
                    className="text-xs bg-transparent border-none p-0 text-teal-600 dark:text-teal-400 placeholder-slate-400 focus:ring-0 font-medium"
                  />
                  <input 
                    type="text" 
                    placeholder="Activity" 
                    value={slot.activity} 
                    onChange={(e) => handleEdit(day, slot.id, 'activity', e.target.value)}
                    className="text-sm bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-teal-500 focus:ring-0 outline-none"
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ChecklistView = ({ checklists, setChecklists }) => {
  const toggleItem = (section, id) => {
    setChecklists(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    }));
  };

  const sections = Object.keys(checklists);

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Daily Routines</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Non-negotiable pillars for vitality.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <Card key={section}>
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">{section}</h3>
            <div className="space-y-3">
              {checklists[section].map(item => (
                <label key={item.id} className="flex items-center cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center mr-3 transition-colors ${item.completed ? 'bg-teal-500 border-teal-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-teal-400'}`}>
                    {item.completed && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={item.completed} 
                    onChange={() => toggleItem(section, item.id)} 
                  />
                  <span className={`text-slate-700 dark:text-slate-300 select-none ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const OperatingRulesView = () => {
  const rules = [
    { num: 1, title: 'School is Primary', text: 'Prioritize degree completion above extraneous projects.' },
    { num: 2, title: 'Morning Strength Training is Non-Negotiable', text: 'Build physical vitality first thing in the day.' },
    { num: 3, title: 'Therapy is Protected', text: 'Mental health and emotional processing time is sacred.' },
    { num: 4, title: 'Recovery is Productive', text: 'Downtime and slow mornings are essential for sustainable growth.' },
    { num: 5, title: 'Progress is Measured Weekly', text: 'Avoid daily emotional turbulence by evaluating trends over weeks.' },
    { num: 6, title: 'Nothing New Gets Added Without Removing Something', text: 'Protect bandwidth. Capacity is finite.' },
    { num: 7, title: 'Build Systems Not Hustle', text: 'Rely on routines and environments, not sheer willpower.' },
    { num: 8, title: 'Rest Without Abandoning Goals', text: 'Take breaks without declaring failure or starting completely over.' },
    { num: 9, title: 'Social Life Is Intentional', text: 'Invest deeply in 2-3 aligned friends rather than broad, draining networks.' },
    { num: 10, title: 'Outsource When Appropriate', text: 'Trust yourself to hire help (cleaning, etc.) when financially viable to buy back peace.' }
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Operating Rules</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">The fundamental laws governing the OS.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <div key={rule.num} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border-l-4 border-teal-500 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Rule {rule.num}: {rule.title}</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{rule.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SeasonalRoadmapView = () => {
  const seasons = [
    { 
      id: 1, title: 'SEASON 1', timeframe: 'August 2026 - May 2027', 
      active: ['Bachelor\'s Degree', 'Security+', 'AWS Foundations', 'Body Recomp', 'Therapy', 'Financial Stabilization', 'Community Building'] 
    },
    { 
      id: 2, title: 'SEASON 2', timeframe: 'Summer 2027 - Spring 2028', 
      active: ['Internship', 'AWS Certification', 'Portfolio Development', 'GitHub Contributions', 'Consulting Foundations', 'Personal Brand'] 
    },
    { 
      id: 3, title: 'SEASON 3', timeframe: 'Post Graduation', 
      active: ['Cloud Architect Consulting', 'Client Acquisition', 'Substack', 'Published Writing', 'Lifestyle Expansion'] 
    }
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Seasonal Roadmap</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Macro-level planning focusing on sequential phases, not simultaneous overload.</p>
      </header>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-6 space-y-12 pb-8">
        {seasons.map(season => (
          <div key={season.id} className="relative pl-8">
            <div className="absolute w-4 h-4 rounded-full bg-teal-500 -left-[9px] top-1.5 border-4 border-white dark:border-slate-900"></div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{season.title}</h3>
            <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-4">{season.timeframe}</p>
            <Card className="inline-block min-w-full lg:min-w-[500px]">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Active Foci</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {season.active.map((item, i) => (
                  <li key={i} className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                    <Check className="w-4 h-4 mr-2 text-teal-500" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const DegreePlanView = ({ plan, setPlan }) => {
  const toggleCourse = (termIndex, courseId) => {
    const newPlan = [...plan];
    const courses = newPlan[termIndex].courses;
    const courseIndex = courses.findIndex(c => c.id === courseId);
    courses[courseIndex].completed = !courses[courseIndex].completed;
    setPlan(newPlan);
  };

  const totalCourses = plan.flatMap(t => t.courses).length;
  const completedCourses = plan.flatMap(t => t.courses).filter(c => c.completed).length;
  const percent = totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100);

  return (
    <div className="space-y-6">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Degree Plan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">B.S. Applied Information Technology</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">{percent}%</span>
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">Complete</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plan.map((term, i) => (
          <Card key={term.term} className="bg-slate-50 dark:bg-slate-800/80">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">{term.term}</h3>
            <div className="space-y-3">
              {term.courses.map(course => (
                <label key={course.id} className="flex items-center cursor-pointer group p-2 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors">
                  <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center mr-3 transition-colors ${course.completed ? 'bg-cyan-600 border-cyan-600' : 'border-slate-300 dark:border-slate-600 group-hover:border-cyan-400'}`}>
                    {course.completed && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={course.completed} 
                    onChange={() => toggleCourse(i, course.id)} 
                  />
                  <span className={`font-mono text-sm ${course.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                    {course.code}
                  </span>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SecurityPlusView = ({ tracker, setTracker }) => {
  const endDate = new Date('2026-10-09');
  const today = new Date('2026-06-23'); // Utilizing provided current date context
  const diffTime = Math.max(0, endDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security+ Protocol</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Aug 3, 2026 – Oct 9, 2026</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-teal-800 text-white border-none flex flex-col items-center justify-center py-10">
          <ShieldCheck className="w-16 h-16 opacity-80 mb-4" />
          <div className="text-6xl font-bold">{diffDays}</div>
          <div className="text-teal-200 mt-2 uppercase tracking-widest text-sm">Days Remaining</div>
          <div className="mt-6 text-center text-teal-100 text-sm bg-teal-900/50 px-4 py-2 rounded-full">
            Schedule: Mon / Wed / Fri<br/>6:00 PM - 9:00 PM
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Study Progress Tracker</h3>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completion Metrics</span>
              <span className="text-sm font-bold text-cyan-600">{tracker.progressPercent}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={tracker.progressPercent}
              onChange={(e) => setTracker({...tracker, progressPercent: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
            />
          </div>
          
          <div className="flex-grow flex flex-col">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Study Notes & Objectives</h4>
            <textarea 
              value={tracker.studyNotes}
              onChange={(e) => setTracker({...tracker, studyNotes: e.target.value})}
              placeholder="Record domain weaknesses, practice test scores, and focus areas here..."
              className="flex-grow w-full p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const CareerView = ({ careers, setCareers }) => {
  const [activeTab, setActiveTab] = useState('Junior Cloud Architect');
  
  const handleEdit = (field, value) => {
    setCareers(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const currentData = careers[activeTab];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Career Exploration</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Strategic positioning in Cloud Infrastructure.</p>
      </header>

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1 scrollbar-hide">
        {Object.keys(careers).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border-t border-x border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card className="rounded-tl-none">
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">{currentData.title}</h2>
        
        <div className="space-y-6">
          {[
            { id: 'education', label: 'Required Education' },
            { id: 'certifications', label: 'Required Certifications' },
            { id: 'skills', label: 'Required Skills' },
            { id: 'experience', label: 'Required Experience' },
            { id: 'paths', label: 'Work Experience Paths' },
            { id: 'transferable', label: 'Transferable Skills' },
            { id: 'notes', label: 'Assessment Notes' }
          ].map(field => (
            <div key={field.id} className="flex flex-col">
              <label className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-1 uppercase tracking-wider">{field.label}</label>
              <textarea
                value={currentData[field.id]}
                onChange={(e) => handleEdit(field.id, e.target.value)}
                className="w-full p-2 bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 resize-y min-h-[40px]"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const VisionBlueprintView = ({ goals, setGoals }) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  const toggleCategory = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const updateStatus = (catIndex, goalId, newStatus) => {
    const newGoals = [...goals];
    const goalIndex = newGoals[catIndex].goals.findIndex(g => g.id === goalId);
    newGoals[catIndex].goals[goalIndex].status = newStatus;
    setGoals(newGoals);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vision Blueprint</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">The life I am building, not the life I should build.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search goals..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </header>

      <div className="space-y-4">
        {goals.map((cat, catIndex) => {
          const filteredGoals = cat.goals.filter(g => g.text.toLowerCase().includes(search.toLowerCase()));
          if (search && filteredGoals.length === 0) return null;

          const isExpanded = expanded[cat.category] !== false; // Default true

          return (
            <Card key={cat.category} className="p-0 overflow-hidden">
              <button 
                onClick={() => toggleCategory(cat.category)}
                className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{cat.category}</h3>
                {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
              </button>
              
              {isExpanded && (
                <div className="px-6 py-4 space-y-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/90">
                  {filteredGoals.map(goal => (
                    <div key={goal.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <p className="text-slate-700 dark:text-slate-300 flex-grow pr-4">{goal.text}</p>
                      <select 
                        value={goal.status}
                        onChange={(e) => updateStatus(catIndex, goal.id, e.target.value)}
                        className={`text-sm px-3 py-1.5 rounded-md border appearance-none focus:outline-none flex-shrink-0 cursor-pointer
                          ${goal.status === 'Active' ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800' : 
                            goal.status === 'Later' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : 
                            'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Later">Later</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const DormantActivitiesView = () => {
  const dormantData = [
    { cat: 'Physical', items: ['Pole Dancing', 'Sailing', 'Golf', 'Tennis', 'Gun Range'] },
    { cat: 'Learning', items: ['Sewing', 'Cooking Classes'] },
    { cat: 'Career', items: ['Essay Publication', 'Substack Launch'] },
    { cat: 'Travel', items: ['Thailand', 'Portugal', 'Colombia'] },
    { cat: 'Financial', items: ['Commercial Property', 'Land Purchase'] },
    { cat: 'Home', items: ['Art Collection', 'Outdoor Sanctuary'] },
    { cat: 'Relationships', items: ['Active Dating'] }
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dormant Activities</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Intentionally paused. Acknowledged, but not consuming active bandwidth.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dormantData.map(group => (
          <Card key={group.cat} className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-sm mb-3 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center">
              <Moon className="w-4 h-4 mr-2" /> {group.cat}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item, i) => (
                <li key={i} className="text-slate-700 dark:text-slate-300 flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mr-2"></div>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

const NotesView = ({ notes, setNotes }) => {
  const [activeNote, setActiveNote] = useState('general');
  
  const categories = [
    { id: 'general', label: 'General Notes' },
    { id: 'weeklyReview', label: 'Weekly Review' },
    { id: 'therapyInsights', label: 'Therapy Insights' },
    { id: 'schoolNotes', label: 'School Notes' },
    { id: 'careerNotes', label: 'Career Notes' }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col min-h-[80vh]">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notes Directory</h1>
      </header>

      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        <Card className="md:w-64 flex-shrink-0 p-4">
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveNote(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                  activeNote === cat.id 
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex-grow flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="font-bold text-slate-800 dark:text-slate-200">
              {categories.find(c => c.id === activeNote)?.label}
            </h2>
          </div>
          <textarea
            value={notes[activeNote]}
            onChange={(e) => setNotes({ ...notes, [activeNote]: e.target.value })}
            placeholder={`Capture thoughts for ${categories.find(c => c.id === activeNote)?.label.toLowerCase()}...`}
            className="flex-grow w-full p-6 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
          />
        </Card>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('tanishaOS-theme', true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States
  const [checklists, setChecklists] = useLocalStorage('tanishaOS-checklists', initialChecklists);
  const [schedule, setSchedule] = useLocalStorage('tanishaOS-schedule', initialSchedule);
  const [degreePlan, setDegreePlan] = useLocalStorage('tanishaOS-degree', initialDegreePlan);
  const [securityTracker, setSecurityTracker] = useLocalStorage('tanishaOS-secplus', initialSecurityPlusTracker);
  const [careers, setCareers] = useLocalStorage('tanishaOS-careers', initialCareers);
  const [visionGoals, setVisionGoals] = useLocalStorage('tanishaOS-vision', initialVisionGoals);
  const [notes, setNotes] = useLocalStorage('tanishaOS-notes', initialNotes);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Weekly Schedule', icon: Calendar },
    { id: 'Daily Checklists', icon: CheckSquare },
    { id: 'Operating Rules', icon: Shield },
    { id: 'Seasonal Roadmap', icon: MapIcon },
    { id: 'Degree Plan', icon: GraduationCap },
    { id: 'Security+ Tracker', icon: ShieldCheck },
    { id: 'Career Exploration', icon: Briefcase },
    { id: 'Vision Blueprint', icon: Eye },
    { id: 'Dormant Activities', icon: Moon },
    { id: 'Notes', icon: FileText }
  ];

  const renderView = () => {
    switch(currentView) {
      case 'Dashboard': return <DashboardView checklists={checklists} degreePlan={degreePlan} securityTracker={securityTracker} />;
      case 'Weekly Schedule': return <WeeklyScheduleView schedule={schedule} setSchedule={setSchedule} />;
      case 'Daily Checklists': return <ChecklistView checklists={checklists} setChecklists={setChecklists} />;
      case 'Operating Rules': return <OperatingRulesView />;
      case 'Seasonal Roadmap': return <SeasonalRoadmapView />;
      case 'Degree Plan': return <DegreePlanView plan={degreePlan} setPlan={setDegreePlan} />;
      case 'Security+ Tracker': return <SecurityPlusView tracker={securityTracker} setTracker={setSecurityTracker} />;
      case 'Career Exploration': return <CareerView careers={careers} setCareers={setCareers} />;
      case 'Vision Blueprint': return <VisionBlueprintView goals={visionGoals} setGoals={setVisionGoals} />;
      case 'Dormant Activities': return <DormantActivitiesView />;
      case 'Notes': return <NotesView notes={notes} setNotes={setNotes} />;
      default: return <DashboardView checklists={checklists} degreePlan={degreePlan} securityTracker={securityTracker} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'} font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200 flex`}>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-800">
          <span className="font-bold text-lg text-white tracking-wider">TANISHA OS</span>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1 h-[calc(100vh-4rem)] overflow-y-auto pb-20 scrollbar-hide">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-cyan-900/50 text-cyan-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.id}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 z-10">
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              T
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>

    </div>
  );
}