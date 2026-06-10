NeurolLint — AI-Powered Code Review Assistant

A full-stack application that enables developers to upload code files and receive intelligent, structured code reviews powered by a local LLM (via LM Studio) or any OpenAI-compatible API endpoint.

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

## 🛠 Tech Stack

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

## 📁 Project Structure
neurolint/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # App Router pages
│       ├── components/# Reusable UI components
│       └── hooks/     # Custom React hooks
├── backend/           # NestJS application
│   └── src/
│       ├── auth/      # Authentication module
│       ├── projects/  # Projects module
│       ├── files/     # File upload module
│       ├── ai/        # AI review module
│       └── supabase/  # Database service
├── README.md
├── AI_USAGE.md
└── ARCHITECTURE.md

---

## ⚙️ Prerequisites

- Node.js 18+
- npm
- [LM Studio](https://lmstudio.ai/) (for local AI inference)
- Supabase account (free tier works)

---

##  Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/neurolint.git
cd neurolint
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_publishable_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend:

```bash
npm run start:dev
```

Backend runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. LM Studio Setup

1. Download and install [LM Studio](https://lmstudio.ai/)
2. Download a model (recommended: `qwen2.5-coder-0.5b-instruct` for speed or `qwen3-4b` for quality)
3. Go to **Local Server** tab in LM Studio
4. Click **Start Server** — it will run on `http://localhost:1234`
5. The backend will automatically connect to it

---

##  Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

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
```

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all user projects |
| POST | `/projects` | Create new project |
| DELETE | `/projects/:id` | Delete a project |
| GET | `/projects/:id/reviews` | Get project review history |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/:id/files` | Get all files in project |
| POST | `/projects/:id/files` | Upload files to project |
| DELETE | `/projects/:id/files/:fileId` | Delete a file |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/review` | Generate AI code review |
| POST | `/ai/chat` | Chat with code context |

---

## AI Configuration

The AI service is configured to use any OpenAI-compatible endpoint. By default it connects to LM Studio at `http://localhost:1234`.

To use a different provider, update `backend/src/ai/ai.service.ts`:

```typescript
private readonly apiUrl = 'YOUR_API_URL';
private readonly model = 'YOUR_MODEL_NAME';
```

Supported providers:
- **LM Studio** — `http://localhost:1234/v1/chat/completions`
- **OpenAI** — `https://api.openai.com/v1/chat/completions`
- **Gemini** — `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
- Any other OpenAI-compatible endpoint

---

## 📸 Screenshots

> Add screenshots of your app here

---

## 📄 License

MIT