const COs = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6'];
const POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'];

const MATRIX: number[][] = [
  [3, 3, 2, 1, 0, 0, 1, 0, 2, 1, 0, 2],
  [2, 3, 3, 2, 1, 0, 0, 1, 2, 1, 0, 1],
  [1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 1, 1],
  [0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 2],
  [1, 0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 1],
  [2, 1, 0, 1, 2, 3, 3, 2, 1, 0, 0, 2],
];

function cellBg(val: number): string {
  if (val === 3) return '#DCFCE7';
  if (val === 2) return '#FEF3C7';
  if (val === 1) return '#DBEAFE';
  return 'transparent';
}
function cellColor(val: number): string {
  if (val === 3) return '#15803D';
  if (val === 2) return '#B45309';
  if (val === 1) return '#1D4ED8';
  return 'var(--border)';
}

export default function COPOMapping() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>CO-PO Mapping Matrix</span>
          <div className="flex items-center gap-4 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC' }} />High (3)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }} />Medium (2)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: '#DBEAFE', border: '1px solid #93C5FD' }} />Low (1)</span>
          </div>
        </div>

        <div className="overflow-auto p-0">
          <table className="inst-table">
            <thead>
              <tr>
                <th style={{ minWidth: 60 }}>CO / PO</th>
                {POs.map((po) => <th key={po} className="text-center" style={{ minWidth: 44 }}>{po}</th>)}
              </tr>
            </thead>
            <tbody>
              {COs.map((co, ri) => (
                <tr key={co}>
                  <td className="font-bold" style={{ color: 'var(--accent)' }}>{co}</td>
                  {MATRIX[ri].map((val, ci) => (
                    <td key={ci} className="text-center font-semibold"
                      style={{ backgroundColor: cellBg(val), color: cellColor(val) }}>
                      {val > 0 ? val : '–'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attainment summary */}
      <div className="card">
        <div className="card-header">Attainment Summary</div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Direct Attainment',   value: 72, color: 'var(--success)' },
            { label: 'Indirect Attainment', value: 68, color: 'var(--warning)' },
            { label: 'Overall Attainment',  value: 71, color: 'var(--accent)' },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded"
              style={{ backgroundColor: 'var(--bg-row-alt)', border: '1px solid var(--border)' }}>
              <div className="text-2xl font-black tabular-nums" style={{ color: item.color }}>{item.value}%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
