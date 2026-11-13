import os
import uuid

from flask import Flask, jsonify, request
from flask_cors import CORS

from chatbot.questions import (
    get_artifact_questions,
    get_global_questions,
    resolve_question,
)
from chatbot.rag import get_chain

app = Flask(__name__)
CORS(app)

_CHAIN = None  # lazy built on first chat


def _ensure_chain():
    """build on first use so /health and artifacts still work if Ollama is temporarily down (/api/chat) the cause"""
    global _CHAIN
    if _CHAIN is None:
        _CHAIN = _build_multi_artifact_chain()
    return _CHAIN


# ---- artifact metadata
ARTIFACTS = [
    {
        "artifact_id": "sojourner",
        "name": "Sojourner",
        "launch_date": "December 4, 1996",
        "mission_duration": "July 4 – September 27, 1997",
        "location": "Ares Vallis, Mars",
        "blurb": "The first wheeled rover to explore another planet.",
    },
    {
        "artifact_id": "spirit",
        "name": "Spirit",
        "launch_date": "June 10, 2003",
        "mission_duration": "2004 – 2011 (planned 90 days)",
        "location": "Gusev Crater, Mars",
        "blurb": "A twin rover that outlived its mission by 6 years.",
    },
    {
        "artifact_id": "opportunity",
        "name": "Opportunity",
        "launch_date": "July 7, 2003",
        "mission_duration": "2004 – 2019 (planned 90 days)",
        "location": "Perseverance Valley, Mars",
        "blurb": "The longest-distance driver on another world.",
    },
    {
        "artifact_id": "eagle",
        "name": "Eagle (Apollo 11)",
        "launch_date": "July 16, 1969",
        "mission_duration": "July 20–21, 1969",
        "location": "Tranquility Base, the Moon",
        "blurb": "The descent stage that carried the first humans to the Moon.",
    },
]


@app.get("/api/health")
def health():
    """prove flask is up"""
    return jsonify(status="ok")


@app.get("/api/artifacts")
def list_artifacts():
    """Display metadata for the artifacts cards"""
    return jsonify(artifacts=ARTIFACTS)


@app.get("/api/questions")
def list_questions():
    """Return every chip the UI needs without question_text"""
    payload = {"global": [], "artifacts": {}}
    for q in get_global_questions():
        payload["global"].append({"question_id": q["question_id"], "label": q["label"]})

    for a in ARTIFACTS:
        aid = a["artifact_id"]
        payload["artifacts"][aid] = [
            {"question_id": q["question_id"], "label": q["label"]}
            for q in get_artifact_questions(aid)
        ]

    return jsonify(payload)


# --- session memory (dies when flask restarts)
_SESSIONS: dict[str, list[dict]] = {}
MAX_HISTORY_MESSAGES = 6


@app.post("/api/chat")
def chat():
    body = request.get_json(silent=True) or {}
    artifact_id = body.get("artifact_id")
    question_id = body.get("question_id")
    session_id = body.get("session_id") or str(uuid.uuid4())

    if not artifact_id or not question_id:
        return jsonify(error="artifact_id and question_id are required"), 400

    question_text = resolve_question(artifact_id, question_id)
    if question_text is None:
        return jsonify(error="unknown question_id for this artifact"), 400

    # fetch or create session history
    history = _SESSIONS.setdefault(session_id, [])

    try:
        chain = _ensure_chain()
        reply = chain.invoke(
            {
                "question": question_text,
                "artifact_id": artifact_id,
                "artifact_name": _artifact_name(artifact_id),
                "history": history[-MAX_HISTORY_MESSAGES:],
            }
        )
    except Exception as e:
        app.logger.exception("Chat failed")
        return jsonify(error=f"chat failed: {e.__class__.__name__}"), 500

    history.append({"role": "human", "content": question_text})
    history.append({"role": "assistant", "content": reply})

    # trim to last MAX_HISTORY after appending so next req is bounded
    del history[:-MAX_HISTORY_MESSAGES]
    return jsonify(reply=reply, session_id=session_id)


def _artifact_name(artifact_id: str) -> str:
    for a in ARTIFACTS:
        if a["artifact_id"] == artifact_id:
            return a["name"]
    return artifact_id


# ---- bridge to chatbot/rag.py


def _build_multi_artifact_chain():
    from chatbot.rag import get_chain

    class _MultiArtifactChain:
        def invoke(self, payload: dict):
            artifact_id = payload["artifact_id"]
            artifact_name = payload.get("artifact_name", artifact_id)
            question = payload["question"]
            chain = get_chain(artifact_id, artifact_name=artifact_name)
            return chain.invoke(question)

    return _MultiArtifactChain()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
