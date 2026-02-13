import { useState } from "react";
import ResumeUpload from "../components/resume/ResumeUpload";

const SKILL_SIGNAL_MAP = [
  { skill: "SQL", pattern: /\bsql\b|postgres|mysql|snowflake|bigquery/i },
  { skill: "Data Modeling", pattern: /data model|star schema|dimensional/i },
  { skill: "ETL Pipelines", pattern: /\betl\b|pipeline|ingestion|orchestration/i },
  { skill: "Backend API Design", pattern: /backend|rest|graphql|api/i },
  { skill: "Distributed Processing", pattern: /spark|distributed|hadoop/i },
  { skill: "Cloud Deployment", pattern: /aws|azure|gcp|docker|kubernetes/i },
  { skill: "Data Warehousing", pattern: /warehouse|lakehouse|redshift|snowflake/i },
  { skill: "Testing and Observability", pattern: /testing|monitoring|observability/i },
];

const SKILL_IMPROVEMENT_MAP = {
  SQL: [
    "Add a project bullet that includes complex joins, window functions, and query tuning.",
    "Mention measurable outcomes from SQL optimization (for example, reduced query runtime by 40%).",
  ],
  "Data Modeling": [
    "Include schema design examples with fact and dimension tables used in analytics workflows.",
    "Describe how your data model improved reporting accuracy or reduced duplication.",
  ],
  "ETL Pipelines": [
    "Highlight an ETL flow you built, including source, transformations, and data quality checks.",
    "Show pipeline reliability metrics such as SLA adherence and failure-rate reduction.",
  ],
  "Backend API Design": [
    "Demonstrate API versioning, authentication, and error-handling patterns in experience bullets.",
    "Add one achievement showing latency improvements or throughput gains in API services.",
  ],
  "Distributed Processing": [
    "Reference batch or streaming workloads implemented with partitioning and fault tolerance.",
    "Quantify data volume handled and execution-time improvements from distributed compute tuning.",
  ],
  "Cloud Deployment": [
    "Mention deployment workflows and infrastructure ownership in cloud environments.",
    "Include monitoring, alerting, and rollback strategies to show production readiness.",
  ],
  "Data Warehousing": [
    "Add examples of warehouse modeling, incremental loads, and governance controls.",
    "Show how warehouse improvements enabled faster analytics or decision-making.",
  ],
  "Testing and Observability": [
    "Include unit/integration testing approach for data and backend components.",
    "Describe logs, metrics, and tracing practices used to detect and resolve incidents quickly.",
  ],
};

const DEFAULT_MISSING_SKILLS = [
  "SQL",
  "Backend API Design",
  "Data Modeling",
  "ETL Pipelines",
];

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const getRoleFocus = (jobDescription) => {
  const content = jobDescription.toLowerCase();
  if (content.includes("data engineer")) return "Data Engineer";
  if (content.includes("backend")) return "Backend Engineer";
  if (content.includes("data analyst")) return "Data Analyst";
  if (content.includes("full stack")) return "Full Stack Engineer";
  return "Software Engineer";
};

const getMissingSkills = (jobDescription) => {
  const matchedSkills = SKILL_SIGNAL_MAP.filter((entry) =>
    entry.pattern.test(jobDescription),
  ).map((entry) => entry.skill);

  const chosenSkills = Array.from(
    new Set([...matchedSkills, ...DEFAULT_MISSING_SKILLS]),
  ).slice(0, 4);

  return chosenSkills.map((skill) => ({
    skill,
    improvementPoints: SKILL_IMPROVEMENT_MAP[skill] || [
      `Add a quantified resume bullet showing practical ${skill} delivery.`,
      `Connect ${skill} experience to business impact relevant to this role.`,
    ],
  }));
};

const getSuggestions = (atsScore, keywordMatch, missingSkills, roleFocus) => {
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

  if (missingSkills.length > 0) {
    suggestions.push(
      `Prioritize the top missing skills first: ${missingSkills
        .slice(0, 2)
        .map((entry) => entry.skill)
        .join(", ")}.`,
    );
  }

  suggestions.push(
    `Align your strongest achievements with typical ${roleFocus} responsibilities.`,
  );
  suggestions.push("Use measurable impact statements (e.g. increased X by Y%).");
  suggestions.push("Keep section titles standard: Summary, Experience, Skills.");

  return suggestions;
};

