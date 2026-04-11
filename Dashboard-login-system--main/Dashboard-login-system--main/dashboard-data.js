'use strict';

/* ─── Current Academic Year ─────────────────────────────── */
function getCurrentAcademicYear() {
  const y = new Date().getFullYear(), m = new Date().getMonth() + 1;
  return m >= 6 ? `${y}-${String(y+1).slice(2)}` : `${y-1}-${String(y).slice(2)}`;
}

/* ─── NBA SAR Tier-2 UG Engineering — 9 Criteria ────────── */
const NBA_CRITERIA_LIST = [
  {code:'C1', name:'Program Curriculum & Teaching-Learning Processes', marks:120},
  {code:'C2', name:'Course Outcomes & Program Outcomes',               marks:100},
  {code:'C3', name:"Students' Performance",                            marks:150},
  {code:'C4', name:'Faculty Information & Contributions',              marks:200},
  {code:'C5', name:'Facilities & Technical Support',                   marks:80 },
  {code:'C6', name:'Continuous Improvement',                           marks:50 },
  {code:'C7', name:'First Year Academics',                             marks:50 },
  {code:'C8', name:'Student Support Systems',                          marks:50 },
  {code:'C9', name:'Governance, Institutional Support & Financial Resources', marks:200},
];

/* ─── NBA Criteria Skeletons (Structure/Templates) ───────── */
const NBA_SKELETONS = {
  C1: {
    desc: 'Assess curriculum design, alignment with PEOs, and quality of teaching-learning processes.',
    sections: [
      {
        code:'1.1', title:'Vision, Mission & Program Educational Objectives', marks:10,
        desc:'Define Vision, Mission, PEOs and their correlation.',
        fields:[
          {id:'vision',    label:'Institute Vision Statement',       type:'textarea', hint:'State the complete Vision of the Institute/Department'},
          {id:'mission',   label:'Institute Mission Statements',     type:'textarea', hint:'List all Mission Statements (M1, M2, ...) of the Institute/Department'},
          {id:'peos',      label:'Program Educational Objectives',   type:'textarea', hint:'List PEO1, PEO2, ... (3–5 objectives achievable 3–5 years after graduation)'},
          {id:'peo_corr',  label:'PEO ↔ Mission Correlation',       type:'textarea', hint:'Map each PEO to Mission statements. Justify alignment.'},
          {id:'peo_rev',   label:'PEO Review Process & Frequency',  type:'textarea', hint:'How and how often are PEOs reviewed? (e.g., annual BoS, stakeholder input)'},
        ],
        docs:['Mission-Vision document (management/BoG approved)','BoG/Academic Council meeting minutes showing PEO approval','PEO-Mission correlation table/matrix']
      },
      {
        code:'1.2', title:'Program Curriculum', marks:30,
        desc:'Document curriculum structure, alignment with guidelines, and identified gaps.',
        fields:[
          {id:'struc',     label:'Curriculum Overview',                   type:'textarea', hint:'Semesters, credit distribution, categories: BSC/ESC/PCC/PEC/OE/HSS/MC'},
          {id:'courses',   label:'Semester-wise Course List',             type:'table', cols:['Sem','Code','Course Name','L','T','P','Credits','Category'], hint:'Complete course list across all semesters'},
          {id:'align',     label:'University/AICTE Guideline Alignment',  type:'textarea', hint:'How curriculum follows AICTE norms (electives, skill courses, internship credits, etc.)'},
          {id:'industry',  label:'Industry Relevance',                    type:'textarea', hint:'Emerging technologies, market needs, industry feedback incorporated'},
          {id:'gaps',      label:'Curriculum Gaps & Corrective Actions',  type:'textarea', hint:'Identified gaps between curriculum and industry expectations + steps taken'},
          {id:'design_pct',label:'Design/Open-Ended Content (%)',         type:'number',   hint:'% of curriculum involving design/open-ended problems (target ≥ 20%)'},
          {id:'revision',  label:'Last Curriculum Revision (Year & Details)', type:'text', hint:'e.g., 2023 — Added AI/ML electives, industry project credits'},
        ],
        docs:['Approved Scheme & Syllabus','BoS minutes for curriculum approval','Gap analysis report','Evidence of stakeholder (industry/alumni) input']
      },
      {
        code:'1.3', title:'Teaching-Learning Processes', marks:80,
        desc:'Quality and effectiveness of teaching methods, assessments, and learner support.',
        subSections:[
          {
            code:'1.3.1', title:'Academic Calendar & Adherence',
            fields:[
              {id:'calendar',   label:'Academic Calendar',      type:'textarea', hint:'Teaching weeks, internal tests, practicals, holidays, events for current/recent semester'},
              {id:'adherence',  label:'Adherence Evidence',     type:'textarea', hint:'% syllabus covered vs planned. Sample course completion reports from 2–3 faculty'},
            ],
            docs:['Institute Academic Calendar','Course completion/lecture delivery registers (2–3 sample courses)']
          },
          {
            code:'1.3.2', title:'Instructional Methods & ICT Usage',
            fields:[
              {id:'methods', label:'Teaching Methods Used',      type:'textarea', hint:'Traditional, PPT, ICT, flipped classroom, PBL, collaborative learning — give % breakdown'},
              {id:'ict',     label:'ICT Tools & Platforms',      type:'textarea', hint:'LMS (Moodle/Google Classroom), NPTEL, simulation, virtual labs, etc.'},
              {id:'innov',   label:'Innovative Practices',       type:'textarea', hint:'Hackathons, paper presentations, industry case studies, peer teaching, etc.'},
            ],
            docs:['Sample lecture notes/PPTs','LMS screenshots or usage stats','Evidence of ICT tools in teaching']
          },
          {
            code:'1.3.3', title:'Quality of Question Papers & Assignments',
            fields:[
              {id:'qp',      label:'Question Paper CO Mapping',   type:'textarea', hint:'How are internal exam papers mapped to COs and Bloom\'s levels? Analysis for 2–3 courses'},
              {id:'assign',  label:'Assignment Quality',          type:'textarea', hint:'Open-ended/design assignments targeting Bloom\'s L3–L6. Examples provided.'},
              {id:'blooms',  label:"Bloom's Level Distribution",  type:'table', cols:['Type','L1 Remember','L2 Understand','L3 Apply','L4 Analyze','L5 Evaluate','L6 Create'], hint:'Approx % of questions/tasks at each Bloom\'s level for Internal Tests and Assignments'},
            ],
            docs:['Sample internal exam papers (2–3 courses)','Sample assignments','CO-Bloom\'s mapping sheets']
          },
          {
            code:'1.3.4', title:'Support for Slow & Advanced Learners',
            fields:[
              {id:'slow_id',  label:'Identifying Slow Learners',        type:'textarea', hint:'Method: internal test marks, attendance, class performance. Frequency?'},
              {id:'slow_sup', label:'Support Measures for Slow Learners',type:'textarea', hint:'Remedial classes, extra tutorials, personal mentoring, peer assistance'},
              {id:'fast',     label:'Enrichment for Advanced Learners',  type:'textarea', hint:'Advanced topics, research projects, competitive exam coaching, MOOCs encouraged'},
            ],
            docs:['Slow learner identification and tracking records','Remedial class attendance registers','Advanced learner activity records/achievements']
          },
          {
            code:'1.3.5', title:'Student Projects & Industry Interaction',
            fields:[
              {id:'projects', label:'Projects List (Last 2 Years)',      type:'table', cols:['Title','Team Size','Industry Partner','POs Addressed','Outcome'], hint:'Mini and major projects; note industry-collaborated ones'},
              {id:'ind_int',  label:'Industry Interaction in Teaching',  type:'textarea', hint:'Guest lectures, industrial visits, live projects, internships integrated in curriculum'},
            ],
            docs:['Project title list (last 2 years)','Sample project reports','Industry MoUs/collaboration letters']
          },
        ]
      }
    ]
  },

  C2: {
    desc: 'Define and measure attainment of Course Outcomes (COs) and Program Outcomes (POs).',
    sections: [
      {
        code:'2.1', title:'COs, POs & PSOs — Definition & Relevance', marks:20,
        desc:'State all COs for each course, 12 POs, and 2–3 PSOs with CO-PO mapping.',
        fields:[
          {id:'cos',       label:'Course Outcomes (All Courses)',   type:'textarea', hint:'For each course: CO1, CO2, ... mapped to Bloom\'s Taxonomy level. Format: [Course Code] → CO1: ...'},
          {id:'pos',       label:'Program Outcomes (PO1–PO12)',     type:'textarea', hint:'State all 12 POs as per NBA. PO1: Engineering Knowledge, PO2: Problem Analysis, ... PO12: Life-long Learning'},
          {id:'psos',      label:'Program Specific Outcomes (PSOs)',type:'textarea', hint:'2–3 PSOs specific to your program reflecting specialization (e.g., PSO1: Apply electrical fundamentals to power systems)'},
          {id:'co_po_map', label:'CO-PO Mapping Matrix',           type:'table', cols:['Course/CO','PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12','PSO1','PSO2'], hint:'Correlation level: 3=High, 2=Medium, 1=Low, —=No mapping'},
        ],
        docs:['CO documents for all courses','CO-PO mapping matrix (all courses)','Faculty BOS minutes confirming COs']
      },
      {
        code:'2.2', title:'CO Attainment', marks:40,
        desc:'Calculate and document direct and indirect CO attainment for each course.',
        fields:[
          {id:'co_meth',     label:'CO Attainment Methodology',    type:'textarea', hint:'Describe method: direct (internal exams, assignments, lab) + indirect (student feedback, exit survey). Weightage used (e.g., 80% direct + 20% indirect)'},
          {id:'co_direct',   label:'Direct Attainment Summary',    type:'table', cols:['Course Code','CO1','CO2','CO3','CO4','CO5','Direct Avg'], hint:'CO attainment from internal exams/assignments (scale 0–3)'},
          {id:'co_indirect', label:'Indirect Attainment',         type:'textarea', hint:'CO attainment from student exit survey / course feedback. Summary per course.'},
          {id:'co_overall',  label:'Overall CO Attainment Table', type:'table', cols:['Course Code','Course Name','Direct','Indirect','Overall','Target','Attained?'], hint:'Final CO attainment with target comparison'},
          {id:'co_gap',      label:'Gap Analysis & Corrective Actions', type:'textarea', hint:'Courses/COs not meeting target — corrective actions taken in following semester'},
        ],
        docs:['CO attainment calculation sheets (course-wise)','Marks data / CIA sheets','Student feedback forms and analysis','Exit survey forms']
      },
      {
        code:'2.3', title:'PO & PSO Attainment', marks:40,
        desc:'Calculate PO attainment from CO attainment using CO-PO mapping.',
        fields:[
          {id:'po_meth',     label:'PO Attainment Methodology',   type:'textarea', hint:'How is PO attainment computed from CO attainment? Describe the formula/weightage method used'},
          {id:'po_direct',   label:'Direct PO Attainment Table',  type:'table', cols:['PO','Attainment','Target','Status'], hint:'Direct attainment for PO1 through PO12 (scale 0–3)'},
          {id:'pso_attain',  label:'PSO Attainment Table',        type:'table', cols:['PSO','Attainment','Target','Status'], hint:'PSO1, PSO2 attainment values'},
          {id:'po_indirect', label:'Indirect PO Attainment',      type:'textarea', hint:'PO attainment from alumni survey, employer survey, exit survey data'},
          {id:'po_gap',      label:'PO Gap Analysis & Actions',   type:'textarea', hint:'POs not meeting target — specific actions planned/taken to improve'},
        ],
        docs:['PO attainment calculation sheet','Alumni/employer survey questionnaire and data','Gap analysis and action plan document']
      }
    ]
  },

  C3: {
    desc: "Track student enrollment, academic results, placements, higher studies, and professional activities.",
    sections: [
      {
        code:'3.1', title:'Enrollment Ratio', marks:15,
        fields:[
          {id:'enr',  label:'Enrollment Data (Last 5 Years)', type:'table', cols:['Year','Sanctioned Intake','Enrolled (Gen)','Enrolled (TFW)','Total','% Filled'], hint:'Year-wise enrollment. TFW = Tuition Fee Waiver category'},
        ],
        docs:['Admission records / enrollment data (last 5 years)','Sanctioned intake approval letters']
      },
      {
        code:'3.2', title:'Success Rate (No History of Backlog)', marks:25,
        fields:[
          {id:'sr',   label:'Success Rate Table (Last 5 Batches)', type:'table', cols:['Batch','Admitted','Passed Without Backlog in 4 Yrs','Success Rate %'], hint:'Students who passed all semesters without ever having a backlog'},
          {id:'sr_actions', label:'Actions to Improve Pass Rate', type:'textarea', hint:'Steps taken to help students avoid backlogs (remedial, counseling, etc.)'},
        ],
        docs:['University result records (all semesters for 5 batches)']
      },
      {
        code:'3.3', title:'Academic Performance in University Exams', marks:25,
        fields:[
          {id:'ap',  label:'Academic Performance Index (Last 5 Years)', type:'table', cols:['Year','Sem','Appeared','Passed','Pass %','Class Avg Marks'], hint:'Semester-wise results; higher semesters (5th–8th) are more relevant'},
          {id:'ap_trend', label:'Performance Trend Analysis', type:'textarea', hint:'Improving/declining trend? Reasons and corrective steps'},
        ],
        docs:['University mark sheets / result records','Analysis report of academic performance']
      },
      {
        code:'3.4', title:'Placement, Higher Studies & Entrepreneurship', marks:35,
        fields:[
          {id:'pl',    label:'Placement Data (Last 2 Years)',       type:'table', cols:['Year','Graduates','Placed','Higher Studies','Entrepreneurship','Others'], hint:'Year-wise data. "Others" = government jobs, not placed, etc.'},
          {id:'pl_co', label:'Recruiting Companies',               type:'textarea', hint:'List companies with number of recruitments in last 2 years'},
          {id:'pl_pkg', label:'Salary Package Details',            type:'textarea', hint:'Average, min, max package. Any exceptional placements?'},
        ],
        docs:['Placement records / offer letters (sample)','Higher studies admission proof (sample)','TPO placement report']
      },
      {
        code:'3.5', title:'Student Achievements in Professional Activities', marks:25,
        fields:[
          {id:'pa',   label:'Student Achievements (Last 2 Years)', type:'table', cols:['Type','Event/Competition','Level','Students','Achievement'], hint:'Technical competitions, publications, patents, cultural, sports achievements'},
        ],
        docs:['Award certificates (sample)','Event participation proof','Student publication proofs']
      },
      {
        code:'3.6', title:'Dropout Rate', marks:25,
        fields:[
          {id:'dr',       label:'Dropout Data (Last 5 Years)', type:'table', cols:['Batch','Admitted','Dropped Out','Dropout %'], hint:'Students who left before program completion'},
          {id:'dr_cause', label:'Causes & Remedies',           type:'textarea', hint:'Why students drop out and what institutional steps are taken to reduce dropout'},
        ],
        docs:['Withdrawal / TC records','Counseling records for at-risk students']
      }
    ]
  },

  C4: {
    desc: 'Document faculty qualifications, experience, research, publications, and professional development.',
    sections: [
      {
        code:'4.1', title:'Student-Faculty Ratio (SFR)', marks:20,
        fields:[
          {id:'sfr', label:'SFR Data (Last 5 Years)', type:'table', cols:['Year','Total Students','Total Faculty','SFR'], hint:'Count only regular faculty. NBA norm ≤ 20:1 for good score'},
        ],
        docs:['Approved faculty list','Sanctioned strength data']
      },
      {
        code:'4.2', title:'Faculty Qualifications', marks:35,
        fields:[
          {id:'fq_list', label:'Faculty Qualification Details', type:'table', cols:['Name','Designation','Highest Qual.','Specialization','PhD?','Experience (Yrs)','Publications'], hint:'All faculty with complete qualification details'},
          {id:'fq_phd',  label:'% Faculty with PhD',           type:'number', hint:'(PhDs / Total Faculty) × 100. Target ≥ 40% for full marks'},
        ],
        docs:['Faculty appointment letters','PhD certificates','Degree certificates all faculty','Experience certificates']
      },
      {
        code:'4.3', title:'Faculty Adequacy & Retention', marks:25,
        fields:[
          {id:'fa_count',  label:'Faculty Count Breakdown',     type:'textarea', hint:'Regular: ___, Contract: ___, Visiting: ___. Justify if using visiting/contract faculty'},
          {id:'fa_ret',    label:'Retention Rate (Last 3 Yrs)', type:'table', cols:['Year','Faculty at Start','Left','Joined','End Count','Retention %'], hint:'High retention (>85%) indicates good institutional culture'},
        ],
        docs:['Faculty joining/resignation records (last 3 years)']
      },
      {
        code:'4.4', title:'Faculty as Professionals (FDPs & Memberships)', marks:40,
        fields:[
          {id:'fp_fdp',   label:'FDP/STTP/Workshop (Last 3 Yrs)', type:'table', cols:['Faculty Name','Program','Organizer','Duration','Year'], hint:'Faculty Development Programs, Short Term Training Programs attended'},
          {id:'fp_mem',   label:'Professional Body Memberships',   type:'textarea', hint:'IEEE, ISTE, IEI, CSI — list faculty and their memberships'},
          {id:'fp_award', label:'Awards & Recognitions',           type:'textarea', hint:'Best teacher awards, research awards, IEI/IEEE recognition'},
        ],
        docs:['FDP completion certificates','Professional membership certificates/cards']
      },
      {
        code:'4.5', title:'Research, Publications & Funded Projects', marks:40,
        fields:[
          {id:'rp_pub',    label:'Research Publications (Last 3 Yrs)', type:'table', cols:['Faculty','Title','Journal/Conf.','Scopus/SCI?','Impact Factor','Year'], hint:'Peer-reviewed journals and conference publications'},
          {id:'rp_funded', label:'Funded Research Projects',           type:'table', cols:['Faculty','Project Title','Funding Agency','Amount (₹)','Duration','Status'], hint:'DST, AICTE, UGC, industry funded projects'},
          {id:'rp_patent', label:'Patents',                            type:'table', cols:['Faculty','Title','Application No.','Status','Year'], hint:'Filed, published, or granted patents'},
          {id:'rp_consult',label:'Consultancy Projects',              type:'table', cols:['Faculty','Client','Amount (₹)','Year'], hint:'Industry consultancy undertaken by faculty'},
        ],
        docs:['Publication first pages (sample)','Funding sanction letters','Patent certificates','Consultancy agreements']
      },
      {
        code:'4.6', title:'Innovations in Teaching & E-Content', marks:40,
        fields:[
          {id:'it_ec',   label:'E-Content Developed',         type:'table', cols:['Faculty','Course','Type (Video/Notes/etc.)','Platform/URL'], hint:'YouTube videos, NPTEL content, Spoken Tutorial, SWAYAM MOOCs developed by faculty'},
          {id:'it_mooc', label:'MOOCs/Online Courses Offered', type:'textarea', hint:'Faculty who coordinated/delivered online programs'},
        ],
        docs:['E-content links or screenshots','MOOC certificates issued']
      }
    ]
  },

  C5: {
    desc: 'Document classroom, laboratory, computing facilities and technical support infrastructure.',
    sections: [
      {
        code:'5.1', title:'Classrooms & Tutorial Rooms', marks:10,
        fields:[
          {id:'cr', label:'Classroom Details', type:'table', cols:['Room No.','Type','Area (sq.m)','Seating Cap.','ICT Facilities'], hint:'List all classrooms/tutorial rooms with facilities (projector, smart board, AC, etc.)'},
        ],
        docs:['Floor plan / layout diagram','Equipment list for classrooms']
      },
      {
        code:'5.2', title:'Laboratories', marks:35,
        fields:[
          {id:'lab_list',  label:'Laboratory Details',     type:'table', cols:['Lab Name','Area (sq.m)','Capacity','Major Equipment','Courses Served','Safety'], hint:'All labs with key equipment and safety features'},
          {id:'lab_inv',   label:'Lab Inventory Summary',  type:'textarea', hint:'Total equipment units, approximate value, recent additions'},
          {id:'lab_maint', label:'Maintenance Plan',       type:'textarea', hint:'Annual maintenance/calibration schedule, record-keeping process'},
          {id:'lab_safe',  label:'Safety Provisions',      type:'textarea', hint:'First aid, fire extinguisher, safety signage, earthing, PPE availability'},
        ],
        docs:['Lab inventory lists (each lab)','Equipment calibration records','Safety audit/inspection report']
      },
      {
        code:'5.3', title:'Computing Facilities', marks:25,
        fields:[
          {id:'cf_count',  label:'No. of Computing Systems',   type:'number',   hint:'Total computers/workstations available for students'},
          {id:'cf_spec',   label:'System Specifications',      type:'textarea', hint:'Processor, RAM, storage details of systems (highlight high-end workstations)'},
          {id:'cf_net',    label:'Internet & Network',         type:'textarea', hint:'Bandwidth, Wi-Fi coverage, type of network (LAN, fiber), 24×7 availability?'},
          {id:'cf_soft',   label:'Licensed Software',          type:'table', cols:['Software','Version','Licenses','Purpose'], hint:'All licensed and open-source software available'},
        ],
        docs:['Computer purchase receipts/invoices','Software license certificates','Network diagram']
      },
      {
        code:'5.4', title:'Technical Support Staff', marks:10,
        fields:[
          {id:'ts_list', label:'Technical Staff Details', type:'table', cols:['Name','Designation','Qualification','Experience','Lab Assigned'], hint:'Lab assistants, system administrators, technical assistants'},
        ],
        docs:['Appointment letters','Qualification certificates of technical staff']
      }
    ]
  },

  C6: {
    desc: 'Document actions taken based on previous assessment results for continuous improvement.',
    sections: [
      {
        code:'6.1', title:'Actions Taken Based on Assessment Results', marks:30,
        fields:[
          {id:'ci_prev',    label:'Previous Weaknesses / Gaps',  type:'textarea', hint:'List weaknesses from previous NBA visit, accreditation report, or internal quality audit'},
          {id:'ci_actions', label:'Actions Taken',               type:'table', cols:['Weakness/Gap','Action Taken','Timeline','Outcome','Evidence'], hint:'Action for each identified weakness — must show measurable outcome'},
        ],
        docs:['Previous NBA assessment report (if any)','Internal audit reports','Action taken reports with evidence']
      },
      {
        code:'6.2', title:'Improvement in CO-PO Attainment Level', marks:20,
        fields:[
          {id:'ci_trend', label:'CO/PO Attainment Trend (Last 3 Yrs)', type:'table', cols:['Year','Avg CO Attainment','Avg PO Attainment','Corrective Actions'], hint:'Year-on-year improvement in attainment levels. Highlight any significant changes'},
        ],
        docs:["CO-PO attainment data for last 3 years (semester-wise)"]
      }
    ]
  },

  C7: {
    desc: 'Document faculty qualifications, academic performance, and CO attainment for first-year students.',
    sections: [
      {
        code:'7.1', title:'First Year Student-Faculty Ratio', marks:15,
        fields:[
          {id:'fy_sfr', label:'First Year SFR (Last 3 Yrs)', type:'table', cols:['Year','First Year Students','Faculty Teaching FY','SFR'], hint:'Only faculty teaching first year common courses'},
        ],
        docs:['First year faculty list','Student strength data']
      },
      {
        code:'7.2', title:'First Year Academic Performance', marks:25,
        fields:[
          {id:'fy_result', label:'First Year Results (Last 5 Yrs)', type:'table', cols:['Year','Batch','Appeared','Passed','Pass %','Avg Marks'], hint:'Semester I and II results for first year students'},
        ],
        docs:['First year university result records']
      },
      {
        code:'7.3', title:'Attainment of COs in First Year Courses', marks:10,
        fields:[
          {id:'fy_co', label:'CO Attainment for FY Courses', type:'table', cols:['Course','CO','Attainment','Target','Met?'], hint:'CO attainment for Mathematics, Physics, Chemistry, Basic Engineering courses'},
        ],
        docs:['CO attainment calculation sheets for first year courses']
      }
    ]
  },

  C8: {
    desc: 'Document mentoring, counseling, career guidance, and student welfare support systems.',
    sections: [
      {
        code:'8.1', title:'Student Mentoring System', marks:20,
        fields:[
          {id:'sm_ratio',   label:'Mentor-Mentee Ratio',      type:'text',     hint:'e.g., 1:20 — one mentor per 20 students. NBA target ≤ 1:20'},
          {id:'sm_process', label:'Mentoring Process',        type:'textarea', hint:'How assigned? Meeting frequency? What issues tracked? How documented?'},
          {id:'sm_records', label:'Record-Keeping',           type:'textarea', hint:'Type of records maintained — register, digital, reports to HOD'},
        ],
        docs:['Mentor-mentee allotment list','Mentoring meeting records/registers (sample)','Mentoring summary report']
      },
      {
        code:'8.2', title:'Student Counseling', marks:10,
        fields:[
          {id:'sc_fac',    label:'Counseling Facility',        type:'textarea', hint:'Professional counselor availability, anti-ragging cell, women grievance cell'},
          {id:'sc_prog',   label:'Student Welfare Programs',   type:'textarea', hint:'Mental health workshops, stress management, yoga, personality development programs'},
        ],
        docs:['Counseling records (anonymized)','Anti-ragging committee constitution & meetings','Grievance redressal records']
      },
      {
        code:'8.3', title:'Career Guidance & Placement Support', marks:10,
        fields:[
          {id:'cg_act',  label:'Career Guidance Activities', type:'table', cols:['Activity','Date','Resource Person','Participants','Outcome'], hint:'Aptitude training, mock interviews, resume workshops, guest lectures'},
          {id:'cg_tpo',  label:'Training & Placement Cell',  type:'textarea', hint:'TPO role, companies registered, pre-placement training, industry tie-ups'},
        ],
        docs:['Career guidance activity reports','TPO activity records','Company MoUs for placement']
      },
      {
        code:'8.4', title:'Entrepreneurship & Innovation Cell', marks:10,
        fields:[
          {id:'ei_cell',    label:'E-Cell / Incubation Centre', type:'textarea', hint:'Existence of entrepreneurship cell, incubation centre, startup support ecosystem'},
          {id:'ei_student', label:'Student Startups & Projects', type:'table', cols:['Student Name','Startup/Idea','Domain','Year','Status'], hint:'Any student who has launched a startup or innovative product'},
        ],
        docs:['E-Cell constitution and activity records','Startup registration proofs (if any)']
      }
    ]
  },

  C9: {
    desc: 'Document governance structure, financial resources, library, and institutional support for the program.',
    sections: [
      {
        code:'9.1', title:'Governance & Leadership', marks:30,
        fields:[
          {id:'gov_struc',  label:'Governance Structure',       type:'textarea', hint:'Management → BoG → Academic Council → IQAC → Department structure. Roles and responsibilities'},
          {id:'gov_comm',   label:'Key Committees & Meetings',  type:'table', cols:['Committee','Frequency','Last Meeting','Key Decisions'], hint:'BoG, Academic Council, IQAC, Anti-Ragging, Grievance, etc.'},
          {id:'gov_iqac',   label:'IQAC Role in Quality',       type:'textarea', hint:'How IQAC drives quality improvement, audits, and accreditation support'},
        ],
        docs:['Governance structure chart','Committee constitution orders','Meeting minutes (last 3)']
      },
      {
        code:'9.2', title:'Financial Resources & Budget', marks:40,
        fields:[
          {id:'fin_budget', label:'Annual Budget Allocation (Last 3 Yrs)', type:'table', cols:['Year','Total Institute','Dept Allocation','R&D','Labs','Library','Faculty Dev.'], hint:'Budget allocated to the department across key heads'},
          {id:'fin_util',   label:'Budget Utilization',                   type:'textarea', hint:'% utilized. Major expenditures. Any surplus or deficit and reasons'},
          {id:'fin_ext',    label:'External Funding Received',            type:'textarea', hint:'Grants from DST, AICTE, DBT, industry, alumni donations, etc.'},
        ],
        docs:['Audited financial statements','Budget utilization certificates','Grant sanction letters']
      },
      {
        code:'9.3', title:'Library Facilities', marks:30,
        fields:[
          {id:'lib_books',  label:'Library Holdings',           type:'table', cols:['Category','No. of Titles','Volumes / Copies'], hint:'Program-specific books, general books, journals, magazines, project reports'},
          {id:'lib_digital',label:'Digital Resources',         type:'textarea', hint:'e-journals (IEEE/Elsevier/NPTEL), e-library access, online databases subscribed'},
          {id:'lib_hours',  label:'Working Hours & Access',    type:'text',     hint:'e.g., 8 AM – 8 PM; Open on holidays during exam; Reading room capacity'},
        ],
        docs:['Library catalogue (program-specific)','Digital resource subscription receipts']
      },
      {
        code:'9.4', title:'Industry & Alumni Interaction', marks:30,
        fields:[
          {id:'ia_mou',     label:'MoUs with Industries',       type:'table', cols:['Industry Partner','Purpose','Signed Date','Activities Done'], hint:'Active MoUs with tangible outcomes (not just paper MoUs)'},
          {id:'ia_alumni',  label:'Alumni Contributions',       type:'textarea', hint:'Alumni association activities, guest lectures, donations, scholarships, mentoring'},
        ],
        docs:['MoU documents','Industry visit/collaboration records','Alumni association records']
      },
      {
        code:'9.5', title:'Innovative Institutional Practices', marks:20,
        fields:[
          {id:'ip_list',  label:'Best / Innovative Practices', type:'textarea', hint:'Unique practices of the institution that support the program — beyond normal requirements'},
        ],
        docs:['Evidence/reports of innovative practices']
      }
    ]
  }
};

