import { useState } from "react";

export default function ResumeUpload({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a resume file before submitting.");
      return;
    }

    setError("");
    await onAnalyze(selectedFile);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-slate-900">Upload Resume</h3>
      <p className="mt-1 text-sm text-slate-500">
        Supported formats: PDF, DOC, DOCX
      </p>

      <label className="mt-4 block rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
        <span className="block font-medium text-slate-700">Select file</span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        />
        {selectedFile ? (
          <span className="mt-3 block text-sm text-slate-500">{selectedFile.name}</span>
        ) : null}
      </label>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
}
