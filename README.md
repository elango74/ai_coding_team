# AI Software Company — Autonomous Multi-Agent Coding Team

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-0.0.60-FF6B35?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An autonomous, multi-agent AI system that transforms a single natural-language prompt into a complete, production-ready software application.**

[Overview](#-overview) · [Architecture](#-architecture) · [Agents](#-the-ai-engineering-team) · [Workflow](#-multi-agent-workflow) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure)

</div>

---

## Overview

**AI Software Company** is an autonomous agentic development platform powered by **LangGraph** orchestration and **NVIDIA NIM** (Llama 3.1 70B). Instead of relying on a single AI model, this system distributes work across a pipeline of specialized AI agents that collaborate just like a real engineering team — from requirements analysis all the way to frontend delivery.

You submit a natural-language description of the software you want built. The system autonomously handles everything else: requirements gathering, system design, backend code generation, automated quality assurance, security review, and UI development.

### Key Features

| Feature | Description |
|---|---|
| **Multi-Agent Orchestration** | LangGraph manages stateful routing between specialized AI agent nodes |
| **Shared Global Context** | A `TeamState` typed dictionary preserves full context across the entire pipeline |
| **Automated QA Loop** | A self-healing bug-fix loop between the Tester and Developer (up to 3 iterations) |
| **Production-Grade Output** | Generates FastAPI backends with SQLAlchemy models, Pydantic schemas, and modular routers |
| **Full-Stack Delivery** | Produces both backend API and React/Vite/Tailwind CSS frontend code |
| **Docker-Ready** | Ships with `Dockerfile`s for both services and a `docker-compose.yml` for one-command deployment |
| **Interactive UI** | A live web dashboard with a directory explorer, code viewer, and simulated terminal output |

---

## Architecture

The system follows a clean, layered architecture separating the orchestration engine, agent logic, API gateway, and frontend client.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI SOFTWARE COMPANY                              │
│                                                                         │
│   ┌──────────────────┐           ┌───────────────────────────────────┐  │
│   │   React Frontend  │  HTTP     │        FastAPI Backend             │  │
│   │  (Vite + Tailwind)│ ◄────────►│       POST /generate-project      │  │
│   │   localhost:5173  │           │         localhost:8000             │  │
│   └──────────────────┘           └─────────────────┬─────────────────┘  │
│                                                     │                    │
│                                                     ▼                    │
│                                    ┌────────────────────────────────┐   │
│                                    │     LangGraph State Machine     │   │
│                                    │        (app/graph.py)           │   │
│                                    │                                 │   │
│                                    │  ┌─────────┐   ┌───────────┐   │   │
│                                    │  │TeamState│──►│  Routing  │   │   │
│                                    │  │  (Dict) │   │  Engine   │   │   │
│                                    │  └─────────┘   └───────────┘   │   │
│                                    └────────────────────────────────┘   │
│                                                     │                    │
│                                                     ▼                    │
│                              ┌──────────────────────────────────────┐   │
│                              │         NVIDIA NIM API               │   │
│                              │    meta/llama-3.1-70b-instruct       │   │
│                              └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## The AI Engineering Team

Each agent is an isolated Python function that receives the shared `TeamState`, performs its specialized role via LLM inference, and returns only its specific output fields to be merged back into global state.

### 1. Product Manager Agent
**File:** [`backend/app/agents.py`](./backend/app/agents.py) — `product_manager_agent()`

- **Input:** Raw user natural-language prompt
- **Role:** Acts as a senior Product Manager who analyzes requirements and produces a formal specification
- **Output:** `requirements_doc` — A comprehensive software specification detailing core features, API endpoints, and user scope
- **LLM Temperature:** `0.3` (balanced between creative and deterministic)

### 2. Software Architect Agent
**File:** [`backend/app/agents.py`](./backend/app/agents.py) — `software_architect_agent()`

- **Input:** `requirements_doc` from the PM Agent
- **Role:** Designs the production-level system layout, choosing the database schema, folder structure, and technology stack
- **Output:** `architecture_spec` — A structured JSON object containing:
  - `tech_stack`: List of technologies to be used
  - `folder_structure`: Modular file layout
  - `database_schema`: Entity-relationship schema definition
- **LLM Temperature:** `0.2` (highly deterministic for structural design)
- **JSON Mode:** Enforced via `response_format={"type": "json_object"}` + Pydantic schema injection

### 3. Backend Developer Agent
**File:** [`backend/app/agents.py`](./backend/app/agents.py) — `backend_developer_agent()`

- **Input:** `architecture_spec` (schema + folder layout) from the Architect
- **Role:** Writes production-grade Python code files using FastAPI, SQLAlchemy, and Pydantic
- **Output:** `source_code` — A flat dictionary mapping file paths to complete file contents (e.g., `"main.py"`, `"models.py"`, `"requirements.txt"`, `"README.md"`)
- **LLM Temperature:** `0.2` (strict, deterministic code generation)
- **JSON Mode:** Enforced, with schema-guided file format instructions

### 4. Tester Agent
**File:** [`backend/app/agents.py`](./backend/app/agents.py) — `tester_agent()`

- **Input:** `source_code` from the Developer
- **Role:** Validates the generated code for bugs, missing dependencies, and logic errors
- **Output:** `test_report`, `errors_found` (bool), `iteration_count` (int)
- **Routing Logic:** If `errors_found=True` and `iteration_count < 3`, the graph routes back to the Backend Developer. Otherwise, it advances to the Reviewer.
- **Note:** Currently operates in **mock mode** (bypasses LLM call) to prevent API timeouts. The mock always returns `errors_found=False` to allow the pipeline to proceed.

### 5. Code Reviewer Agent
**File:** [`backend/app/agents.py`](./backend/app/agents.py) — `code_reviewer_agent()`

- **Input:** Finalized `source_code` from the Developer (post-testing)
- **Role:** Acts as a Senior Principal Engineer performing a static analysis and security audit of all generated files
- **Output:** `review_report` — A detailed security and quality assessment report
- **LLM Temperature:** `0.2`

### 6. Frontend Developer Agent
**File:** [`backend/app/agents.py`](./backend/app/agents.py) — `frontend_developer_agent()`

- **Input:** `requirements_doc` + the list of backend API endpoints from `source_code`
- **Role:** Builds a responsive, modern React UI that connects to the generated backend
- **Output:** `frontend_source_code` — A flat dictionary of frontend files (e.g., `"src/App.jsx"`, `"package.json"`, `"src/index.css"`)
- **Stack:** React + Vite + Tailwind CSS
- **LLM Temperature:** `0.3`

---

## Multi-Agent Workflow

The pipeline is a directed acyclic graph with a single conditional loop for quality assurance. All state is passed between agents through a single `TeamState` TypedDict, ensuring no context loss.

```
                        ┌─────────────────────┐
                        │    User Submits      │
                        │   Natural Language   │
                        │       Prompt         │
                        └──────────┬──────────┘
                                   │
                                   ▼
                     ┌─────────────────────────────┐
                     │   1. Product Manager Agent   │
                     │  • Reads: user_prompt        │
                     │  • Writes: requirements_doc  │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │  2. Software Architect Agent │
                     │  • Reads: requirements_doc   │
                     │  • Writes: architecture_spec │
                     │    (tech_stack, schema,      │
                     │     folder_structure)        │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
              ┌─────►│  3. Backend Developer Agent  │
              │      │  • Reads: architecture_spec  │
              │      │  • Writes: source_code       │
              │      │    (FastAPI + SQLAlchemy)    │
              │      └──────────────┬──────────────┘
              │                     │
              │                     ▼
              │      ┌─────────────────────────────┐
              │      │      4. Tester Agent         │
              │      │  • Reads: source_code        │
              │      │  • Writes: test_report,      │
              │      │    errors_found,             │
              │      │    iteration_count           │
              │      └──────────────┬──────────────┘
              │                     │
              │        ┌────────────┴────────────┐
              │        │   Conditional Router     │
              │        │  route_after_testing()   │
              │        └────────────┬────────────┘
              │                     │
              │        ┌────────────┴──────────────┐
              │        │                           │
              │  errors_found=True           errors_found=False
              │  iteration_count < 3         OR iteration_count >= 3
              │        │                           │
              └────────┘                           ▼
        (loop back to developer)   ┌─────────────────────────────┐
                                   │   5. Code Reviewer Agent    │
                                   │  • Reads: source_code       │
                                   │  • Writes: review_report    │
                                   │    (security audit)         │
                                   └──────────────┬──────────────┘
                                                  │
                                                  ▼
                                   ┌─────────────────────────────┐
                                   │ 6. Frontend Developer Agent │
                                   │  • Reads: requirements_doc, │
                                   │    source_code file list    │
                                   │  • Writes:                  │
                                   │    frontend_source_code     │
                                   │    (React + Vite +          │
                                   │     Tailwind CSS)           │
                                   └──────────────┬──────────────┘
                                                  │
                                                  ▼
                                         ┌──────────────┐
                                         │     END      │
                                         │  Full-Stack  │
                                         │  App Output  │
                                         └──────────────┘
```

### State Flow Summary

| Stage | Agent | Reads State Keys | Writes State Keys |
|---|---|---|---|
| 1 | Product Manager | `user_prompt` | `requirements_doc` |
| 2 | Software Architect | `requirements_doc` | `architecture_spec` |
| 3 | Backend Developer | `architecture_spec` | `source_code` |
| 4 | Tester | `source_code` | `test_report`, `errors_found`, `iteration_count` |
| 4→3 | Router (conditional) | `errors_found`, `iteration_count` | *(routing only)* |
| 5 | Code Reviewer | `source_code` | `review_report` |
| 6 | Frontend Developer | `requirements_doc`, `source_code` | `frontend_source_code` |

---

## Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** and **npm**
- A valid **NVIDIA NIM API Key** — obtain from [build.nvidia.com](https://build.nvidia.com)
- **Docker & Docker Compose** *(optional, for containerized deployment)*

---

### Option A — Local Development Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/elango74/ai-coding-team.git
cd ai-coding-team
```

#### Step 2: Configure the Backend Environment

Create a `.env` file inside the `backend/` directory:

```bash
# backend/.env
NVIDIA_API_KEY="nvapi-your-key-here"
PORT=8000
```

> **Security Warning:** Never commit your `.env` file or API keys to version control. The `.gitignore` should already exclude it.

#### Step 3: Set Up the Python Virtual Environment

```bash
cd backend

# Create the virtual environment
python -m venv .venv

# Activate on Windows
.venv\Scripts\activate

# Activate on macOS/Linux
source .venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

#### Step 4: Start the Backend Server

```bash
# From inside the backend/ directory with .venv active
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The FastAPI server will be live at:
- **API Endpoint:** `http://localhost:8000`
- **Interactive Docs (Swagger):** `http://localhost:8000/docs`
- **OpenAPI Schema:** `http://localhost:8000/openapi.json`

#### Step 5: Set Up and Start the Frontend

Open a **new terminal**:

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

The React UI will be live at: `http://localhost:5173`

---

### Option B — Docker Compose Deployment

The simplest way to run the full stack. Ensure Docker Desktop is running.

```bash
# From the project root directory
docker-compose up --build
```

This command will:
1. Build the Python/FastAPI Docker image for the backend
2. Build the Node.js/Vite Docker image for the frontend
3. Start both containers and link them together
4. Expose the backend on port `8000` and frontend on port `5173`

To stop the services:

```bash
docker-compose down
```

---

## API Reference

### `POST /generate-project`

Triggers the full multi-agent pipeline to autonomously generate a complete software application.

**Request Body**

```json
{
  "prompt": "Build a Library Management System API using FastAPI with JWT authentication and PostgreSQL."
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `prompt` | `string` | A detailed natural-language description of the application to build |

**Response Body**

```json
{
  "requirements_doc": "# Software Specification\n...",
  "architecture_spec": {
    "tech_stack": ["FastAPI", "SQLAlchemy", "PostgreSQL"],
    "folder_structure": ["main.py", "models.py", "routers/", "schemas.py"],
    "database_schema": "CREATE TABLE books (id SERIAL PRIMARY KEY, ...);"
  },
  "source_code": {
    "main.py": "from fastapi import FastAPI\n...",
    "models.py": "from sqlalchemy import Column, Integer, String\n...",
    "requirements.txt": "fastapi\nuvicorn\nsqlalchemy\n...",
    "README.md": "# Setup Instructions\n..."
  },
  "test_report": "--- Summary ---\nAutomated testing bypassed...",
  "review_report": "# Security Audit\n## No critical vulnerabilities found...",
  "total_cycles_executed": 1
}
```

| Field | Type | Description |
|---|---|---|
| `requirements_doc` | `string` | Full functional specification from the PM Agent |
| `architecture_spec` | `object` | System design (tech stack, folder layout, DB schema) |
| `source_code` | `object` | Generated backend files as `{ "filename": "content" }` |
| `test_report` | `string` | QA validation results and test summary |
| `review_report` | `string` | Security and code quality audit from the Reviewer |
| `total_cycles_executed` | `integer` | Number of times the Developer-Tester correction loop ran |

**Error Response**

```json
{
  "detail": "An error occurred within the agent workflow system: <error message>"
}
```

---

## Project Structure

```
ai_coding_team/
│
├── backend/                        # Python FastAPI + LangGraph backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── agents.py               # All 6 AI agent function definitions
│   │   ├── graph.py                # LangGraph workflow: nodes, edges, routing
│   │   └── state.py                # TeamState TypedDict (shared global state)
│   ├── main.py                     # FastAPI app, CORS config, /generate-project endpoint
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend Docker image definition
│   └── .env                        # NVIDIA_API_KEY and PORT (not committed)
│
├── frontend/                       # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── App.jsx                 # Main UI: prompt input, results display, code viewer
│   │   ├── App.css                 # Component-level styles
│   │   ├── main.jsx                # React root entry point
│   │   └── index.css               # Global CSS resets
│   ├── public/                     # Static assets
│   ├── index.html                  # Vite HTML template
│   ├── package.json                # Node.js dependencies and dev scripts
│   ├── vite.config.js              # Vite build configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── Dockerfile                  # Frontend Docker image definition
│
├── docker-compose.yml              # Orchestrates backend + frontend containers
├── .gitignore                      # Excludes .venv, node_modules, .env, etc.
└── README.md                       # This file
```

---

## Tech Stack

### Backend
| Technology | Version | Role |
|---|---|---|
| **Python** | 3.11+ | Core runtime |
| **FastAPI** | 0.111.0 | REST API framework and request/response handling |
| **Uvicorn** | 0.30.1 | ASGI server for running the FastAPI app |
| **LangGraph** | 0.0.60 | Multi-agent state machine orchestration engine |
| **OpenAI SDK** | Latest | OpenAI-compatible client pointed at NVIDIA NIM |
| **Pydantic** | 2.7.4 | Request/response schema validation and JSON enforcement |
| **python-dotenv** | 1.0.1 | Environment variable loading from `.env` |

### Frontend
| Technology | Version | Role |
|---|---|---|
| **React** | 19 | Component-based UI library |
| **Vite** | 8 | Ultra-fast frontend build tool and dev server |
| **Tailwind CSS** | 3 | Utility-first CSS framework for responsive UI |

### AI / LLM
| Technology | Role |
|---|---|
| **NVIDIA NIM API** | OpenAI-compatible inference gateway |
| **Llama 3.1 70B Instruct** | Core LLM powering all 6 agent roles |

### Infrastructure
| Technology | Role |
|---|---|
| **Docker** | Containerizes both backend and frontend services |
| **Docker Compose** | Single-command orchestration of the full stack |

---

## Configuration Reference

All configuration is managed through environment variables. Set these in `backend/.env` for local development, or via `docker-compose.yml` for container deployment.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NVIDIA_API_KEY` | Yes | — | Your NVIDIA NIM API key from `build.nvidia.com` |
| `PORT` | No | `8000` | The port on which Uvicorn serves the FastAPI application |

---

## Development Notes

### Tester Agent — Mock Mode

The Tester Agent currently operates in **mock mode** and bypasses the LLM call to avoid server timeouts caused by the LLM analyzing large volumes of generated code. To enable full live testing:

1. Open [`backend/app/agents.py`](./backend/app/agents.py)
2. Locate the `tester_agent()` function (line ~122)
3. Remove the mock block and re-enable the LLM `client.chat.completions.create()` call with the `TestReportModel` schema

### CORS Policy

The FastAPI backend currently allows all origins (`allow_origins=["*"]`) for ease of local development. Before deploying to production, restrict this to your specific frontend domain in [`backend/main.py`](./backend/main.py).

### QA Loop Iteration Limit

The `route_after_testing()` function in [`backend/app/graph.py`](./backend/app/graph.py) caps the Developer → Tester correction loop at **3 iterations** to prevent infinite cycles. Adjust `iteration_count < 3` to change this limit.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-new-agent`
3. **Commit** your changes: `git commit -m 'feat: add documentation generator agent'`
4. **Push** to the branch: `git push origin feature/my-new-agent`
5. **Open** a Pull Request with a clear description of your changes

### Ideas for Contribution
- Enable the live Tester Agent with streaming output
- Add a Documentation Generator Agent (7th node) to produce README files for generated projects
- Implement WebSocket streaming so the UI updates in real-time as each agent completes
- Add support for additional LLM providers (OpenAI GPT-4o, Google Gemini)
- Persist generated projects to disk with a downloadable zip archive


## Acknowledgments

- **[LangGraph by LangChain](https://github.com/langchain-ai/langgraph)** — for the powerful stateful multi-agent orchestration framework
- **[NVIDIA NIM](https://build.nvidia.com)** — for providing OpenAI-compatible access to Llama 3.1 70B
- **[FastAPI](https://fastapi.tiangolo.com)** — for the high-performance Python API framework
- **[Meta Llama 3.1](https://ai.meta.com/blog/meta-llama-3-1/)** — the underlying LLM powering every agent in the pipeline

---

<div align="center">

Built with by an autonomous AI engineering team, orchestrated by LangGraph.

</div>