const getResumeOptimizedVersion = (roleFocus, missingSkills) => [
  `Built reliable data and backend workflows by collaborating with product, analytics, and engineering stakeholders.`,
  `Designed and maintained scalable services aligned with ${roleFocus} expectations, improving platform stability and delivery speed.`,
  `Improved data quality and reporting confidence through clear ownership of validation checks, observability, and incident follow-up.`,
  `Translated business requirements into production-ready solutions while balancing performance, readability, and maintainability.`,
  `Expanded capability in ${missingSkills
    .slice(0, 2)
    .map((entry) => entry.skill)
    .join(" and ")} through practical project implementation and measurable outcomes.`,
];

const getInterviewQuestions = (fileName, jobDescription, roleFocus) => {
  const jdContext =
    jobDescription
      .split(/\n|\./)
      .map((line) => line.trim())
      .find(Boolean) || "the provided role requirements";

  const questions = [
    {
      category: "Experience",
      question: `From ${fileName}, which project best proves fit for this ${roleFocus} role?`,
      answer:
        "Highlight one relevant project with concrete scope, stack choices, and measurable outcomes tied to the role.",
    },
    {
      category: "Role Fit",
      question: `How does your prior experience map to this requirement: "${jdContext}"?`,
      answer:
        "Map past responsibilities to this requirement directly, then mention one metric that shows effectiveness.",
    },
    {
      category: "SQL",
      question:
        "How would you write a SQL query to find the top 5 customers by total revenue in the last 30 days?",
      answer:
        "Use aggregation with SUM, filter by date range, GROUP BY customer, ORDER BY revenue desc, and LIMIT 5.",
    },
    {
      category: "SQL",
      question:
        "What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK(), and when would you use each?",
      answer:
        "ROW_NUMBER never ties, RANK leaves gaps after ties, DENSE_RANK does not leave gaps; choose based on ranking semantics.",
    },
    {
      category: "SQL",
      question:
        "How would you debug a slow SQL query used by a dashboard endpoint in production?",
      answer:
        "Check execution plan, index usage, join cardinality, filter selectivity, and then optimize schema or query shape.",
    },
    {
      category: "Data Engineering",
      question:
        "Describe how you would design an ETL pipeline for ingesting daily transaction data from multiple sources.",
      answer:
        "Define ingestion contracts, stage raw data, apply transformations, enforce quality checks, and publish curated tables.",
    },
    {
      category: "Data Engineering",
      question:
        "How do you manage schema evolution in streaming or batch pipelines without breaking downstream consumers?",
      answer:
        "Use schema versioning, compatibility checks, and contract tests with staged rollout to protect downstream jobs.",
    },
    {
      category: "Data Engineering",
      question:
        "How would you ensure data quality and reliability for a high-volume ingestion process?",
      answer:
        "Implement validation rules, null/duplicate checks, anomaly monitoring, retries, and alerting tied to SLAs.",
    },
    {
      category: "Backend",
      question:
        "How would you design a backend API that supports idempotent writes for resume analysis submissions?",
      answer:
        "Use idempotency keys, request hashing, transaction boundaries, and duplicate detection before persistence.",
    },
    {
      category: "Backend",
      question:
        "What authentication and authorization patterns would you use for a multi-tenant dashboard API?",
      answer:
        "Use JWT/OAuth tokens, tenant-aware claims, scoped RBAC checks, and consistent middleware enforcement.",
    },
    {
      category: "Backend",
      question:
        "How would you approach API versioning while keeping existing clients stable?",
      answer:
        "Use semantic endpoint versioning or header versioning, deprecate gradually, and maintain backward compatibility.",
    },
    {
      category: "System Design",
      question:
        "Design a service to process thousands of resume analyses per hour. What components would you use?",
      answer:
        "Use asynchronous ingestion, queue workers, autoscaling compute, metadata storage, and observability controls.",
    },
    {
      category: "System Design",
      question:
        "How would you choose between synchronous and asynchronous processing for analysis jobs?",
      answer:
        "Use synchronous for quick user feedback and asynchronous for heavy tasks, with status polling or webhooks.",
    },
    {
      category: "Data Warehousing",
      question:
        "How would you model a warehouse table for tracking ATS scores over time by job family and candidate profile?",
      answer:
        "Create fact tables for analyses and dimensions for date, job family, and candidate attributes for flexible slicing.",
    },
    {
      category: "Observability",
      question:
        "What metrics and alerts would you define for a backend and pipeline supporting resume scoring?",
      answer:
        "Track latency, throughput, error rates, queue lag, freshness, and failed validation checks with severity-based alerts.",
    },
    {
      category: "Coding",
      question:
        "How would you implement retry logic with exponential backoff for transient API failures?",
      answer:
        "Cap retries, increase delay per attempt, add jitter, and fail fast for non-retryable status codes.",
    },
    {
      category: "Coding",
      question:
        "Explain how you would structure reusable validation logic for resume upload and job description parsing.",
      answer:
        "Use small pure validator functions, compose rules, and return structured error objects for UI display.",
    },
    {
      category: "Coding",
      question:
        "What tradeoffs exist between monolithic backend services and microservices for this product?",
      answer:
        "Monoliths simplify early delivery; microservices improve independent scaling but add operational complexity.",
    },
    {
      category: "Security",
      question:
        "How would you protect uploaded resume files and sensitive candidate metadata?",
      answer:
        "Use encrypted storage, strict access controls, secure transport, retention policies, and audit logging.",
    },
    {
      category: "Behavioral",
      question:
        "Tell me about a time you improved an unreliable data or backend process under tight deadlines.",
      answer:
        "Describe context, constraints, actions, and measurable impact while emphasizing prioritization and communication.",
    },
  ];

  return questions.map((item, index) => ({
    id: `iq-${index + 1}`,
    ...item,
  }));
};

