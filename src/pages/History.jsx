export default function History({ analyses, onDeleteAnalysis }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Resume analysis history</h3>
        <span className="text-sm text-slate-500">{analyses.length} records</span>
      </div>

      {analyses.length === 0 ? (
        <p className="text-sm text-slate-500">
          No history yet. Analyze your first resume to get started.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="px-3 py-2 font-medium">Resume</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">ATS Score</th>
                <th className="px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analyses.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-3 py-3 font-medium text-slate-800">{entry.fileName}</td>
                  <td className="px-3 py-3 text-slate-600">{entry.dateLabel}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {entry.atsScore}%
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onDeleteAnalysis(entry.id)}
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
