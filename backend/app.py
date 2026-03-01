from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

client = Groq(api_key="YOUR_GROQ_API_KEY_HERE")

@app.get("/health")
def health():
    return jsonify({"ok": True})

def analyze_with_groq(text, url):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a privacy policy analyst. You only respond with valid JSON, nothing else."
                },
                {
                    "role": "user",
                    "content": f"""Analyze this webpage content and return ONLY this JSON structure:

{{
  "score": <number 0-100, where 100 is most risky>,
  "risk_level": "<Low | Medium | High | Critical>",
  "summary": "<2-3 sentence plain English summary a student would understand>",
  "worst_clauses": ["<specific concerning clause 1>", "<clause 2>", "<clause 3>"],
  "verdict": "<one punchy sentence about this site's privacy>",
  "actions": ["<action user should take 1>", "<action 2>", "<action 3>"]
}}

URL: {url}
Content: {text[:4000]}"""
                }
            ]
        )
        content = response.choices[0].message.content
        print("Groq raw response:", content)
        # strip markdown code blocks if present
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content.strip())
    except Exception as e:
        print("Groq error:", e)
        return None

@app.post("/analyze")
def analyze():
    data = request.get_json(force=True)
    text = data.get("text", "")
    url = data.get("url", "")

    ai_result = analyze_with_groq(text, url)

    if ai_result:
        return jsonify({
            "score": ai_result.get("score", 50),
            "risk_level": ai_result.get("risk_level", "Unknown"),
            "summary": ai_result.get("summary", ""),
            "worst_clauses": ai_result.get("worst_clauses", []),
            "verdict": ai_result.get("verdict", ""),
            "actions": ai_result.get("actions", [])
        })
    else:
        return jsonify({
            "score": 50,
            "risk_level": "Unknown",
            "summary": "Could not analyze this page.",
            "worst_clauses": [],
            "verdict": "Analysis unavailable.",
            "actions": ["Review the privacy policy manually."]
        })

if __name__ == "__main__":
    app.run(port=5000, debug=True)