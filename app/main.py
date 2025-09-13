import os
import uuid
from .db import get_session, init_db
from .models import Message
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

from .schemas import ChatRequest, ChatResponse
from .rag_utils import RAGEngine, ensure_data_dir, warm_embedder

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "Pradeep • Résumé Bot")
MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

ROOT_DIR = Path(__file__).resolve().parents[1]
RESUME_PATH = os.getenv("RESUME_PATH", str(ROOT_DIR / "data" / "PonnamcCV.pdf"))

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount /static only if folder exists (prevents crash)
STATIC_DIR = ROOT_DIR / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/health")
def health():
    info = {"status": "ok", "app": APP_NAME, "model": MODEL_NAME}
    try:
        rag = RAGEngine.load_or_none()
        info["rag_index"] = bool(rag)
    except Exception as e:
        info["rag_index_error"] = str(e)
    return info

History = List[Dict[str, str]]
SESSIONS: Dict[str, History] = {}

def get_or_create_session(session_id: Optional[str]) -> str:
    if session_id and session_id in SESSIONS:
        return session_id
    sid = str(uuid.uuid4())
    SESSIONS[sid] = []
    return sid

@app.on_event("startup")
def _startup():
    init_db()
    ensure_data_dir()
    try:
        RAGEngine.load()
    except Exception:
        chosen: Optional[str] = None
        env_path = (RESUME_PATH or "").strip()
        if env_path and Path(env_path).exists():
            chosen = env_path
        else:
            default_pdf = ROOT_DIR / "data" / "PonnamcCV.pdf"
            if default_pdf.exists():
                chosen = str(default_pdf)
            else:
                pdfs = list((ROOT_DIR / "data").glob("*.pdf"))
                if pdfs:
                    chosen = str(pdfs[0])
        if not chosen:
            raise FileNotFoundError("No resume PDF found. Put it under ./data or set RESUME_PATH.")
        print(f"[startup] Building index from: {chosen}")
        rag = RAGEngine.build_from_file(chosen)
        rag.save()
        print("[startup] Index built ✓")
    warm_embedder()
    print("[startup] Embedder warmed ✓")

def _is_greeting(text: str) -> bool:
    t = "".join(ch for ch in text.lower() if ch.isalpha() or ch.isspace()).strip()
    return t in {"hi","hello","hey","yo","hlo","hii","good morning","good afternoon","good evening","yup","h","a","."}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, request: Request):
    sid = get_or_create_session(req.session_id)
    user_msg = (req.message or "").strip()
    if not user_msg:
        return ChatResponse(reply="Ask me anything about Pradeep...", session_id=sid, references=[])

    with get_session() as session:
        session.add(Message(session_id=sid, role="user", content=user_msg))
        session.commit()

    if _is_greeting(user_msg):
        greeting = ("Hi, I’m Pradeep’s AI assistant. "
                    "Ask about his skills, projects, roles, education, ISRO work, Spring Boot, Cloud, or ML.")
        SESSIONS[sid].append({"role": "user", "content": user_msg})
        SESSIONS[sid].append({"role": "bot", "content": greeting})
        return ChatResponse(reply=greeting, session_id=sid, references=[])

    if user_msg.lower() == "clear history":
        SESSIONS[sid] = []
        return ChatResponse(reply="History cleared. What would you like to know?", session_id=sid, references=[])

    try:
        rag = RAGEngine.load()
        answer, refs = rag.answer(user_msg, model_name=MODEL_NAME, api_key=GROQ_API_KEY)
    except Exception as e:
        return ChatResponse(reply=f"Server error while answering (check FAISS/embeddings/Groq): {e}",
                            session_id=sid, references=[])

    SESSIONS[sid].append({"role": "user", "content": user_msg})
    SESSIONS[sid].append({"role": "bot", "content": answer})

    with get_session() as session:
        session.add(Message(session_id=sid, role="bot", content=answer))
        session.commit()

    return ChatResponse(reply=answer, session_id=sid, references=refs)

class WSMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

@app.get("/logs")
def get_logs(limit: int = 20):
    with get_session() as session:
        results = session.query(Message).order_by(Message.created_at.desc()).limit(limit).all()
        return results


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_json()
            msg = WSMessage(**data)
            sid = get_or_create_session(msg.session_id)
            text = (msg.message or "").strip()

            if not text:
                await ws.send_json({"reply": "Ask about Pradeep’s résumé.", "session_id": sid})
                continue

            if text.lower() == "clear history":
                SESSIONS[sid] = []
                await ws.send_json({"reply": "History cleared.", "session_id": sid})
                continue

            # --- NEW: log the user message to DB ---
            try:
                with get_session() as session:
                    session.add(Message(session_id=sid, role="user", content=text))
                    session.commit()
            except Exception as e:
                # Non-fatal: still continue responding
                print(f"[ws] Failed to log user message: {e}")

            try:
                rag = RAGEngine.load()
                answer, refs = rag.answer(text, model_name=MODEL_NAME, api_key=GROQ_API_KEY)
            except Exception as e:
                await ws.send_json({"reply": f"Error: {e}", "session_id": sid, "references": []})
                continue

            SESSIONS[sid].append({"role": "user", "content": text})
            SESSIONS[sid].append({"role": "bot", "content": answer})

            # --- NEW: log the bot reply to DB ---
            try:
                with get_session() as session:
                    session.add(Message(session_id=sid, role="bot", content=answer))
                    session.commit()
            except Exception as e:
                print(f"[ws] Failed to log bot message: {e}")

            await ws.send_json({"reply": answer, "session_id": sid, "references": refs})
    except WebSocketDisconnect:
        return

# Serve your portfolio at "/"
SITE_DIR = ROOT_DIR / "pradeep_site"
app.mount("/", StaticFiles(directory=str(SITE_DIR), html=True), name="site")
