/**
 * Single source of truth. Everything below is taken from the supplied resume (PDF).
 * Verified links come from the resume's own hyperlinks. Edit here to change the site.
 */
export const profile = {
  name: "Hemanth Tirumalarajukupam",
  first: "Hemanth",
  role: "AI/ML Engineer",
  location: "Charlotte, NC",
  summary:
    "Senior AI/ML Engineer with 6+ years of experience progressing from Python backend engineering to machine learning, MLOps, and production GenAI systems across financial services and media.",
  approach:
    "I build and own end-to-end AI products: feature engineering, model development, explainability, experiment tracking, RAG architecture, retrieval evaluation, API serving, cloud deployment, and production monitoring.",
  // Resume contact details. Change here if you prefer a different public address.
  email: "tirumalarajukupamhemanth12@gmail.com",
  linkedin: "https://www.linkedin.com/in/hemanth-t-b716292a4/",
  github: "https://github.com/Hemanthtr954",
  openToRelocate: false, // set true only if you want to state it publicly
};

export type Case = {
  n: string; title: string; org: string; role: string; period: string; kicker: string;
  problem: string; did: string[]; stack: string[]; proof: { k: string; v: string }[];
  repo: string; repoLabel: string; note: string;
};

export const cases: Case[] = [
  {
    n: "01", title: "Intelligent Lending Risk & Financial Knowledge Platform", org: "SoFi", role: "AI/ML Engineer",
    period: "Jul 2025 – Present", kicker: "Risk you can explain. Answers you can trace.",
    problem: "Lending analysts needed risk scores they could interpret and policy answers grounded in documents, served reliably in production.",
    did: [
      "Owned the Lending Risk Scoring module end to end: features from 150K+ records, XGBoost and LightGBM training, Optuna tuning, threshold calibration.",
      "Put SHAP reason indicators into production risk outputs so analysts can interpret decisions.",
      "Architected the Financial Policy Knowledge module with Azure OpenAI, LangChain, RAG and Azure AI Search, and chose the retrieval setup through test-set evaluation.",
      "Designed FastAPI contracts for /risk-score, /explanations and /knowledge/search, and shipped containerized services on Docker and AKS with CI/CD.",
    ],
    stack: ["Python", "XGBoost", "LightGBM", "Optuna", "SHAP", "MLflow", "Azure ML", "Azure OpenAI", "LangChain", "Azure AI Search", "FastAPI", "PostgreSQL", "Redis", "Docker", "AKS"],
    proof: [{ k: "~8%", v: "higher recall for higher-risk cases" }, { k: "~11%", v: "better relevant-document retrieval" }, { k: "150K+", v: "records engineered into features" }],
    repo: "https://github.com/Hemanthtr954/lending-risk-rag-platform", repoLabel: "Runnable reference build",
    note: "The linked repo is an independent rebuild of the architecture on synthetic data, not employer code.",
  },
  {
    n: "02", title: "Media Content Intelligence & Metadata Automation Platform", org: "Deluxe Entertainment Services", role: "ML Engineer / Python Developer",
    period: "Mar 2021 – Dec 2023", kicker: "From messy metadata to confident classification.",
    problem: "Media metadata arrived in mixed formats and needed consistent datasets and automated content classification with fewer manual reviews.",
    did: [
      "Automated ingestion, validation and processing of 50K+ metadata records (JSON/XML, PostgreSQL, AWS S3).",
      "Designed the NLP feature pipeline with spaCy, NLTK, TF-IDF, n-grams and lemmatization.",
      "Compared Scikit-learn and XGBoost with cross-validation and tuning; used SHAP and confusion matrices to debug errors and class imbalance.",
      "Set up MLflow tracking and shipped Dockerized inference services on AWS EC2.",
    ],
    stack: ["Python", "Pandas", "spaCy", "NLTK", "TF-IDF", "Scikit-learn", "XGBoost", "SHAP", "MLflow", "Flask", "FastAPI", "AWS S3", "EC2", "Docker"],
    proof: [{ k: "~9%", v: "F1 gain over baseline" }, { k: "~12%", v: "fewer unnecessary manual reviews" }, { k: "50K+", v: "metadata records automated" }],
    repo: "https://github.com/Hemanthtr954/media-content-intelligence", repoLabel: "Runnable reference build",
    note: "The linked repo is an independent rebuild on synthetic data, not employer code.",
  },
  {
    n: "03", title: "Enterprise Order & Service Request Management Platform", org: "Bahwan CyberTek", role: "Python Developer",
    period: "Jul 2018 – Feb 2021", kicker: "Where the engineering foundations came from.",
    problem: "Operations teams needed a dependable workflow for service requests from intake and assignment through approval, escalation and closure.",
    did: [
      "Engineered a Python/Django Service Request module supporting 1,000+ requests monthly.",
      "Exposed REST APIs with authentication, validation and exception handling; structured PostgreSQL/MySQL models with audit history.",
      "Integrated customer and order data through a Flask service with payload transformation, retry logic and error logging.",
      "Tested business rules and APIs with unittest and Postman, and fixed production defects through Linux, API and SQL tracing.",
    ],
    stack: ["Python", "Django", "Flask", "REST", "PostgreSQL", "MySQL", "JavaScript", "jQuery", "Postman", "Linux", "Git"],
    proof: [{ k: "1,000+", v: "requests handled monthly" }, { k: "~15%", v: "faster key screen response" }, { k: "5", v: "workflow stages, intake to closure" }],
    repo: "https://github.com/Hemanthtr954/service-request-platform", repoLabel: "Runnable reference build",
    note: "The linked repo is an independent rebuild with invented data, not employer code.",
  },
];

export const skills: { group: string; why: string; items: string[] }[] = [
  { group: "Machine learning", why: "Modeling and explanation", items: ["Scikit-learn", "XGBoost", "LightGBM", "Feature Engineering", "Classification", "Hyperparameter Tuning", "SHAP", "Optuna"] },
  { group: "GenAI & retrieval", why: "Grounded LLM systems", items: ["Azure OpenAI", "LangChain", "RAG", "Embeddings", "Vector Search", "Hybrid Search", "Semantic Search", "Reranking", "Retrieval Evaluation", "spaCy", "NLTK", "TF-IDF"] },
  { group: "MLOps", why: "From notebook to production", items: ["Azure Machine Learning", "MLflow", "Experiment Tracking", "Model Registry", "Model Deployment", "Model Monitoring"] },
  { group: "Backend & APIs", why: "Serving it reliably", items: ["FastAPI", "Flask", "Django", "REST APIs", "Pydantic", "SQLAlchemy", "Redis", "AsyncIO"] },
  { group: "Cloud & DevOps", why: "Shipping it safely", items: ["Azure", "AWS", "Azure AI Search", "Azure Blob Storage", "S3", "EC2", "Docker", "Kubernetes/AKS", "CI/CD", "Git"] },
  { group: "Data & quality", why: "Trustworthy foundations", items: ["Python", "SQL", "Pandas", "NumPy", "PostgreSQL", "MySQL", "PyTest", "Postman", "Azure Monitor", "Request Tracing", "Audit Logging", "Linux"] },
];

export const education = [
  { what: "Master's in Information Technology and Management", detail: "Specialization: Generative AI for Business", when: "May 2025" },
  { what: "Bachelor of Technology (B.Tech), Anna University", detail: "", when: "May 2018" },
];
