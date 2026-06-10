# NeurolLint — AI-Powered Code Review Assistant

A Software that enables developers to upload code files and receive intelligent, structured code reviews powered by a local LLM (via LM Studio) or any OpenAI-compatible API endpoint.

---

##  Features

- **Authentication** — Secure register/login with JWT-based session management
- **Project Management** — Create, view, and delete code review projects
- **File Upload** — Drag & drop or click-to-upload source files with live preview
- **Code Explorer** — File tree with syntax-highlighted code viewer (Prism.js)
- **AI Review Engine** — Three review modes: General, Security, Performance
- **Review History** — All past reviews are persisted and accessible per project
- **Configurable AI Provider** — Works with LM Studio, OpenAI, or any OpenAI-compatible endpoint

---

##  Tech Stack

### Frontend
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + Shadcn/ui
- Prism.js (syntax highlighting)
- Axios

### Backend
- NestJS + TypeScript
- Supabase (PostgreSQL)
- JWT Authentication
- Multer (file uploads)

### AI
- LM Studio (local inference) — OpenAI-compatible endpoint
- Model: `qwen2.5-coder` (configurable)

---

##  Project Structure

```
neurolint/
├── frontend/                  # Next.js application
│   └── src/
│       ├── app/               # App Router pages
│       │   ├── layout.tsx     # Root HTML shell
│       │   ├── page.tsx       # Root redirect to /login
│       │   ├── login/         # Login page
│       │   ├── register/      # Register page
│       │   └── dashboard/     # Protected workspace
│       │       ├── page.tsx   # Projects dashboard
│       │       └── projects/
│       │           └── [id]/  # Project detail & AI review
│       ├── components/        # Reusable UI components
│       │   ├── ui/            # Atom-level primitives (Button, Input, Card)
│       │   ├── dashboard/     # Dashboard-specific components
│       │   └── project/       # Project page components
│       └── hooks/             # Custom React hooks
│           ├── useProjects.ts # Project management logic
│           ├── useFiles.ts    # File upload/delete logic
│           └── useReviews.ts  # AI review logic
│
├── backend/                   # NestJS application
│   └── src/
│       ├── auth/              # JWT authentication module
│       ├── projects/          # Projects CRUD module
│       ├── files/             # File upload module
│       ├── ai/                # AI review module
│       └── supabase/          # Supabase database service
│
├── README.md
├── AI_USAGE.md
└── ARCHITECTURE.md
```

---

##  Prerequisites

- Node.js 18+
- npm
- [LM Studio](https://lmstudio.ai/) (for local AI inference)
- Supabase account (free tier works)

---

##  Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/neurolint.git
cd neurolint
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_publishable_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run start:dev
```

> Backend runs on `http://localhost:3001`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on `http://localhost:3000`

---

### 4. LM Studio Setup

1. Download and install [LM Studio](https://lmstudio.ai/)
2. Search and download a model — recommended:
   - `qwen2.5-coder-0.5b-instruct` (fast, ~500MB)
   - `qwen3-4b` (higher quality, ~2.5GB)
3. Go to the **Local Server** tab in LM Studio
4. Click **Start Server** — runs on `http://localhost:1234`
5. The backend will automatically connect to it

---

##  Database Setup

Run the following SQL in your **Supabase SQL Editor** to create all required tables:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT NOT NULL,
  issues JSONB,
  recommendations JSONB,
  severity TEXT,
  review_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  api_key TEXT,
  model_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE
);
```

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects for current user |
| POST | `/projects` | Create a new project |
| DELETE | `/projects/:id` | Delete a project |
| GET | `/projects/:id/reviews` | Get all reviews for a project |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/:id/files` | Get all files in a project |
| POST | `/projects/:id/files` | Upload files to a project |
| DELETE | `/projects/:id/files/:fileId` | Delete a specific file |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/review` | Generate an AI code review |
| POST | `/ai/chat` | Chat with code as context |

---

##  AI Configuration

The AI service connects to any OpenAI-compatible endpoint. By default it uses LM Studio at `http://localhost:1234`.

To switch providers, update `backend/src/ai/ai.service.ts`:

```typescript
private readonly apiUrl = 'YOUR_API_URL';
private readonly model  = 'YOUR_MODEL_NAME';
```

### Supported Providers

| Provider | Base URL |
|----------|----------|
| LM Studio | `http://localhost:1234/v1/chat/completions` |
| OpenAI | `https://api.openai.com/v1/chat/completions` |
| Gemini (OpenAI-compat) | `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` |
| Any OpenAI-compatible API | Custom URL |

---

##  Usage

1. Open `http://localhost:3000` in your browser
2. Register an account or login
3. Create a new project from the dashboard
4. Upload code files by dragging and dropping them
5. Select a file to preview it with syntax highlighting
6. Choose a review type (General / Security / Performance)
7. Click **Review with AI** and wait for the analysis
8. View past reviews anytime from the Review History panel

---

##  License

MIT
