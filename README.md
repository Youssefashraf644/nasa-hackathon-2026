# 🚀 Abandoned but Not Forgotten

### Bringing the stories of abandoned space exploration hardware to life through AI.

**Abandoned but Not Forgotten** is an interactive, AI-powered educational web application designed for students aged **10–16**. It allows students to explore NASA hardware left behind on the Moon and Mars by interacting directly with abandoned spacecraft through AI-powered conversations.

Instead of reading traditional encyclopedias, students select a spacecraft or space artifact and chat with it as if it were telling its own story.

Powered by **Retrieval-Augmented Generation (RAG)**, the AI responds in the first-person voice of each artifact, using factual information from real NASA mission data to provide educational, engaging, and contextually accurate answers.

Built for the **NASA Space Apps Challenge**.

---

## ✨ Key Features

### 🤖 1. First-Person AI Conversations
- Students can interact with abandoned spacecraft and explore their stories.
- Each artifact has its own AI-generated personality and first-person voice.
- Responses are grounded in factual NASA mission information through a Retrieval-Augmented Generation (RAG) pipeline.
- The AI answers questions based on the selected artifact's mission history, technology, discoveries, and scientific contributions.

### 💬 2. Chip-Based Guided Conversations
- Free-text input is disabled to provide a controlled learning experience.
- Students interact using predefined question chips.
- Questions are designed to be accessible, engaging, and appropriate for students aged 10–16.
- The system retrieves trusted question text from a server-side question registry.

### 🛡️ 3. Secure Question Handling
- The frontend sends only a `question_id`, not arbitrary user-generated text.
- The Flask backend validates the ID and resolves the corresponding question from the trusted server-side `questions.json` registry.
- Unknown question IDs are rejected with a `400 Bad Request`.
- This design prevents direct user-supplied prompt injection through the chat endpoint, provided the backend continues to enforce server-side validation.

### 🧠 4. Contextual Conversation Memory
- Each conversation is associated with a unique `session_id`.
- Flask maintains conversation history using an in-memory dictionary.
- The AI receives the last **6 messages** as conversational context.
- This allows artifacts to maintain context and provide more natural follow-up responses.

### 🌌 5. Multi-Artifact RAG Indexing
- Each artifact has its own dedicated knowledge source.
- NASA mission documents are processed, chunked, and converted into vector embeddings.
- ChromaDB stores the resulting vector representations.
- Retrieval is filtered using `artifact_id`, ensuring that questions about one artifact do not retrieve information belonging to another.

### 🏅 6. Adopt an Artifact
- Students can choose their favorite spacecraft and officially adopt it.
- Adopted artifacts and student names are saved in browser `localStorage`.
- The application generates an official adoption certificate.
- Students can keep track of the artifacts they have adopted.

---

## 🛰️ Featured Space Artifacts

The application currently supports four historical space exploration artifacts:

| Artifact | Mission |
|---|---|
| Sojourner | Mars Pathfinder |
| Spirit | Mars Exploration Rover |
| Opportunity | Mars Exploration Rover |
| Eagle | Apollo 11 Lunar Module |

Each artifact has a dedicated knowledge corpus used by the RAG pipeline.

---

## 🏗️ System Architecture

The application follows a client-server architecture with a dedicated AI/RAG processing pipeline.

### Architecture Overview

```text
             BROWSER
        React + Vite (:5173)
                 |
                 | HTTP Requests (/api)
                 |
          Vite Development Proxy
                 |
                 v
           FLASK API (:5000)
                 |
          Server-side Validation
                 |
       Question ID Resolution
                 |
                 v
          LANGCHAIN / RAG
                 |
          +------+------+
          |             |
          v             v
      OLLAMA         CHROMADB
          |             |
          v             v
      qwen3:8b     Vector Search
     (Chat Model)  (Artifact Filter)
          |
          v
     AI Response
          |
          v
       FLASK API
          |
          v
        REACT UI
```

### Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | Interactive user interface |
| Build Tool | Vite | Frontend development and build |
| Styling | Tailwind CSS | Responsive UI and styling |
| Routing | React Router | Client-side navigation |
| Backend | Python Flask | REST API and application logic |
| API Communication | Flask-CORS | Cross-origin request handling |
| AI Framework | LangChain | RAG pipeline orchestration |
| Chat Model | Ollama – `qwen3:8b` | AI-generated conversations |
| Embedding Model | `nomic-embed-text` | Text embeddings |
| Vector Database | ChromaDB | Vector storage and similarity search |
| Browser Storage | localStorage | Adopted artifacts and student information |

