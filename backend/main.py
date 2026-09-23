import os
import time
import feedparser
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Dict, Any

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()

app = FastAPI(title="NEXORIA ASTRA AI Backend", version="1.0.0")

# Enable CORS for frontend
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
    return {
        "status": "ok",
        "service": "NEXORIA ASTRA Groq Backend",
        "groq_active": bool(GROQ_API_KEY),
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

    reply_text = None

    # 1. Groq Ultra-Fast Models (Qwen / GPT-OSS / Allam)
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
                        "temperature": 0.75,
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

    # Fallback if Groq unavailable
    if not reply_text:
        if "tamil" in user_prompt.lower():
            reply_text = "வணக்கம்! நான் உங்கள் NEXORIA ASTRA விண்வெளி தோழன். உங்களுடன் உரையாடுவதில் எனக்கு மிக்க மகிழ்ச்சி!"
        else:
            reply_text = f"NEXORIA telemetry link active for '{user_prompt}'. All space station systems are running smoothly!"

    return {"status": "success", "reply": reply_text}

# ─────────────────────────────────────────────────────────
# TECH NEWS ENDPOINT  (10-min cache, multi-source)
# Sources: TechCrunch, The Verge, Wired, Ars Technica, Hacker News
# ─────────────────────────────────────────────────────────

_news_cache: Dict[str, Any] = {"data": [], "fetched_at": 0}
CACHE_TTL = 600  # 10 minutes

RSS_SOURCES = [
    {
        "name": "TechCrunch",
        "url": "https://techcrunch.com/feed/",
        "category": "Startup & VC",
        "color": "#0FA0CE",
    },
    {
        "name": "The Verge",
        "url": "https://www.theverge.com/rss/index.xml",
        "category": "Gadgets & Tech",
        "color": "#FF4D4D",
    },
    {
        "name": "Wired",
        "url": "https://www.wired.com/feed/rss",
        "category": "Science & Tech",
        "color": "#FF8C00",
    },
    {
        "name": "Ars Technica",
        "url": "https://feeds.arstechnica.com/arstechnica/index",
        "category": "Deep Dive",
        "color": "#FF6600",
    },
    {
        "name": "MIT Tech Review",
        "url": "https://www.technologyreview.com/feed/",
        "category": "AI & Research",
        "color": "#A855F7",
    },
]

def fetch_rss_articles(limit_per_source: int = 6) -> List[Dict]:
    articles = []
    for source in RSS_SOURCES:
        try:
            feed = feedparser.parse(source["url"])
            for entry in feed.entries[:limit_per_source]:
                # Extract image if available
                image = None
                if hasattr(entry, "media_content") and entry.media_content:
                    image = entry.media_content[0].get("url")
                elif hasattr(entry, "enclosures") and entry.enclosures:
                    image = entry.enclosures[0].get("href")

                # Published time
                published = None
                if hasattr(entry, "published"):
                    published = entry.published
                elif hasattr(entry, "updated"):
                    published = entry.updated

                articles.append({
                    "id": entry.get("id", entry.get("link", "")),
                    "title": entry.get("title", "No Title"),
                    "url": entry.get("link", ""),
                    "summary": entry.get("summary", "")[:200] if entry.get("summary") else "",
                    "source": source["name"],
                    "category": source["category"],
                    "color": source["color"],
                    "image": image,
                    "published": published,
                })
        except Exception as e:
            print(f"[TechNews] RSS error for {source['name']}: {e}")
    return articles

def fetch_hackernews_top(limit: int = 10) -> List[Dict]:
    articles = []
    try:
        resp = requests.get(
            "https://hacker-news.firebaseio.com/v0/topstories.json",
            timeout=5
        )
        story_ids = resp.json()[:limit]
        for sid in story_ids:
            try:
                story = requests.get(
                    f"https://hacker-news.firebaseio.com/v0/item/{sid}.json",
                    timeout=4
                ).json()
                if story and story.get("url") and story.get("type") == "story":
                    articles.append({
                        "id": str(sid),
                        "title": story.get("title", ""),
                        "url": story.get("url", ""),
                        "summary": f"{story.get('score', 0)} points · {story.get('descendants', 0)} comments on HN",
                        "source": "Hacker News",
                        "category": "Community",
                        "color": "#FF6600",
                        "image": None,
                        "published": None,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[TechNews] HackerNews error: {e}")
    return articles

@app.get("/api/tech-news")
def get_tech_news(refresh: bool = False):
    global _news_cache
    now = time.time()

    # Serve from cache if fresh (unless force refresh)
    if not refresh and _news_cache["data"] and (now - _news_cache["fetched_at"]) < CACHE_TTL:
        return {
            "status": "ok",
            "cached": True,
            "fetched_at": _news_cache["fetched_at"],
            "articles": _news_cache["data"],
        }

    # Fetch fresh data
    rss_articles = fetch_rss_articles(limit_per_source=6)
    hn_articles = fetch_hackernews_top(limit=10)

    all_articles = rss_articles + hn_articles

    # Sort by source order (RSS first, then HN)
    _news_cache["data"] = all_articles
    _news_cache["fetched_at"] = now

    return {
        "status": "ok",
        "cached": False,
        "fetched_at": now,
        "articles": all_articles,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8555, reload=False)
