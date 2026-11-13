# loads questions.json 
# sepration is what blocks prompt injection 

import json
import os

_CHATBOT_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_CHATBOT_DIR)
QUESTIONS_PATH = os.path.join(_PROJECT_ROOT, "questions.json")

with open(QUESTIONS_PATH, encoding="utf-8") as _f:
    _REGISTRY = json.load(_f)

def get_global_questions():
    """Chips shown on first load, before an artifact is selected"""
    return _REGISTRY["global"]

def get_artifact_questions(artifact_id: str):
    """Chips for one artifact returns [] for unknown ids"""
    return _REGISTRY["artifacts"].get(artifact_id, [])

def resolve_question(artifact_id: str , question_id: str):
    """
    The security boundary. Given the two IDs the browser sent, return the
    trusted question_text, or None if either ID is unknown.
    This function NEVER takes text from the client as input to the model.
    """
    for q in get_artifact_questions(artifact_id):
        if q["question_id"] == question_id:
            return q["question_text"]
    for q in get_global_questions():
        if q["question_id"] == question_id:
            return q["question_text"]
    return None

if __name__ == "__main__":
    print("Global chips:")
    for q in get_global_questions():
        print(" ", q["question_id"], "-", q["label"])
    for aid in ("sojourner", "spirit", "opportunity", "eagle"):
        print(f"\n{aid} chips:")
        for q in get_artifact_questions(aid):
            print(" ", q["question_id"], "-", q["label"])   
    # Resolution sanity: known ID returns text, unknown returns None.
    print("\nresolve('spirit','spirit-purpose') ->", repr(resolve_question("spirit", "spirit-purpose")))
    print("resolve('spirit','bogus-id') ->", repr(resolve_question("spirit", "bogus-id")))
    