const getMockInterviewQuestions = (roleFocus) => [
  {
    id: "mock-1",
    category: "Coding",
    question:
      "Write a SQL query to return each candidate's latest ATS score from an analysis table.",
    expectedKeywords: ["select", "join", "max", "group by"],
  },
  {
    id: "mock-2",
    category: "Coding",
    question:
      "Design pseudo-code for an idempotent endpoint that accepts resume upload analysis requests.",
    expectedKeywords: ["idempotency", "transaction", "key", "duplicate"],
  },
  {
    id: "mock-3",
    category: "Coding",
    question:
      "Describe an ETL pseudo-code flow that validates, transforms, and stores resume scoring data.",
    expectedKeywords: ["extract", "transform", "load", "validation"],
  },
  {
    id: "mock-4",
    category: "Backend",
    question: `How would you scale a ${roleFocus} platform to support regional traffic spikes?`,
    expectedKeywords: ["autoscaling", "queue", "cache", "monitoring"],
  },
  {
    id: "mock-5",
    category: "Data Engineering",
    question:
      "How would you prevent duplicate records when ingesting event streams into a data warehouse?",
    expectedKeywords: ["deduplicate", "primary key", "upsert", "window"],
  },
  {
    id: "mock-6",
    category: "Communication",
    question:
      "How do you explain a technical architecture tradeoff to non-technical stakeholders?",
    expectedKeywords: ["tradeoff", "risk", "impact", "decision"],
  },
];

