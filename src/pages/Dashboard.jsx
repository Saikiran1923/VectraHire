import StatCard from "../components/dashboard/StatCard";

const fallbackActivity = [
  { id: "mock-1", fileName: "Frontend_Engineer_Resume.pdf", atsScore: 82 },
  { id: "mock-2", fileName: "Data_Analyst_Profile.docx", atsScore: 76 },
  { id: "mock-3", fileName: "Product_Manager_CV.pdf", atsScore: 88 },
];

export default function Dashboard({ analyses, onDeleteAnalysis }) {
  const totalResumes = analyses.length;
  const averageScore = totalResumes
    ? Math.round(
        analyses.reduce((total, entry) => total + entry.atsScore, 0) / totalResumes,
      )
    : 0;
  const recentActivity =
    analyses.length > 0 ? analyses.slice(0, 5) : fallbackActivity;
  const isFallbackActivity = analyses.length === 0;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total resumes analyzed"
          value={totalResumes}
          subtitle="All-time uploads"
        />
        <StatCard title="Average ATS score" value={`${averageScore}%`} />
        <StatCard
          title="Last analysis"
          value={analyses[0]?.dateLabel || "No activity yet"}
          subtitle="Most recent upload timestamp"
        />
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Recent activity</h3>
        <ul className="mt-4 space-y-3">
          {recentActivity.map((activity) => (
            <li
              key={activity.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2"
            >
              <p className="truncate text-sm font-medium text-slate-800">
                {activity.fileName}
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  ATS {activity.atsScore}%
                </span>
                {!isFallbackActivity ? (
                  <button
                    type="button"
                    onClick={() => onDeleteAnalysis(activity.id)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
