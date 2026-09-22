import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="NEXORIA ASTRA Vercel Serverless Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    voice_persona: str = "alloy"

@app.get("/api/health")
def health_check():
    groq_set = bool(os.getenv("GROQ_API_KEY", "").strip())
    openai_set = bool(os.getenv("OPENAI_API_KEY", "").strip() or os.getenv("VITE_OPENAI_API_KEY", "").strip())
    return {
        "status": "ok",
        "service": "NEXORIA Vercel Serverless Backend",
        "env_keys": {
            "GROQ_API_KEY_configured": groq_set,
            "OPENAI_API_KEY_configured": openai_set
        }
    }

@app.post("/api/astra-chat")
def astra_chat(req: ChatRequest):
    user_prompt = req.message.strip()
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Empty message")

    system_instruction = (
        "You are ASTRA, the AI astronaut co-pilot of NEXORIA. "
        "Answer exactly what the user asks, clearly and directly. "
        "Keep every response extremely short, usually 1 sentence, maximum 2 sentences. "
        "Do not add greetings, explanations, context, or extra information unless asked. "
        "Do not include emojis or symbols in your response. "
        "If the user speaks Tamil or Tanglish, reply naturally in Tamil or Tanglish."
    )

    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
    reply_text = None

    if GROQ_API_KEY:
        groq_models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "allam-2-7b"]
        for model_name in groq_models:
            try:
                resp = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.7,
                        "max_tokens": 200,
                    },
                    timeout=8,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    reply_text = data["choices"][0]["message"]["content"].strip()
                    if reply_text:
                        break
            except Exception as e:
                print(f"Groq {model_name} Error: {e}")

    if not reply_text:
        if "tamil" in user_prompt.lower():
            reply_text = "வணக்கம்! நான் உங்கள் NEXORIA ASTRA விண்வெளி தோழன். உங்களுடன் உரையாடுவதில் எனக்கு மிக்க மகிழ்ச்சி!"
        else:
            reply_text = f"NEXORIA telemetry link active for '{user_prompt}'. All space station systems are running smoothly."

    return {"status": "success", "reply": reply_text}
