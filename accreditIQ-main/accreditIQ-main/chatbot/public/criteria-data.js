// ============================================================
// AccreditIQ SAR Generator — Criteria Data Structure
// Complete NBA GAPC V4.0 Criteria, Sub-criteria, Marks, Docs
// ============================================================

export const CRITERIA_DATA = [
  {
    id: "C1",
    name: "Outcome-Based Curriculum",
    marks: 120,
    subCriteria: [
      {
        id: "C1.1", name: "Vision, Mission and Program Educational Objectives (PEOs)", marks: 40,
        subItems: [
          { id: "C1.1.1", name: "Vision and Mission of Institute and Department", marks: 5 },
          { id: "C1.1.2", name: "Program Educational Objectives (PEOs)", marks: 5 },
          { id: "C1.1.3", name: "Process of Defining Vision, Mission and PEOs", marks: 15 },
          { id: "C1.1.4", name: "Dissemination of Vision, Mission and PEOs", marks: 5 },
          { id: "C1.1.5", name: "Mapping of PEOs with Mission", marks: 10 }
        ],
        documents: [
          "Formal Vision & Mission statements (Institute + Department)",
          "Meeting minutes of DAB/IQAC brainstorming sessions",
          "3-5 defined Program Educational Objectives",
          "Dissemination proofs: posters, website screenshots, brochures, lab manuals",
          "PEO-Mission mapping matrix with justification (Table 1.1.5.1)"
        ],
        imagePlaceholders: [
          "Photo: Vision & Mission displayed in department hallway/entrance",
          "Screenshot: Vision & Mission on institute website",
          "Photo: Vision & Mission posters in labs",
          "Photo: PEO display in brochures/lab manuals"
        ],
        tables: ["Table No.1.1.5.1: Mapping of PEOs with mission"]
      },
      {
        id: "C1.2", name: "Curriculum Structure and Features", marks: 30,
        subItems: [
          { id: "C1.2.1", name: "Program Curriculum Structure", marks: 5 },
          { id: "C1.2.2", name: "Components of Program Curriculum", marks: 5 },
          { id: "C1.2.3", name: "Compliance of Curriculum for PO/PSO Attainment & Gap Analysis", marks: 10 },
          { id: "C1.2.4", name: "Content Beyond Syllabus for PO/PSO Attainment", marks: 10 }
        ],
        documents: [
          "Syllabus copies with credit distribution tables (Table 1.2.1.1)",
          "Curriculum component breakdown: Basic Sciences, Core, Electives, Projects (Table 1.2.2.1)",
          "Gap analysis reports and PO compliance documentation",
          "Content beyond syllabus: guest lectures, workshops, industrial visits (Table 1.2.4.1)"
        ],
        imagePlaceholders: [
          "Screenshot: Official university syllabus structure",
          "Chart: Curriculum component distribution pie chart"
        ],
        tables: ["Table No.1.2.1.1: Teaching & learning scheme", "Table No.1.2.2.1: Curriculum components", "Table No.1.2.4.1: Content beyond syllabus events"]
      },
      {
        id: "C1.3", name: "PO, PSO and their Mapping with Courses", marks: 15,
        subItems: [
          { id: "C1.3.1", name: "POs and PSOs", marks: 5 },
          { id: "C1.3.2", name: "Mapping between Courses and POs/PSOs", marks: 10 }
        ],
        documents: [
          "List of all 11 POs as per NBA Annexure II",
          "Up to 3 Program Specific Outcomes (PSOs)",
          "Course-PO/PSO mapping table (Table 1.3.2)"
        ],
        imagePlaceholders: [],
        tables: ["Table No.1.3.2: Mapping between courses with POs/PSOs"]
      },
      {
        id: "C1.4", name: "Course Outcomes and Course Articulation Matrix", marks: 25,
        subItems: [
          { id: "C1.4.1", name: "Course Outcomes (Semester Wise)", marks: 15 },
          { id: "C1.4.2", name: "Course Articulation Matrix", marks: 10 }
        ],
        documents: [
          "Course outcomes for 2 core courses per semester (semesters 1-8) (Table 1.4.1.1)",
          "Course articulation matrices with PO/PSO correlation levels (Table 1.4.2.1)",
          "Max 6 COs per course reflecting measurable PO/PSO attainment"
        ],
        imagePlaceholders: [],
        tables: ["Table No.1.4.1.1: Course outcomes", "Table No.1.4.2.1: Course articulation matrix"]
      },
      {
        id: "C1.5", name: "Program Articulation Matrix", marks: 10,
        subItems: [],
        documents: [
          "Complete Program Articulation Matrix (all courses × POs/PSOs) (Table 1.5.1)"
        ],
        imagePlaceholders: [],
        tables: ["Table No.1.5.1: Program articulation matrix"]
      }
    ]
  },
  {
    id: "C2",
    name: "Outcome-Based Teaching Learning",
    marks: 120,
    subCriteria: [
      {
        id: "C2.1", name: "Quality of Teaching & Learning Processes", marks: 20,
        subItems: [],
        documents: [
          "Academic calendar (Institute + Department level)",
          "Pedagogical initiatives documentation",
          "Fast/slow learner support strategies",
          "Implementation details and impact analysis"
        ],
        imagePlaceholders: [
          "Photo: Classroom teaching/learning activities",
          "Photo: Lab sessions with students"
        ],
        tables: []
      },
      {
        id: "C2.2", name: "Quality of Student Capstone Project", marks: 25,
        subItems: [],
        documents: [
          "List of capstone/major projects with POs/PSOs addressed",
          "Project allotment and guide assignment records",
          "Continuous monitoring sheets and evaluation rubrics",
          "Working prototype demonstration records"
        ],
        imagePlaceholders: [
          "Photo: Student project exhibition/demonstration",
          "Photo: Working prototype samples"
        ],
        tables: []
      },
      {
        id: "C2.3", name: "Internship/Industrial Training", marks: 10,
        subItems: [],
        documents: ["Internship details: process, duration, POs/PSOs addressed", "Industrial training completion certificates"],
        imagePlaceholders: ["Photo: Students at internship/industrial site"],
        tables: []
      },
      {
        id: "C2.4", name: "Seminar and Mini/Micro Projects", marks: 10,
        subItems: [],
        documents: ["Seminar/mini project records with POs/PSOs addressed"],
        imagePlaceholders: [],
        tables: []
      },
      {
        id: "C2.5", name: "Case Studies and Real-Life Examples", marks: 10,
        subItems: [],
        documents: ["Case study documentation: type, complexity, POs/PSOs addressed"],
        imagePlaceholders: [],
        tables: []
      },
      {
        id: "C2.6", name: "SWAYAM/NPTEL/MOOC/Self Learning", marks: 10,
        subItems: [],
        documents: ["Student registration counts", "Certification records", "POs/PSOs addressed through MOOCs"],
        imagePlaceholders: ["Screenshot: NPTEL/SWAYAM certification samples"],
        tables: []
      },
      {
        id: "C2.7", name: "Solving Complex Engineering Problems (SDGs)", marks: 20,
        subItems: [],
        documents: [
          "Details of PBL, hackathons, integrated design projects",
          "Capstone projects targeting relevant SDGs",
          "Activity-based learning documentation"
        ],
        imagePlaceholders: ["Photo: Hackathon/project competition", "Photo: SDG-related student work"],
        tables: []
      },
      {
        id: "C2.8", name: "Industry-Institute Partnerships", marks: 15,
        subItems: [],
        documents: [
          "Signed MOUs with industry partners",
          "Industry-supported labs documentation",
          "Industry-offered training programs details"
        ],
        imagePlaceholders: ["Photo: MOU signing ceremony", "Photo: Industry-supported lab"],
        tables: []
      }
    ]
  },
  {
    id: "C3",
    name: "Outcome-Based Assessment",
    marks: 120,
    subCriteria: [
      { id: "C3.1", name: "Continuous Assessment Evaluation", marks: 10, subItems: [], documents: ["Unit test/mid-term papers aligned with COs", "Assignment evaluation records", "Course files with assessment details"], imagePlaceholders: [], tables: [] },
      { id: "C3.2", name: "Semester End Exam (SEE) Evaluation", marks: 10, subItems: [], documents: ["SEE question papers aligned with COs/POs/PSOs", "Evaluation process documentation"], imagePlaceholders: [], tables: [] },
      { id: "C3.3", name: "Laboratory & Workshop Evaluation", marks: 10, subItems: [], documents: ["Lab assessment rubrics mapped to COs/POs/PSOs", "Student lab assessment samples in course files"], imagePlaceholders: [], tables: [] },
      { id: "C3.4", name: "Internship Evaluation", marks: 10, subItems: [], documents: ["Internship assessment rubrics linked to POs/PSOs", "Student internship assessment evidence"], imagePlaceholders: [], tables: [] },
      { id: "C3.5", name: "Project Evaluation", marks: 20, subItems: [], documents: ["Project rubrics linked to POs/PSOs", "Student project assessment evidence"], imagePlaceholders: [], tables: [] },
      { id: "C3.6", name: "Sustainable Development Goals (SDGs)", marks: 10, subItems: [], documents: ["SDG portfolio: research, projects, student activities"], imagePlaceholders: [], tables: [] },
      {
        id: "C3.7", name: "Attainment of Course Outcomes", marks: 25,
        subItems: [
          { id: "C3.7.1", name: "Assessment Tools & Processes for CO Evaluation", marks: 5 },
          { id: "C3.7.2", name: "CO Attainment Records", marks: 20 }
        ],
        documents: ["Assessment tools description", "CO attainment calculation spreadsheets", "CIE and SEE-based CO measurement details"],
        imagePlaceholders: [],
        tables: []
      },
      {
        id: "C3.8", name: "Attainment of POs and PSOs", marks: 25,
        subItems: [],
        documents: [
          "Direct attainment via Course-PO matrix (Table 3.8.1)",
          "Indirect attainment via surveys (Table 3.8.2)",
          "Overall PO/PSO attainment (Table 3.8.3)",
          "Exit surveys, employer feedback, alumni surveys"
        ],
        imagePlaceholders: [],
        tables: ["Table No.3.8.1: Direct attainment", "Table No.3.8.2: Indirect attainment", "Table No.3.8.3: Overall attainment"]
      }
    ]
  },
  {
    id: "C4",
    name: "Students' Performance",
    marks: 120,
    subCriteria: [
      { id: "C4.1", name: "Enrolment Ratio (First Year)", marks: 20, subItems: [], documents: ["Admission data for CAY, CAYm1, CAYm2 (Table 4A)", "ER formula: (N1+N4)/N (Table 4.1.1)", "Marks distribution table (Table 4.1.2)"], imagePlaceholders: [], tables: ["Table No.4A: Admission details", "Table No.4.1.1: Enrolment ratio", "Table No.4.1.2: Marks distribution"], formula: "ER = (N1+N4)/N; Average ER = (ER_1+ER_2+ER_3)/3" },
      { id: "C4.2", name: "Success Rate", marks: 15, subItems: [], documents: ["Graduation data for LYG, LYGm1, LYGm2 (Table 4C)", "SR formula data (Table 4.2.1)"], imagePlaceholders: [], tables: ["Table No.4C: Graduation data", "Table No.4.2.1: Success rate"], formula: "SR = (B/A)*100; Average SR = (SR_1+SR_2+SR_3)/3" },
      { id: "C4.3", name: "Academic Performance (1st Year)", marks: 10, subItems: [], documents: ["1st year GPA/marks data (Table 4.3.1)"], imagePlaceholders: [], tables: ["Table No.4.3.1"], formula: "API = X*(Y/Z)" },
      { id: "C4.4", name: "Academic Performance (2nd Year)", marks: 10, subItems: [], documents: ["2nd year GPA/marks data"], imagePlaceholders: [], tables: [], formula: "API = X*(Y/Z)" },
      { id: "C4.5", name: "Academic Performance (3rd Year)", marks: 10, subItems: [], documents: ["3rd year GPA/marks data"], imagePlaceholders: [], tables: [], formula: "API = X*(Y/Z)" },
      { id: "C4.6", name: "Placement, Higher Studies & Entrepreneurship", marks: 30, subItems: [], documents: ["Placement records with appointment letters", "Higher studies admissions (GATE/GRE)", "Entrepreneurship records (Table 4.6.1)"], imagePlaceholders: [], tables: ["Table No.4.6.1"], formula: "PI = ((X+Y+Z)/FS)*100" },
      {
        id: "C4.7", name: "Professional Activities", marks: 25,
        subItems: [
          { id: "C4.7.1", name: "Professional Societies/Clubs/Events", marks: 5 },
          { id: "C4.7.2", name: "Student Participation in Professional Events", marks: 10 },
          { id: "C4.7.3", name: "Department Publications", marks: 5 },
          { id: "C4.7.4", name: "Student Publications", marks: 5 }
        ],
        documents: [
          "Active professional society list (Table 4.7.1.1)",
          "Events organized (Table 4.7.1.2)",
          "Student participation in hackathons, codeathons (Table 4.7.2.1)",
          "Department journals/magazines (Table 4.7.3.1)",
          "Student research publications (Table 4.7.4.1)"
        ],
        imagePlaceholders: ["Photo: Professional society event", "Photo: Student competition participation"],
        tables: ["Table No.4.7.1.1", "Table No.4.7.1.2", "Table No.4.7.2.1", "Table No.4.7.3.1", "Table No.4.7.4.1"]
      }
    ]
  },
  {
    id: "C5",
    name: "Faculty Information",
    marks: 100,
    subCriteria: [
      { id: "C5.1", name: "Student-Faculty Ratio (SFR)", marks: 30, subItems: [], documents: ["Faculty details table (Table 5A)", "SFR calculation (Table 5.1.2)", "Include allied department faculty", "Exclude first-year-only faculty"], imagePlaceholders: [], tables: ["Table No.5A", "Table No.5.1.2"], formula: "SFR = S/TF; Target < 20:1" },
      { id: "C5.2", name: "Faculty Qualification", marks: 25, subItems: [], documents: ["Ph.D. and PG degree certificates", "FQI calculation (Table 5.2.1)"], imagePlaceholders: [], tables: ["Table No.5.2.1"], formula: "FQI = 2.5*[(10X+4Y)/RF]; RF=S/20" },
      { id: "C5.3", name: "Faculty Cadre Proportion", marks: 25, subItems: [], documents: ["Faculty cadre details (Table 5.3.1)", "Professor/Assoc.Prof/Asst.Prof breakdown"], imagePlaceholders: [], tables: ["Table No.5.3.1"], formula: "Cadre ratio 1:2:6; Marks = (AF1/RF1 + AF2*0.6/RF2 + AF3*0.4/RF3)*12.5" },
      { id: "C5.4", name: "Visiting/Adjunct Faculty", marks: 10, subItems: [], documents: ["Visiting faculty list with hours (Table 5.4.1)", "Min 50 cumulative hrs/year from industry"], imagePlaceholders: [], tables: ["Table No.5.4.1"] },
      { id: "C5.5", name: "Faculty Retention", marks: 10, subItems: [], documents: ["Faculty retention ratio (Table 5.5.1)", "Salary statements, Form 16, appointment orders"], imagePlaceholders: [], tables: ["Table No.5.5.1"], formula: "FR = ((A*0+B*1+C*2+D*3+E*4)/RF)*2.50" }
    ]
  },
  {
    id: "C6",
    name: "Faculty Contributions",
    marks: 120,
    subCriteria: [
      {
        id: "C6.1", name: "Professional Development Activities", marks: 60,
        subItems: [
          { id: "C6.1.1", name: "Professional Society Memberships", marks: 5 },
          { id: "C6.1.2", name: "Faculty as Resource Persons/Participants in STTPs/FDPs", marks: 15 },
          { id: "C6.1.3", name: "Faculty MOOC Certification", marks: 10 },
          { id: "C6.1.4", name: "FDP/STTP Organized by Department", marks: 10 },
          { id: "C6.1.5", name: "Faculty Support in Student Innovative Projects", marks: 10 },
          { id: "C6.1.6", name: "Faculty Internship/Training/Industry Collaboration", marks: 10 }
        ],
        documents: [
          "Professional society memberships (Table 6.1.1.1)",
          "STTP/FDP resource person details (Table 6.1.2.1.1)",
          "STTP/FDP participation details (Table 6.1.2.2.1)",
          "MOOC certificates (Table 6.1.3.1)",
          "FDP/STTP organized (Table 6.1.4.1)",
          "Student innovation mentoring (Table 6.1.5.1)",
          "Industry internship/collaboration records (Table 6.1.6.1)"
        ],
        imagePlaceholders: ["Photo: FDP/STTP event organized by department", "Photo: Faculty at industry collaboration"],
        tables: ["Table No.6.1.1.1", "Table No.6.1.2.1.1", "Table No.6.1.2.2.1", "Table No.6.1.3.1", "Table No.6.1.4.1", "Table No.6.1.5.1", "Table No.6.1.6.1"]
      },
      {
        id: "C6.2", name: "Research, Publications and Consultancy", marks: 60,
        subItems: [
          { id: "C6.2.1", name: "Research Papers Published", marks: 25 },
          { id: "C6.2.2", name: "Books/Book Chapters/Monographs Published", marks: 5 },
          { id: "C6.2.3", name: "Sponsored Research Projects", marks: 15 },
          { id: "C6.2.4", name: "Consultancy Projects", marks: 5 },
          { id: "C6.2.5", name: "Intellectual Property (Patents, Copyrights)", marks: 10 }
        ],
        documents: [
          "Scopus/WoS indexed papers list (Table 6.2.1.1)",
          "Books/chapters published (Table 6.2.2.1)",
          "Sponsored project grants (Table 6.2.3.1)",
          "Consultancy work records (Table 6.2.4.1)",
          "Patent/copyright certificates (Table 6.2.5.1)"
        ],
        imagePlaceholders: ["Photo: Published research papers/books"],
        tables: ["Table No.6.2.1.1", "Table No.6.2.2.1", "Table No.6.2.3.1", "Table No.6.2.4.1", "Table No.6.2.5.1"]
      }
    ]
  },
  {
    id: "C7",
    name: "Facilities and Technical Support",
    marks: 100,
    subCriteria: [
      { id: "C7.1", name: "Adequacy of Infrastructure", marks: 30, subItems: [], documents: ["Classrooms, tutorial rooms, labs inventory", "Infrastructure vs. student ratio analysis"], imagePlaceholders: ["Photo: Classroom overview", "Photo: Lab facilities"], tables: [] },
      { id: "C7.2", name: "Equipment and Software in Laboratories", marks: 30, subItems: [], documents: ["Lab equipment list with quantities and costs", "Licensed software list", "Stock registers and purchase invoices"], imagePlaceholders: ["Photo: Lab equipment close-up", "Photo: Computer lab"], tables: [] },
      { id: "C7.3", name: "Maintenance and Safety Measures", marks: 20, subItems: [], documents: ["Fire safety certificates", "First aid logs", "Maintenance registers", "Safety signage documentation"], imagePlaceholders: ["Photo: Fire extinguisher/safety equipment", "Photo: Do's & Don'ts signage in lab"], tables: [] },
      { id: "C7.4", name: "Library and Information Resources", marks: 20, subItems: [], documents: ["Library book count and journals", "E-resource subscriptions (IEEE, Springer, etc.)", "Digital library/OPAC system details"], imagePlaceholders: ["Photo: Library interior", "Screenshot: Digital library portal"], tables: [] }
    ]
  },
  {
    id: "C8",
    name: "Continuous Improvement",
    marks: 80,
    subCriteria: [
      { id: "C8.1", name: "Actions Taken Based on Assessment Results", marks: 40, subItems: [], documents: ["Action Taken Reports (ATRs)", "How assessment data led to program improvements", "Before/after comparison documentation"], imagePlaceholders: [], tables: [] },
      { id: "C8.2", name: "Academic Audit Findings and Compliance", marks: 40, subItems: [], documents: ["Internal audit reports", "External audit reports", "Compliance documentation and corrective actions"], imagePlaceholders: [], tables: [] }
    ]
  },
  {
    id: "C9",
    name: "Student Support and Governance",
    marks: 120,
    subCriteria: [
      { id: "C9.1", name: "Governance Structure", marks: 25, subItems: [], documents: ["Governing Body meeting minutes", "College Development Committee (CDC) minutes", "Organizational chart"], imagePlaceholders: ["Photo: Governing body meeting"], tables: [] },
      { id: "C9.2", name: "Budget and Financial Support", marks: 25, subItems: [], documents: ["Audited balance sheets (3 years)", "Program-wise budget utilization", "Infrastructure investment records"], imagePlaceholders: [], tables: [] },
      { id: "C9.3", name: "Student Mentoring and Counseling", marks: 25, subItems: [], documents: ["Mentoring system documentation", "Mentor-mentee allocation records", "Counseling records", "Mentoring diaries/logs"], imagePlaceholders: [], tables: [] },
      { id: "C9.4", name: "Anti-Ragging and Student Welfare", marks: 20, subItems: [], documents: ["Anti-ragging committee and compliance certificates", "Grievance redressal committee records", "Student welfare schemes"], imagePlaceholders: [], tables: [] },
      { id: "C9.5", name: "E-Governance and ICT Infrastructure", marks: 25, subItems: [], documents: ["LMS usage proof (Google Classroom, Moodle)", "ERP system documentation", "ICT-enabled classroom/lab details"], imagePlaceholders: ["Screenshot: LMS dashboard", "Screenshot: ERP system"], tables: [] }
    ]
  }
];

export const TOTAL_MARKS = 1000;
