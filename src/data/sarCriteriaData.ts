// NBA GAPC V4.0 Complete Criteria Data — from accreditIQ-main
export interface SubItem { id: string; name: string; marks: number }
export interface SubCriterion {
  id: string; name: string; marks: number;
  subItems: SubItem[];
  documents: string[];
  imagePlaceholders: string[];
  tables: string[];
  formula?: string;
}
export interface Criterion { id: string; name: string; marks: number; subCriteria: SubCriterion[] }

export const CRITERIA_DATA: Criterion[] = [
  { id:'C1', name:'Outcome-Based Curriculum', marks:120, subCriteria:[
    { id:'C1.1', name:'Vision, Mission and Program Educational Objectives (PEOs)', marks:40, subItems:[{id:'C1.1.1',name:'Vision and Mission',marks:5},{id:'C1.1.2',name:'PEOs',marks:5},{id:'C1.1.3',name:'Process of Defining',marks:15},{id:'C1.1.4',name:'Dissemination',marks:5},{id:'C1.1.5',name:'Mapping PEOs with Mission',marks:10}], documents:['Formal Vision & Mission statements','Meeting minutes of DAB/IQAC','3-5 defined PEOs','Dissemination proofs: posters, website screenshots','PEO-Mission mapping matrix (Table 1.1.5.1)'], imagePlaceholders:['Photo: Vision & Mission displayed in department','Screenshot: Vision & Mission on website'], tables:['Table No.1.1.5.1: Mapping of PEOs with mission'] },
    { id:'C1.2', name:'Curriculum Structure and Features', marks:30, subItems:[{id:'C1.2.1',name:'Program Curriculum Structure',marks:5},{id:'C1.2.2',name:'Components of Curriculum',marks:5},{id:'C1.2.3',name:'Compliance for PO/PSO Attainment',marks:10},{id:'C1.2.4',name:'Content Beyond Syllabus',marks:10}], documents:['Syllabus copies with credit distribution (Table 1.2.1.1)','Curriculum component breakdown (Table 1.2.2.1)','Gap analysis reports','Content beyond syllabus (Table 1.2.4.1)'], imagePlaceholders:['Screenshot: Official university syllabus structure'], tables:['Table No.1.2.1.1','Table No.1.2.2.1','Table No.1.2.4.1'] },
    { id:'C1.3', name:'PO, PSO and their Mapping with Courses', marks:15, subItems:[{id:'C1.3.1',name:'POs and PSOs',marks:5},{id:'C1.3.2',name:'Mapping Courses with POs/PSOs',marks:10}], documents:['List of all 11 POs as per NBA Annexure II','Up to 3 PSOs','Course-PO/PSO mapping table (Table 1.3.2)'], imagePlaceholders:[], tables:['Table No.1.3.2'] },
    { id:'C1.4', name:'Course Outcomes and Course Articulation Matrix', marks:25, subItems:[{id:'C1.4.1',name:'Course Outcomes (Semester Wise)',marks:15},{id:'C1.4.2',name:'Course Articulation Matrix',marks:10}], documents:['Course outcomes for 2 core courses per semester (Table 1.4.1.1)','Course articulation matrices (Table 1.4.2.1)'], imagePlaceholders:[], tables:['Table No.1.4.1.1','Table No.1.4.2.1'] },
    { id:'C1.5', name:'Program Articulation Matrix', marks:10, subItems:[], documents:['Complete Program Articulation Matrix (Table 1.5.1)'], imagePlaceholders:[], tables:['Table No.1.5.1'] },
  ]},
  { id:'C2', name:'Outcome-Based Teaching Learning', marks:120, subCriteria:[
    { id:'C2.1', name:'Quality of Teaching & Learning Processes', marks:20, subItems:[], documents:['Academic calendar','Pedagogical initiatives documentation','Fast/slow learner support strategies'], imagePlaceholders:['Photo: Classroom teaching activities'], tables:[] },
    { id:'C2.2', name:'Quality of Student Capstone Project', marks:25, subItems:[], documents:['List of capstone/major projects with POs/PSOs','Project allotment records','Evaluation rubrics'], imagePlaceholders:['Photo: Student project exhibition'], tables:[] },
    { id:'C2.3', name:'Internship/Industrial Training', marks:10, subItems:[], documents:['Internship details: process, duration, POs/PSOs','Industrial training completion certificates'], imagePlaceholders:['Photo: Students at internship site'], tables:[] },
    { id:'C2.4', name:'Seminar and Mini/Micro Projects', marks:10, subItems:[], documents:['Seminar/mini project records with POs/PSOs'], imagePlaceholders:[], tables:[] },
    { id:'C2.5', name:'Case Studies and Real-Life Examples', marks:10, subItems:[], documents:['Case study documentation: type, complexity, POs/PSOs'], imagePlaceholders:[], tables:[] },
    { id:'C2.6', name:'SWAYAM/NPTEL/MOOC/Self Learning', marks:10, subItems:[], documents:['Student registration counts','Certification records','POs/PSOs addressed through MOOCs'], imagePlaceholders:['Screenshot: NPTEL/SWAYAM certification samples'], tables:[] },
    { id:'C2.7', name:'Solving Complex Engineering Problems (SDGs)', marks:20, subItems:[], documents:['Details of PBL, hackathons, integrated design projects','Capstone projects targeting SDGs'], imagePlaceholders:['Photo: Hackathon/project competition'], tables:[] },
    { id:'C2.8', name:'Industry-Institute Partnerships', marks:15, subItems:[], documents:['Signed MOUs with industry partners','Industry-supported labs documentation','Industry-offered training programs'], imagePlaceholders:['Photo: MOU signing ceremony'], tables:[] },
  ]},
  { id:'C3', name:'Outcome-Based Assessment', marks:120, subCriteria:[
    { id:'C3.1', name:'Continuous Assessment Evaluation', marks:10, subItems:[], documents:['Unit test/mid-term papers aligned with COs','Assignment evaluation records'], imagePlaceholders:[], tables:[] },
    { id:'C3.2', name:'Semester End Exam (SEE) Evaluation', marks:10, subItems:[], documents:['SEE question papers aligned with COs/POs/PSOs'], imagePlaceholders:[], tables:[] },
    { id:'C3.3', name:'Laboratory & Workshop Evaluation', marks:10, subItems:[], documents:['Lab assessment rubrics mapped to COs/POs/PSOs'], imagePlaceholders:[], tables:[] },
    { id:'C3.4', name:'Internship Evaluation', marks:10, subItems:[], documents:['Internship assessment rubrics linked to POs/PSOs'], imagePlaceholders:[], tables:[] },
    { id:'C3.5', name:'Project Evaluation', marks:20, subItems:[], documents:['Project rubrics linked to POs/PSOs'], imagePlaceholders:[], tables:[] },
    { id:'C3.6', name:'Sustainable Development Goals (SDGs)', marks:10, subItems:[], documents:['SDG portfolio: research, projects, student activities'], imagePlaceholders:[], tables:[] },
    { id:'C3.7', name:'Attainment of Course Outcomes', marks:25, subItems:[{id:'C3.7.1',name:'Assessment Tools & Processes',marks:5},{id:'C3.7.2',name:'CO Attainment Records',marks:20}], documents:['Assessment tools description','CO attainment calculation spreadsheets'], imagePlaceholders:[], tables:[] },
    { id:'C3.8', name:'Attainment of POs and PSOs', marks:25, subItems:[], documents:['Direct attainment via Course-PO matrix (Table 3.8.1)','Indirect attainment via surveys (Table 3.8.2)','Overall PO/PSO attainment (Table 3.8.3)'], imagePlaceholders:[], tables:['Table No.3.8.1','Table No.3.8.2','Table No.3.8.3'] },
  ]},
  { id:'C4', name:"Students' Performance", marks:120, subCriteria:[
    { id:'C4.1', name:'Enrolment Ratio (First Year)', marks:20, subItems:[], documents:['Admission data for CAY, CAYm1, CAYm2 (Table 4A)','ER formula data (Table 4.1.1)'], imagePlaceholders:[], tables:['Table No.4A','Table No.4.1.1'], formula:'ER = (N1+N4)/N; Average ER = (ER_1+ER_2+ER_3)/3' },
    { id:'C4.2', name:'Success Rate', marks:15, subItems:[], documents:['Graduation data for LYG, LYGm1, LYGm2 (Table 4C)','SR formula data (Table 4.2.1)'], imagePlaceholders:[], tables:['Table No.4C','Table No.4.2.1'], formula:'SR = (B/A)*100; Average SR = (SR_1+SR_2+SR_3)/3' },
    { id:'C4.3', name:'Academic Performance (1st Year)', marks:10, subItems:[], documents:['1st year GPA/marks data (Table 4.3.1)'], imagePlaceholders:[], tables:['Table No.4.3.1'], formula:'API = X*(Y/Z)' },
    { id:'C4.4', name:'Academic Performance (2nd Year)', marks:10, subItems:[], documents:['2nd year GPA/marks data'], imagePlaceholders:[], tables:[], formula:'API = X*(Y/Z)' },
    { id:'C4.5', name:'Academic Performance (3rd Year)', marks:10, subItems:[], documents:['3rd year GPA/marks data'], imagePlaceholders:[], tables:[], formula:'API = X*(Y/Z)' },
    { id:'C4.6', name:'Placement, Higher Studies & Entrepreneurship', marks:30, subItems:[], documents:['Placement records with appointment letters','Higher studies admissions (GATE/GRE)','Entrepreneurship records (Table 4.6.1)'], imagePlaceholders:[], tables:['Table No.4.6.1'], formula:'PI = ((X+Y+Z)/FS)*100' },
    { id:'C4.7', name:'Professional Activities', marks:25, subItems:[{id:'C4.7.1',name:'Professional Societies/Clubs',marks:5},{id:'C4.7.2',name:'Student Participation in Events',marks:10},{id:'C4.7.3',name:'Department Publications',marks:5},{id:'C4.7.4',name:'Student Publications',marks:5}], documents:['Active professional society list (Table 4.7.1.1)','Events organized (Table 4.7.1.2)','Student participation in hackathons (Table 4.7.2.1)','Student research publications (Table 4.7.4.1)'], imagePlaceholders:['Photo: Professional society event'], tables:['Table No.4.7.1.1','Table No.4.7.2.1','Table No.4.7.4.1'] },
  ]},
  { id:'C5', name:'Faculty Information', marks:100, subCriteria:[
    { id:'C5.1', name:'Student-Faculty Ratio (SFR)', marks:30, subItems:[], documents:['Faculty details table (Table 5A)','SFR calculation (Table 5.1.2)'], imagePlaceholders:[], tables:['Table No.5A','Table No.5.1.2'], formula:'SFR = S/TF; Target < 20:1' },
    { id:'C5.2', name:'Faculty Qualification', marks:25, subItems:[], documents:['Ph.D. and PG degree certificates','FQI calculation (Table 5.2.1)'], imagePlaceholders:[], tables:['Table No.5.2.1'], formula:'FQI = 2.5*[(10X+4Y)/RF]' },
    { id:'C5.3', name:'Faculty Cadre Proportion', marks:25, subItems:[], documents:['Faculty cadre details (Table 5.3.1)'], imagePlaceholders:[], tables:['Table No.5.3.1'] },
    { id:'C5.4', name:'Visiting/Adjunct Faculty', marks:10, subItems:[], documents:['Visiting faculty list with hours (Table 5.4.1)'], imagePlaceholders:[], tables:['Table No.5.4.1'] },
    { id:'C5.5', name:'Faculty Retention', marks:10, subItems:[], documents:['Faculty retention ratio (Table 5.5.1)'], imagePlaceholders:[], tables:['Table No.5.5.1'], formula:'FR = ((A*0+B*1+C*2+D*3+E*4)/RF)*2.50' },
  ]},
  { id:'C6', name:'Faculty Contributions', marks:120, subCriteria:[
    { id:'C6.1', name:'Professional Development Activities', marks:60, subItems:[{id:'C6.1.1',name:'Professional Society Memberships',marks:5},{id:'C6.1.2',name:'Faculty as Resource Persons/Participants',marks:15},{id:'C6.1.3',name:'Faculty MOOC Certification',marks:10},{id:'C6.1.4',name:'FDP/STTP Organized',marks:10},{id:'C6.1.5',name:'Faculty Support in Student Projects',marks:10},{id:'C6.1.6',name:'Faculty Internship/Industry Collaboration',marks:10}], documents:['Professional society memberships (Table 6.1.1.1)','STTP/FDP participation (Table 6.1.2.1.1)','MOOC certificates (Table 6.1.3.1)','FDP/STTP organized (Table 6.1.4.1)'], imagePlaceholders:['Photo: FDP/STTP event'], tables:['Table No.6.1.1.1','Table No.6.1.2.1.1','Table No.6.1.3.1','Table No.6.1.4.1'] },
    { id:'C6.2', name:'Research, Publications and Consultancy', marks:60, subItems:[{id:'C6.2.1',name:'Research Papers Published',marks:25},{id:'C6.2.2',name:'Books/Book Chapters',marks:5},{id:'C6.2.3',name:'Sponsored Research Projects',marks:15},{id:'C6.2.4',name:'Consultancy Projects',marks:5},{id:'C6.2.5',name:'Intellectual Property',marks:10}], documents:['Scopus/WoS indexed papers (Table 6.2.1.1)','Books/chapters (Table 6.2.2.1)','Sponsored project grants (Table 6.2.3.1)','Patent/copyright certificates (Table 6.2.5.1)'], imagePlaceholders:[], tables:['Table No.6.2.1.1','Table No.6.2.2.1','Table No.6.2.3.1','Table No.6.2.5.1'] },
  ]},
  { id:'C7', name:'Facilities and Technical Support', marks:100, subCriteria:[
    { id:'C7.1', name:'Adequacy of Infrastructure', marks:30, subItems:[], documents:['Classrooms, tutorial rooms, labs inventory','Infrastructure vs. student ratio analysis'], imagePlaceholders:['Photo: Classroom overview','Photo: Lab facilities'], tables:[] },
    { id:'C7.2', name:'Equipment and Software in Laboratories', marks:30, subItems:[], documents:['Lab equipment list with quantities and costs','Licensed software list','Stock registers and purchase invoices'], imagePlaceholders:['Photo: Lab equipment','Photo: Computer lab'], tables:[] },
    { id:'C7.3', name:'Maintenance and Safety Measures', marks:20, subItems:[], documents:['Fire safety certificates','Maintenance registers','Safety signage documentation'], imagePlaceholders:['Photo: Fire extinguisher/safety equipment'], tables:[] },
    { id:'C7.4', name:'Library and Information Resources', marks:20, subItems:[], documents:['Library book count and journals','E-resource subscriptions (IEEE, Springer)','Digital library/OPAC system details'], imagePlaceholders:['Photo: Library interior'], tables:[] },
  ]},
  { id:'C8', name:'Continuous Improvement', marks:80, subCriteria:[
    { id:'C8.1', name:'Actions Taken Based on Assessment Results', marks:40, subItems:[], documents:['Action Taken Reports (ATRs)','How assessment data led to program improvements','Before/after comparison documentation'], imagePlaceholders:[], tables:[] },
    { id:'C8.2', name:'Academic Audit Findings and Compliance', marks:40, subItems:[], documents:['Internal audit reports','External audit reports','Compliance documentation and corrective actions'], imagePlaceholders:[], tables:[] },
  ]},
  { id:'C9', name:'Student Support and Governance', marks:120, subCriteria:[
    { id:'C9.1', name:'Governance Structure', marks:25, subItems:[], documents:['Governing Body meeting minutes','College Development Committee minutes','Organizational chart'], imagePlaceholders:['Photo: Governing body meeting'], tables:[] },
    { id:'C9.2', name:'Budget and Financial Support', marks:25, subItems:[], documents:['Audited balance sheets (3 years)','Program-wise budget utilization'], imagePlaceholders:[], tables:[] },
    { id:'C9.3', name:'Student Mentoring and Counseling', marks:25, subItems:[], documents:['Mentoring system documentation','Mentor-mentee allocation records','Counseling records'], imagePlaceholders:[], tables:[] },
    { id:'C9.4', name:'Anti-Ragging and Student Welfare', marks:20, subItems:[], documents:['Anti-ragging committee compliance certificates','Grievance redressal committee records'], imagePlaceholders:[], tables:[] },
    { id:'C9.5', name:'E-Governance and ICT Infrastructure', marks:25, subItems:[], documents:['LMS usage proof (Google Classroom, Moodle)','ERP system documentation','ICT-enabled classroom/lab details'], imagePlaceholders:['Screenshot: LMS dashboard'], tables:[] },
  ]},
];

export const TOTAL_MARKS = 1000;
