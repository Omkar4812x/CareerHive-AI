# 🚀 CAREERHIVE AI — AUTONOMOUS MULTI-AGENT JOB SEARCH SYSTEM

CareerHive AI is an autonomous, multi-agent career platform where a **CEO Career AI Agent** manages a team of 10 specialized AI agents. The platform automates candidate profile building, search query expansion, live web job discovery across major platforms and official company career portals using **TinyFish capabilities**, job extraction, real-time verification, deduplication, resume compatibility matching (0–100 score), and executive summary report delivery.

---

## 🤖 The 11 AI Agent Hierarchy

```
                         USER
                           │
                           ▼
                 ┌───────────────────┐
                 │   CEO CAREER AI   │
                 │   Orchestrator    │
                 └─────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
  Strategy Agent      Resume Agent       Market Agent
        │
        ├─────────────────────────────────────────────┐
        │                                             │
        ▼                                             ▼
 Platform Search Scouts                       Company Career Hunter
 (LinkedIn, Indeed, Internshala, Startup, India)     (Official Company Sites)
        │                                             │
        └──────────────────────┬──────────────────────┘
                               ▼
                        Extraction Agent
                               │
                               ▼
                       Verification Agent
                               │
                               ▼
                      Deduplication Agent
                               │
                               ▼
                        Job Match Agent
                               │
                               ▼
                     Opportunity Researcher
                               │
                               ▼
                      Career Reporter Agent
                               │
                               ▼
                              USER
```

---

## 🌟 Key Features

1. **CEO Command Mission Control**: Launch high-level natural language commands and observe agents operating concurrently in real-time.
2. **TinyFish Live Web Discovery**: Integrated with TinyFish Search (`api.tinyfish.ai/v1/search`) and Fetch (`api.fetch.tinyfish.ai`) APIs for live web search and clean page extraction.
3. **Official Company Portal Priority**: `Company Career Hunter` discovers official company careers pages, prioritizing direct application URLs over third-party board duplicates.
4. **Resume Compatibility Engine**: Calculates 0–100 match score across 7 criteria (Skills 30%, Role 25%, Experience 15%, Location 10%, Project Relevance 10%, Freshness 5%, Application Ease 5%) with matched vs missing skill tags.
5. **Real-time Server-Sent Events (SSE)**: Streams live agent activity logs directly to the frontend Mission Control UI.
6. **Candidate Job Pipeline Tracking**: Easily mark jobs as `SAVED`, `INTERESTED`, `APPLIED`, `INTERVIEW`, `OFFER`, or `REJECTED`.

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- (Optional) TinyFish API Key (Obtain from https://agent.tinyfish.ai/api-keys)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt

# Copy configuration
cp .env.example .env

# Launch FastAPI Server
uvicorn app.main:app --reload --port 8000
```

FastAPI Interactive API Docs will be live at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

- `POST /api/profile` - Update candidate profile preferences
- `POST /api/profile/upload-resume` - Upload & parse PDF resume
- `POST /api/missions` - Create & dispatch new multi-agent search mission
- `GET /api/missions/{id}/events` - Real-time SSE live event stream
- `GET /api/jobs` - Search and filter discovered jobs
- `POST /api/jobs/{id}/apply-status` - Update personal application pipeline status
- `GET /api/agents/logs` - Fetch technical execution logs

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