/* ─── Default empty admin (pre-seeded) ─────────────────── */
function _defaultData() {
  return {
    college: {name:'', full:'', address:'', phone:'', email:'', website:'', established:'', affiliation:'', naac:'', nba:''},
    depts: [],
    programs: [],
    faculty: [
      {id:'admin01', name:'Administrator', email:'admin@college.edu', pwd:'admin123', desg:'Principal/HOD', dept:'', role:'Super Admin', crits:[], phd:false, exp:0, pubs:0}
    ],
    criteria: [],       // active instances: {code, fid, deadline, status, pct, dn, dt}
    documents: [],      // {id, name, ext, crit, fid, date, size, status, uploadedAt}
    courses: [],
    aiInsights: [],
    notifPrefs: {email:true, deadline:true, docUpload:true, ai:false},
    notifications: [],
    criteriaData: {},   // {C1: {'1.1': {fieldId: value}, ...}, ...}
    session: null,
  };
}

/* ─── LocalStorage-backed DB ────────────────────────────── */
const DB_KEY  = 'accreditiq_v2';
const TXT_KEY = 'accreditiq_texts'; // separate store for extracted doc text

function loadD() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return _defaultData();
    return Object.assign(_defaultData(), JSON.parse(raw));
  } catch(e) { return _defaultData(); }
}

function saveD() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(D)); }
  catch(e) { console.warn('AccreditIQ: localStorage save failed', e); }
}

/* Load extracted texts */
function loadTexts() {
  try { return JSON.parse(localStorage.getItem(TXT_KEY) || '{}'); }
  catch(e) { return {}; }
}
function saveTexts(obj) {
  try { localStorage.setItem(TXT_KEY, JSON.stringify(obj)); }
  catch(e) { console.warn('Text storage full'); }
}

let D = loadD();