const evaluateMockAnswer = (question, answerText) => {
  const normalizedAnswer = answerText.toLowerCase();
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
  const keywordHits = question.expectedKeywords.filter((keyword) =>
    normalizedAnswer.includes(keyword.toLowerCase()),
  ).length;

  const score = clampScore(
    50 + Math.min(wordCount, 24) + keywordHits * 7 + Math.floor(Math.random() * 8),
  );

  let feedback = "Good start. Add a bit more structure and implementation detail.";
  if (score >= 85) {
    feedback =
      "Strong response. You covered implementation detail and practical tradeoffs clearly.";
  } else if (score >= 70) {
    feedback =
      "Solid response. Add clearer metrics, edge cases, and operational safeguards to strengthen it.";
  }

  if (keywordHits < 2) {
    feedback += " Include more concrete technical keywords to improve precision.";
  }

  return { score, feedback };
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
  const [activeTab, setActiveTab] = useState("questions");
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [mockQuestionIndex, setMockQuestionIndex] = useState(0);
  const [mockAnswer, setMockAnswer] = useState("");
  const [currentMockEvaluation, setCurrentMockEvaluation] = useState(null);
  const [mockEvaluations, setMockEvaluations] = useState([]);

  const handleAnalyze = async ({ file, jobDescription }) => {
    setIsAnalyzing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const roleFocus = getRoleFocus(jobDescription);
      const missingSkills = getMissingSkills(jobDescription);
      const atsScore = clampScore(
        88 - missingSkills.length * 4 + (Math.floor(Math.random() * 15) - 7),
      );
      const keywordMatch = clampScore(
        76 + (Math.floor(Math.random() * 17) - 8) - missingSkills.length * 2,
      );
      const resumeImprovementSuggestions = getSuggestions(
        atsScore,
        keywordMatch,
        missingSkills,
        roleFocus,
      );
      const aiDetectionProbability = clampScore(Math.floor(Math.random() * 36) + 8);
      const resumeOptimizedVersion = getResumeOptimizedVersion(
        roleFocus,
        missingSkills,
      );
      const interviewQuestions = getInterviewQuestions(
        file.name,
        jobDescription,
        roleFocus,
      );
      const mockInterviewQuestions = getMockInterviewQuestions(roleFocus);
      const analyzedAt = new Date();
      const analysisId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `analysis-${Date.now()}`;

      const mockedAiAnalysis = {
        atsScore,
        missingSkills,
        resumeImprovementSuggestions,
        aiDetectionProbability,
        resumeOptimizedVersion,
      };

      const nextResult = {
        id: analysisId,
        fileName: file.name,
        jobDescription,
        roleFocus,
        keywordMatch,
        suggestions: resumeImprovementSuggestions,
        interviewQuestions,
        mockInterviewQuestions,
        mockedAiAnalysis,
        ...mockedAiAnalysis,
        analyzedAt: analyzedAt.toISOString(),
        dateLabel: analyzedAt.toLocaleString(),
      };

      setResult(nextResult);
      setActiveTab("questions");
      setVisibleAnswers({});
      setMockQuestionIndex(0);
      setMockAnswer("");
      setCurrentMockEvaluation(null);
      setMockEvaluations([]);
      onAnalysisCreated(nextResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleAnswer = (questionId) => {
    setVisibleAnswers((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  };

  const playQuestionVoice = () => {
    if (!result) {
      return;
    }

    const activeQuestion = result.mockInterviewQuestions[mockQuestionIndex];
    if (!activeQuestion) {
      return;
    }

    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeQuestion.question);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleMockSubmit = (event) => {
    event.preventDefault();

    if (!result || !mockAnswer.trim()) {
      return;
    }

    const activeQuestion = result.mockInterviewQuestions[mockQuestionIndex];
    const evaluation = evaluateMockAnswer(activeQuestion, mockAnswer.trim());
    const evaluationRecord = {
      questionId: activeQuestion.id,
      question: activeQuestion.question,
      score: evaluation.score,
      feedback: evaluation.feedback,
    };

    setCurrentMockEvaluation(evaluationRecord);
    setMockEvaluations((previous) => {
      const withoutCurrent = previous.filter(
        (entry) => entry.questionId !== activeQuestion.id,
      );
      return [...withoutCurrent, evaluationRecord];
    });
  };

  const handleNextMockQuestion = () => {
    if (!result) {
      return;
    }

    setMockQuestionIndex((previous) =>
      Math.min(previous + 1, result.mockInterviewQuestions.length - 1),
    );
    setMockAnswer("");
    setCurrentMockEvaluation(null);
  };

  const handleRestartMockInterview = () => {
    setMockQuestionIndex(0);
    setMockAnswer("");
    setCurrentMockEvaluation(null);
    setMockEvaluations([]);
  };

  const currentMockQuestion = result?.mockInterviewQuestions[mockQuestionIndex];
  const isLastMockQuestion =
    Boolean(result) && mockQuestionIndex === result.mockInterviewQuestions.length - 1;
  const completedQuestionCount = mockEvaluations.length;
  const averageMockScore =
    mockEvaluations.length > 0
      ? Math.round(
          mockEvaluations.reduce((total, item) => total + item.score, 0) /
            mockEvaluations.length,
        )
      : 0;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
        <ResumeUpload onAnalyze={handleAnalyze} loading={isAnalyzing} />

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Analysis Result</h3>
          {!result ? (
            <p className="mt-3 text-sm text-slate-500">
              Upload a resume and paste a job description to see AI analysis insights.
            </p>
          ) : (
            <div className="mt-4 space-y-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-500">File</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {result.fileName}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Job focus: {result.roleFocus}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800">ATS Score</h4>
                <div className="mt-3 space-y-3">
                  <ProgressBar label="ATS Score" value={result.atsScore} />
                  <ProgressBar label="Keyword Match" value={result.keywordMatch} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800">Missing Skills</h4>
                <div className="mt-3 space-y-3">
                  {result.missingSkills.map((item) => (
                    <div
                      key={item.skill}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item.skill}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {item.improvementPoints.slice(0, 2).map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Suggestions to Improve ATS Score
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {result.resumeImprovementSuggestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  AI Detection Probability
                </h4>
                <div className="mt-3 space-y-2">
                  <ProgressBar
                    label="AI-generated pattern likelihood"
                    value={result.aiDetectionProbability}
                  />
                  <p className="text-xs text-slate-500">
                    Lower values indicate more natural and human-like phrasing.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Resume Optimized / Humanized Version
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {result.resumeOptimizedVersion.map((bulletPoint) => (
                    <li key={bulletPoint}>{bulletPoint}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </article>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Interview Preparation</h3>
        {!result ? (
          <p className="mt-3 text-sm text-slate-500">
            Complete one analysis to unlock interview questions and mock interview mode.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("questions")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "questions"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Interview Questions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("mock")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "mock"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Mock Interview
              </button>
            </div>

            {activeTab === "questions" ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  Generated from your uploaded resume and provided job description.
                </p>
                {result.interviewQuestions.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          {item.category}
                        </span>
                        <p className="mt-2 text-sm font-medium text-slate-800">
                          {index + 1}. {item.question}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAnswer(item.id)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
                      >
                        {visibleAnswers[item.id] ? "Hide answer" : "See answer"}
                      </button>
                    </div>

                    {visibleAnswers[item.id] ? (
                      <p className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-600">
                        {item.answer}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      AI
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Digital Interview Coach (voice enabled)
                      </p>
                      <p className="text-xs text-slate-500">
                        Question {mockQuestionIndex + 1} of{" "}
                        {result.mockInterviewQuestions.length}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={playQuestionVoice}
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
                  >
                    Play voice
                  </button>
                </div>

                {currentMockQuestion ? (
                  <>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                        {currentMockQuestion.category}
                      </span>
                      <p className="mt-2 text-sm font-medium text-slate-800">
                        {currentMockQuestion.question}
                      </p>
                    </div>

                    <form onSubmit={handleMockSubmit} className="space-y-3">
                      <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">
                          Your answer
                        </span>
                        <textarea
                          value={mockAnswer}
                          onChange={(event) => setMockAnswer(event.target.value)}
                          rows={5}
                          disabled={Boolean(currentMockEvaluation)}
                          placeholder="Type your interview answer..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                      </label>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={!mockAnswer.trim() || Boolean(currentMockEvaluation)}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Submit answer
                        </button>

                        {currentMockEvaluation ? (
                          isLastMockQuestion ? (
                            <button
                              type="button"
                              onClick={handleRestartMockInterview}
                              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              Restart mock interview
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleNextMockQuestion}
                              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              Next question
                            </button>
                          )
                        ) : null}
                      </div>
                    </form>

                    {currentMockEvaluation ? (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-sm font-semibold text-emerald-800">
                          Evaluation score: {currentMockEvaluation.score}/100
                        </p>
                        <p className="mt-1 text-sm text-emerald-700">
                          {currentMockEvaluation.feedback}
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {completedQuestionCount > 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    Completed questions: {completedQuestionCount} /{" "}
                    {result.mockInterviewQuestions.length} - Average score:{" "}
                    <span className="font-semibold">{averageMockScore}</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </article>
    </section>
  );
}
