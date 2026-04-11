import { useState } from 'react';
import { PART_A_SECTIONS } from '@/data/criteriaData';
import { CheckCircleIcon } from '@/components/ui/Icon';

const MOCK_PART_A: Record<string, Record<string, string>> = {
  A1: {
    'Institution Name': "TSSM'S BSCOER",
    'Address': 'Pune, Maharashtra',
    'Phone': '+91-22-1234-5678',
    'Email': 'principal@tssm.edu.in',
    'Website': 'www.tssm.edu.in',
    'Year of Establishment': '2010',
    'AICTE Approval Number': 'AICTE/2024/EL/001234',
  },
  A2: {
    'Program Name': 'Bachelor of Engineering — Electrical',
    'Degree': 'B.E. / B.Tech',
    'Duration': '4 Years (8 Semesters)',
    'Sanctioned Intake': '60 students per year',
    'NBA Accreditation Status': 'Applied for Tier-II',
    'Accreditation Period': '2024–2027',
  },
  A3: {
    'Previous Accreditation Year': '2019',
    'Previous Score': '712 / 1000',
    'Accreditation Level': 'Tier-II',
    'Validity Period': '3 Years (2019–2022)',
  },
  A4: {
    'Principal Name': 'Dr.G.A.Hinge',
    'HOD Name': 'Kanade Sir',
    'NBA Coordinator Name': 'Hasarmuni Sir',
    'Contact Numbers': '+91-98765-43210',
    'Email IDs': 'nba@tssm.edu.in',
  },
};

export default function PartAPage() {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState(MOCK_PART_A);

  return (
    <div className="flex flex-col gap-4">
      <div className="card p-3 flex items-center gap-3"
        style={{ backgroundColor: 'var(--accent-lt)', border: '1px solid #93C5FD' }}>
        <span className="badge badge-info">Part A</span>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Basic institutional and program details required for NBA SAR submission. All fields are mandatory.
        </p>
      </div>

      {PART_A_SECTIONS.map((section) => (
        <div key={section.id} className="card overflow-hidden">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge badge-neutral">{section.id}</span>
              <span>{section.title}</span>
              <CheckCircleIcon className="w-4 h-4" style={{ color: 'var(--success)' }} />
            </div>
            <button
              onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
              className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              {editingSection === section.id ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.fields.map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{field}</label>
                {editingSection === section.id ? (
                  <input
                    type="text"
                    value={formData[section.id]?.[field] ?? ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [section.id]: { ...prev[section.id], [field]: e.target.value } }))}
                    className="text-sm"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-dk)', borderRadius: 2, padding: '4px 8px', color: 'var(--text-primary)' }}
                  />
                ) : (
                  <p className="text-sm px-2 py-1.5 rounded" style={{ backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {formData[section.id]?.[field] || <span style={{ color: 'var(--border-dk)' }}>Not filled</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
