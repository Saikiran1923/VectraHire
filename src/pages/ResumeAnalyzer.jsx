import { useState } from "react";
import ResumeUpload from "../components/resume/ResumeUpload";

const getSuggestions = (atsScore, keywordMatch) => {
  const suggestions = [];

  if (atsScore < 75) {
    suggestions.push(
      "Tailor your summary and experience to match the target job description.",
    );
  }

  if (keywordMatch < 70) {
    suggestions.push(
      "Add role-specific keywords naturally across your skills and achievements.",
    );
  }

  suggestions.push("Use measurable impact statements (e.g. increased X by Y%).");
  suggestions.push("Keep section titles standard: Summary, Experience, Skills.");

  return suggestions;
};

const ProgressBar = ({ label, value }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="text-slate-500">{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-slate-900 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default function ResumeAnalyzer({ onAnalysisCreated }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (file) => {
    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const atsScore = Math.floor(Math.random() * 31) + 65;
    const keywordMatch = Math.max(55, atsScore - Math.floor(Math.random() * 12));
    const suggestions = getSuggestions(atsScore, keywordMatch);
    const analyzedAt = new Date();
    const analysisId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `analysis-${Date.now()}`;

    const nextResult = {
      id: analysisId,
      fileName: file.name,
      atsScore,
      keywordMatch,
      suggestions,
      analyzedAt: analyzedAt.toISOString(),
      dateLabel: analyzedAt.toLocaleString(),
    };

    setResult(nextResult);
    onAnalysisCreated(nextResult);
    setIsAnalyzing(false);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
      <ResumeUpload onAnalyze={handleAnalyze} loading={isAnalyzing} />

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Analysis Result</h3>
        {!result ? (
          <p className="mt-3 text-sm text-slate-500">
            Upload and analyze a resume to see ATS insights here.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-500">File</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{result.fileName}</p>
            </div>

            <ProgressBar label="ATS Score" value={result.atsScore} />
            <ProgressBar label="Keyword Match" value={result.keywordMatch} />

            <div>
              <h4 className="text-sm font-semibold text-slate-800">Suggestions</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {result.suggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