### AI and RAG Pipeline

The application uses Retrieval-Augmented Generation to ensure that AI responses are based on the available mission knowledge rather than relying exclusively on the language model's internal knowledge.

The pipeline works as follows:

1. **Data Collection:** NASA mission information is organized into separate text files for each artifact.
2. **Text Processing:** The documents are split into smaller chunks using LangChain.
3. **Embedding Generation:** `nomic-embed-text` converts the chunks into vector embeddings.
4. **Vector Storage:** ChromaDB stores the embeddings alongside their associated metadata.
5. **Question Processing:** The backend resolves the selected question ID into trusted question text.
6. **Artifact Filtering:** ChromaDB retrieves relevant information using the selected `artifact_id`.
7. **Context Construction:** Retrieved information and recent conversation history are passed to the language model.
8. **Response Generation:** Ollama (`qwen3:8b`) generates a first-person response grounded in the retrieved information.

---

## 📂 Project Structure

```text
nasa-rag-bot/
│
├── app.py
│   # Flask application entrypoint and API routes
│
├── questions.json
│   # Server-side registry of predefined question chips
│
├── data/
│   ├── sojourner.txt
│   ├── spirit.txt
│   ├── opportunity.txt
│   └── eagle.txt
│   # Knowledge corpus for each space artifact
│
├── chatbot/
│   ├── __init__.py
│   ├── ingest.py
│   │   # Processes documents, generates embeddings,
│   │   # and builds the ChromaDB vector index
│   │
│   ├── questions.py
│   │   # Loads questions.json and resolves question IDs
│   │
│   └── rag.py
│       # LangChain configuration, prompts,
│       # retrieval, and response generation
│
├── debuging/
│   └── debug_retrieve.py
│       # Tests and verifies ChromaDB artifact filtering
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── ArtifactDetailPage.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── ChatWidget.jsx
│   │   │   └── AdoptionCertificate.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── chroma_db/
│   # Locally generated vector database (not committed to Git)
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Setup and Installation

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- **Python 3.10+**
- **Node.js 18+**
- **npm**
- **Ollama**
- **Git**

You should also have sufficient disk space and memory to run the local AI models.

### 1. Clone the Repository

```bash
git clone https://github.com/Youssefashraf644/nasa-hackathon-2026.git
```

Navigate to the project directory:

```bash
cd nasa-rag-bot
```

### 2. Ollama Setup

Install Ollama from:

https://ollama.com/

Make sure the Ollama service is running.

Download the required AI models:

```bash
ollama pull qwen3:8b
```

```bash
ollama pull nomic-embed-text
```

The application uses:

- `qwen3:8b` for generating AI responses.
- `nomic-embed-text` for converting documents into vector embeddings.

### 3. Backend Setup

Create a Python virtual environment from the project root:

```bash
python -m venv venv
```

Activate the environment.

**Windows:**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

### 4. Build the Vector Database

Before running the application for the first time, generate the ChromaDB vector index.

Run this command from the project root:

```bash
python -m chatbot.ingest
```

This script will:

1. Read the artifact knowledge files from `data/`.
2. Split the documents into smaller text chunks.
3. Generate embeddings using `nomic-embed-text`.
4. Store the embeddings and metadata in ChromaDB.
5. Generate the local `chroma_db/` directory.

**Important:** This step needs to be performed on each new development machine because the generated vector database is excluded from Git.

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

---

## 💻 Running the Application

The application requires two terminal windows to run the backend and frontend simultaneously.

### Terminal 1 – Flask Backend

From the project root, activate your virtual environment if it is not already active.

Run:

```bash
python app.py
```

The Flask API will be available at:

```text
http://127.0.0.1:5000
```

### Terminal 2 – React Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Open the application in your browser:

**http://localhost:5173**

---

## 🔌 API Documentation

The Flask backend exposes the following REST API endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks whether the backend is running |
| GET | `/api/artifacts` | Returns metadata for the four supported artifacts |
| GET | `/api/questions` | Returns available question chips without exposing their trusted question text |
| POST | `/api/chat` | Processes an artifact question and returns the AI-generated response |

### 1. Health Check

**Endpoint:**

```http
GET /api/health
```

Checks the availability of the Flask backend.

### 2. Get Artifacts

**Endpoint:**

```http
GET /api/artifacts
```

Returns metadata for the available space artifacts. This information is used to populate the artifact cards in the frontend.

### 3. Get Questions

**Endpoint:**

```http
GET /api/questions
```

Returns the predefined question chips.

The response exposes question IDs and display labels, but does not expose the trusted server-side question text.

### 4. Chat with an Artifact

**Endpoint:**

```http
POST /api/chat
```

**Request Body:**

```json
{
  "artifact_id": "spirit",
  "question_id": "spirit_001",
  "session_id": "unique-session-id"
}
```

**Parameters:**

| Parameter | Description |
|---|---|
| `artifact_id` | Identifies the selected spacecraft |
| `question_id` | Identifies a predefined question in the server-side registry |
| `session_id` | Identifies the current conversation session |

The backend validates the supplied IDs, retrieves the trusted question text, performs artifact-specific retrieval, and generates an AI response.

Unknown or invalid question IDs are rejected with:

```http
400 Bad Request
```

---

## 🛡️ Security Design: Chip-Only Chat

One of the core design decisions is disabling free-text input.

Since the application is designed for students aged 10–16, allowing unrestricted user prompts could introduce inappropriate content, unpredictable AI behavior, and prompt injection risks.

To address this, the application uses a controlled question-selection system.

### How It Works

```text
        STUDENT
           |
           v
    Selects Question Chip
           |
           v
     React Frontend
           |
           | Sends question_id
           v
       Flask Backend
           |
           v
   Validate Question ID
           |
      +----+----+
      |         |
    Valid     Invalid
      |         |
      v         v
 Resolve      Return 400
 Trusted      Bad Request
 Question
      |
      v
   RAG Pipeline
      |
      v
   AI Response
