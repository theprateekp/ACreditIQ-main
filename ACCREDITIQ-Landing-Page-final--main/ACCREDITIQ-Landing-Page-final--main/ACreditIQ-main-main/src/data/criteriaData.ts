// Full NBA GAPC V4.0 criterion structure with sub-criteria, checklists, and formulas

export interface SubCriterion {
  id: string;
  title: string;
  maxMarks: number;
  description: string;
  checklistItems: string[];
  formula?: string;
  hasTable?: boolean;
  hasNarrative?: boolean;
}

export interface CriterionDefinition {
  id: string;
  title: string;
  maxMarks: number;
  part: 'A' | 'B' | 'C' | 'D';
  cluster: string;
  incharge?: string;
  subCriteria: SubCriterion[];
}

export const CRITERIA_DEFINITIONS: CriterionDefinition[] = [
  {
    id: 'C1', title: 'Vision, Mission and Program Educational Objectives', maxMarks: 75, part: 'B', cluster: 'Governance & Strategy', incharge: 'Prof. James Okafor',
    subCriteria: [
      { id: 'C1.1', title: 'Vision and Mission of the Department', maxMarks: 10, description: 'Clearly defined vision and mission statements aligned with institutional goals.', checklistItems: ['Vision statement document', 'Mission statement document', 'Alignment with institutional vision', 'Faculty awareness evidence', 'Student awareness evidence'], hasNarrative: true },
      { id: 'C1.2', title: 'Program Educational Objectives (PEOs)', maxMarks: 20, description: 'PEOs defined, published, and periodically reviewed with stakeholder input.', checklistItems: ['PEO statements (3–5)', 'Stakeholder survey records', 'PEO review meeting minutes', 'PEO-Mission alignment matrix', 'Published in prospectus/website'], hasNarrative: true, hasTable: true },
      { id: 'C1.3', title: 'Attainment of PEOs', maxMarks: 20, description: 'Evidence of PEO attainment through alumni surveys, employer feedback, and placement data.', checklistItems: ['Alumni survey data (last 3 years)', 'Employer feedback forms', 'Placement records', 'Higher studies data', 'PEO attainment calculation'], hasNarrative: true, hasTable: true, formula: 'PEO Attainment = (Direct + Indirect) / 2' },
      { id: 'C1.4', title: 'CO-PO/PSO Mapping', maxMarks: 25, description: 'Course Outcomes mapped to Program Outcomes and Program Specific Outcomes.', checklistItems: ['CO statements for all courses', 'CO-PO mapping matrix', 'CO-PSO mapping matrix', 'Justification for correlation levels', 'Faculty sign-off on mappings'], hasTable: true },
    ],
  },
  {
    id: 'C2', title: 'Program Curriculum and Teaching-Learning Processes', maxMarks: 125, part: 'B', cluster: 'Academic Quality', incharge: 'Dr. Priya Nair',
    subCriteria: [
      { id: 'C2.1', title: 'Curriculum Design', maxMarks: 30, description: 'Curriculum designed to achieve POs and PSOs with appropriate credit distribution.', checklistItems: ['Curriculum document', 'Credit distribution table', 'Core vs elective ratio', 'Industry relevance evidence', 'BOS meeting minutes'], hasNarrative: true, hasTable: true },
      { id: 'C2.2', title: 'Academic Calendar and Delivery', maxMarks: 20, description: 'Academic calendar followed with evidence of syllabus coverage.', checklistItems: ['Academic calendar', 'Lesson plans for all courses', 'Syllabus coverage reports', 'Timetable', 'Lab manuals'], hasNarrative: true },
      { id: 'C2.3', title: 'CO Attainment', maxMarks: 40, description: 'Direct and indirect attainment of Course Outcomes computed and analyzed.', checklistItems: ['CO attainment calculation sheet', 'Direct attainment data (CIE + SEE)', 'Indirect attainment data (surveys)', 'Threshold definition document', 'Action taken report'], hasTable: true, formula: 'CO Attainment = 0.8 × Direct + 0.2 × Indirect' },
      { id: 'C2.4', title: 'PO/PSO Attainment', maxMarks: 35, description: 'Program Outcome attainment computed from CO attainment using CO-PO mapping.', checklistItems: ['PO attainment calculation', 'PSO attainment calculation', 'Attainment vs target comparison', 'Corrective action plan', 'Faculty review records'], hasTable: true, formula: 'PO Attainment = Σ(CO Attainment × Correlation) / Σ(Correlation)' },
    ],
  },
  {
    id: 'C3', title: 'Course Outcomes and Program Outcomes', maxMarks: 175, part: 'B', cluster: 'Academic Quality', incharge: 'Prof. James Okafor',
    subCriteria: [
      { id: 'C3.1', title: 'CO Definition and Publication', maxMarks: 25, description: 'COs defined for all courses using Bloom\'s taxonomy and published to students.', checklistItems: ['CO statements for all courses', 'Bloom\'s taxonomy alignment', 'Student handbook with COs', 'Faculty training records', 'CO review minutes'], hasNarrative: true },
      { id: 'C3.2', title: 'Assessment Tools and Rubrics', maxMarks: 50, description: 'Assessment tools aligned to COs with defined rubrics.', checklistItems: ['Question paper CO mapping', 'Rubrics for all assessments', 'Sample answer scripts', 'Moderation records', 'CO-wise marks analysis'], hasTable: true },
      { id: 'C3.3', title: 'CO Attainment Calculation', maxMarks: 60, description: 'Systematic computation of CO attainment with threshold analysis.', checklistItems: ['CO attainment spreadsheet', 'CIE marks data', 'SEE marks data', 'Survey data', 'Threshold justification'], hasTable: true, formula: 'Direct Attainment = % students scoring ≥ threshold in CO-mapped questions' },
      { id: 'C3.4', title: 'Actions on CO Attainment', maxMarks: 40, description: 'Corrective and preventive actions taken based on CO attainment analysis.', checklistItems: ['Action taken report', 'Faculty meeting minutes', 'Revised lesson plans', 'Remedial class records', 'Improvement trend data'], hasNarrative: true },
    ],
  },
  {
    id: 'C4', title: "Students' Performance", maxMarks: 100, part: 'B', cluster: 'Academic Quality', incharge: 'Dr. Sarah Mitchell',
    subCriteria: [
      { id: 'C4.1', title: 'Enrolment Ratio (ER)', maxMarks: 20, description: 'Ratio of students enrolled to sanctioned intake over last 5 years.', checklistItems: ['Admission data (5 years)', 'Sanctioned intake letters', 'University enrollment records', 'Lateral entry data'], hasTable: true, formula: 'ER = (Enrolled / Sanctioned Intake) × 100' },
      { id: 'C4.2', title: 'Success Rate (SR)', maxMarks: 20, description: 'Percentage of students passing all subjects in first attempt.', checklistItems: ['University result data (5 years)', 'Pass/fail analysis', 'Backlog student records', 'Remedial support evidence'], hasTable: true, formula: 'SR = (Students passing all subjects / Total appeared) × 100' },
      { id: 'C4.3', title: 'Academic Performance Index (API)', maxMarks: 20, description: 'Average CGPA/percentage of graduating batch.', checklistItems: ['CGPA data for all batches', 'Grade distribution', 'Topper records', 'University rank holders'], hasTable: true, formula: 'API = Average CGPA of graduating batch' },
      { id: 'C4.4', title: 'Placement and Higher Studies', maxMarks: 25, description: 'Placement records and higher studies data for last 5 years.', checklistItems: ['Placement records with company names', 'Offer letters (sample)', 'Higher studies admission proof', 'Entrepreneurship records', 'Training & placement cell report'], hasTable: true },
      { id: 'C4.5', title: 'Professional Activities', maxMarks: 15, description: 'Student participation in professional bodies, competitions, and publications.', checklistItems: ['IEEE/ISTE membership records', 'Competition participation certificates', 'Student publications list', 'Internship records', 'Project exhibition records'], hasNarrative: true },
    ],
  },
  {
    id: 'C5', title: 'Faculty Information and Contributions', maxMarks: 100, part: 'B', cluster: 'Academic Quality', incharge: 'Prof. James Okafor',
    subCriteria: [
      { id: 'C5.1', title: 'Student-Faculty Ratio (SFR)', maxMarks: 20, description: 'Ratio of students to faculty in the department.', checklistItems: ['Faculty list with designations', 'Student enrollment data', 'Visiting faculty records', 'Adjunct faculty details'], hasTable: true, formula: 'SFR = Total Students / Total Faculty (Regular + Contract)' },
      { id: 'C5.2', title: 'Faculty Qualification Index (FQI)', maxMarks: 20, description: 'Weighted index based on faculty qualifications.', checklistItems: ['Faculty qualification certificates', 'PhD completion certificates', 'Pursuing PhD evidence', 'UGC NET/GATE certificates'], hasTable: true, formula: 'FQI = (3×PhD + 2×PG + 1×UG) / Total Faculty' },
      { id: 'C5.3', title: 'Faculty Cadre Proportion', maxMarks: 20, description: 'Proportion of Professor, Associate Professor, and Assistant Professor.', checklistItems: ['Appointment orders', 'Promotion orders', 'Cadre-wise faculty list', 'Sanctioned posts vs filled'], hasTable: true, formula: 'Required: Prof:AP:Asst = 1:2:6' },
      { id: 'C5.4', title: 'Faculty Retention', maxMarks: 20, description: 'Percentage of faculty retained over last 3 years.', checklistItems: ['Faculty joining/leaving records', 'Resignation letters', 'Retention calculation', 'Exit interview records'], hasTable: true, formula: 'Retention = (Faculty at end / Faculty at start) × 100' },
      { id: 'C5.5', title: 'Faculty Research and Publications', maxMarks: 20, description: 'Research output including publications, patents, and funded projects.', checklistItems: ['Publication list with DOI', 'Patent certificates', 'Funded project sanction letters', 'Conference participation certificates', 'Book chapters/books'], hasTable: true },
    ],
  },
  {
    id: 'C6', title: 'Facilities and Technical Support', maxMarks: 75, part: 'B', cluster: 'Resources & Compliance', incharge: 'Dr. Priya Nair',
    subCriteria: [
      { id: 'C6.1', title: 'Classrooms and Tutorial Rooms', maxMarks: 15, description: 'Adequacy and quality of classrooms with ICT facilities.', checklistItems: ['Classroom inventory list', 'ICT equipment list', 'Seating capacity records', 'Maintenance records', 'Photos of classrooms'], hasNarrative: true },
      { id: 'C6.2', title: 'Laboratories', maxMarks: 30, description: 'Laboratory facilities aligned to curriculum with adequate equipment.', checklistItems: ['Lab inventory list', 'Equipment purchase invoices', 'Lab manuals', 'Safety records', 'Utilization records'], hasNarrative: true, hasTable: true },
      { id: 'C6.3', title: 'Computing Facilities', maxMarks: 20, description: 'Computer labs with adequate hardware, software, and internet connectivity.', checklistItems: ['Computer inventory', 'Software license list', 'Internet bandwidth proof', 'Server room details', 'IT support records'], hasTable: true },
      { id: 'C6.4', title: 'Library Resources', maxMarks: 10, description: 'Library with adequate books, journals, and digital resources.', checklistItems: ['Book list (title, author, copies)', 'Journal subscription list', 'Digital library access proof', 'Library usage statistics', 'New additions list'], hasTable: true },
    ],
  },
  {
    id: 'C7', title: 'Continuous Improvement', maxMarks: 75, part: 'B', cluster: 'Resources & Compliance', incharge: 'Dr. Sarah Mitchell',
    subCriteria: [
      { id: 'C7.1', title: 'Actions on CO/PO Attainment', maxMarks: 25, description: 'Systematic actions taken based on CO/PO attainment analysis.', checklistItems: ['Action taken report', 'Before/after comparison', 'Faculty meeting minutes', 'Curriculum revision records', 'Student feedback analysis'], hasNarrative: true },
      { id: 'C7.2', title: 'Academic Audit', maxMarks: 25, description: 'Internal and external academic audit conducted periodically.', checklistItems: ['Academic audit reports', 'Audit committee constitution', 'Action taken on audit findings', 'External expert visit records', 'Compliance certificates'], hasNarrative: true },
      { id: 'C7.3', title: 'Stakeholder Feedback', maxMarks: 25, description: 'Systematic collection and analysis of stakeholder feedback.', checklistItems: ['Student feedback forms', 'Alumni feedback data', 'Employer feedback records', 'Parent feedback records', 'Analysis and action report'], hasTable: true },
    ],
  },
  {
    id: 'C8', title: 'First Year Academics', maxMarks: 75, part: 'B', cluster: 'Resources & Compliance', incharge: 'Prof. James Okafor',
    subCriteria: [
      { id: 'C8.1', title: 'First Year Student Performance', maxMarks: 30, description: 'Academic performance of first year students.', checklistItems: ['First year result data', 'Pass percentage analysis', 'Remedial support records', 'Mentoring records', 'Bridge course records'], hasTable: true, formula: 'FY Success Rate = (FY students passing all subjects / Total FY appeared) × 100' },
      { id: 'C8.2', title: 'First Year Facilities', maxMarks: 25, description: 'Dedicated facilities and support for first year students.', checklistItems: ['First year lab list', 'Induction program records', 'Orientation program records', 'Counseling records', 'Sports/cultural facilities'], hasNarrative: true },
      { id: 'C8.3', title: 'First Year Faculty', maxMarks: 20, description: 'Qualified faculty assigned to first year courses.', checklistItems: ['First year faculty list', 'Qualification certificates', 'Teaching experience records', 'Training records', 'Feedback on first year faculty'], hasTable: true },
    ],
  },
  {
    id: 'C9', title: 'Student Support Systems', maxMarks: 100, part: 'C', cluster: 'Resources & Compliance', incharge: 'Dr. Sarah Mitchell',
    subCriteria: [
      { id: 'C9.1', title: 'Mentoring System', maxMarks: 20, description: 'Structured mentoring system for academic and personal guidance.', checklistItems: ['Mentoring policy document', 'Mentor-mentee allocation records', 'Meeting records', 'Issue resolution records', 'Student satisfaction data'], hasNarrative: true },
      { id: 'C9.2', title: 'Scholarships and Financial Aid', maxMarks: 20, description: 'Availability and utilization of scholarships and financial support.', checklistItems: ['Scholarship list', 'Beneficiary records', 'Government scholarship data', 'Institute scholarship policy', 'Disbursement records'], hasTable: true },
      { id: 'C9.3', title: 'Career Guidance and Placement', maxMarks: 25, description: 'Career guidance, training, and placement support systems.', checklistItems: ['Training calendar', 'Placement cell records', 'Industry visit records', 'Guest lecture records', 'Career counseling records'], hasNarrative: true },
      { id: 'C9.4', title: 'Entrepreneurship and Innovation', maxMarks: 20, description: 'Support for entrepreneurship and innovation activities.', checklistItems: ['Incubation center details', 'Startup records', 'Innovation competition records', 'IPR/patent records', 'Industry collaboration records'], hasNarrative: true },
      { id: 'C9.5', title: 'Student Grievance Redressal', maxMarks: 15, description: 'Formal grievance redressal mechanism for students.', checklistItems: ['Grievance committee constitution', 'Grievance register', 'Resolution records', 'Anti-ragging committee records', 'Student welfare policy'], hasNarrative: true },
    ],
  },
];

export const PART_A_SECTIONS = [
  { id: 'A1', title: 'Institutional Information', fields: ['Institution Name', 'Address', 'Phone', 'Email', 'Website', 'Year of Establishment', 'AICTE Approval Number'] },
  { id: 'A2', title: 'Program Information', fields: ['Program Name', 'Degree', 'Duration', 'Sanctioned Intake', 'NBA Accreditation Status', 'Accreditation Period'] },
  { id: 'A3', title: 'Accreditation History', fields: ['Previous Accreditation Year', 'Previous Score', 'Accreditation Level', 'Validity Period'] },
  { id: 'A4', title: 'Key Contacts', fields: ['Principal Name', 'HOD Name', 'NBA Coordinator Name', 'Contact Numbers', 'Email IDs'] },
];