```

### Security Benefits

- The frontend cannot submit arbitrary question text through the chat endpoint.
- Question text is controlled by the backend.
- Only predefined and validated question IDs are accepted.
- Invalid IDs are rejected before reaching the AI pipeline.
- Students interact through a controlled and age-appropriate interface.

**Important security note:** This architecture prevents direct user-controlled prompt injection through the normal chat request. It does not eliminate every possible security risk. Backend validation, trusted data sources, prompt isolation, and output safety checks remain important.

---

## 💾 Data Persistence

The application currently uses three different persistence mechanisms.

| Component | Storage | Purpose |
|---|---|---|
| Knowledge Base | ChromaDB | Stores artifact document embeddings |
| Adoption System | Browser localStorage | Stores adopted artifacts and student information |
| Chat History | Flask in-memory dictionary | Stores recent messages for each conversation session |

### Chat Session Memory

Each conversation uses a unique `session_id`.

Flask maintains the conversation history and passes the last six messages to the RAG pipeline to preserve conversational context.

**Note:** Since chat history is stored in memory, it is temporary. Restarting the Flask application clears existing conversations. Persistent conversation storage would require a database or another storage solution.

---

## 🎯 Project Goals

The project aims to:

- Make space exploration history more engaging and accessible to younger students.
- Educate students about abandoned spacecraft and hardware on the Moon and Mars.
- Introduce students to real NASA missions and their scientific contributions.
- Demonstrate the practical use of Retrieval-Augmented Generation.
- Encourage curiosity about space exploration through interactive AI conversations.
- Promote responsible AI usage through controlled interactions and factual knowledge retrieval.

---

## 🔮 Future Improvements

Potential future enhancements include:

- Adding more abandoned spacecraft and lunar artifacts.
- Expanding the knowledge base with additional NASA mission documents.
- Improving artifact personalities and conversational capabilities.
- Adding multilingual support.
- Introducing interactive quizzes and educational challenges.
- Adding persistent conversation history.
- Improving AI response evaluation and factual verification.
- Expanding the adoption system with additional achievements and certificates.

---

## 🧰 Technologies at a Glance

**Frontend:** React, Vite, Tailwind CSS, React Router

**Backend:** Python, Flask, Flask-CORS

**AI / RAG:** LangChain, Ollama, Qwen3, Nomic Embeddings

**Vector Database:** ChromaDB

**Storage:** localStorage, Flask in-memory session storage

---

## 🌍 NASA Space Apps Challenge

Developed as part of the **NASA Space Apps Challenge**, this project explores how artificial intelligence can transform historical space mission information into interactive educational experiences.

Rather than treating abandoned space hardware as forgotten equipment, we give each artifact a voice and allow the next generation to discover its story.

**Because even after a mission ends, its story doesn't have to.** 🚀

---

*Abandoned but Not Forgotten — Exploring the stories left behind.*
