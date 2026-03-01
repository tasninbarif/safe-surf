
# Safe Surf

> **We read the fine print so you don't have to.**

Safe Surf is a Chrome extension that instantly analyzes any privacy policy or terms and conditions page and tells you exactly how risky it is — in plain English. No more legal jargon. No more clicking "I Agree" blindly.

Built at **HackHer 2026**.

---

## Features

- **Instant Risk Score** — Get a clear 0–100 privacy risk score for any website
- **AI-Powered Summary** — Plain English explanation of what you're actually agreeing to
- **Worst Clauses** — The top 3 most concerning parts of any privacy policy
- **One-Click Policy Finder** — Automatically navigates to a site's privacy policy for you
- **Color-Coded Results** — Green (safe) to red (critical) at a glance
- **Recommended Actions** — Tells you exactly what to do to protect yourself

---

## Demo

| Low Risk (Wikipedia) | High Risk (TikTok) |
|---|---|
| Score: 10/100  | Score: 89/100  |
| Wikipedia does not collect personal data | TikTok shares data with third parties and tracks location |

---

## Tech Stack

**Frontend (Chrome Extension)**
- JavaScript, HTML, CSS
- Chrome Extensions API (Manifest V3)

**Backend**
- Python, Flask, Flask-CORS
- Groq API (Llama 3.3 70B)

---

## Project Structure
```
Safe Surf/
├── backend/
│   ├── app.py              # Flask server + Groq AI integration
│   └── requirements.txt    # Python dependencies
└── extension/
    ├── manifest.json        # Chrome extension config
    ├── content.js           # Extracts page text from active tab
    ├── popup.html           # Extension UI
    ├── popup.js             # Handles analysis + renders results
    └── icon.png             # Extension icon
```

---

##  How to Run It

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/safe-surf.git
cd safe-surf
```

### 2. Set up the backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
The Flask server will run on `http://127.0.0.1:5000`

### 3. Add your Groq API key
In `backend/app.py`, replace:
```python
client = Groq(api_key="YOUR_GROQ_KEY_HERE")
```


### 4. Load the Chrome Extension
1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

### 5. Use it!
- Navigate to any website
- Click the Safe Surf icon in your toolbar
- Click **"Find Privacy Policy"** then **"Analyze this page"**

---

##  How It Works
```
User clicks extension
       ↓
content.js extracts page text
       ↓
popup.js sends text to Flask backend
       ↓
Flask forwards to Groq (Llama 3.3 70B)
       ↓
AI returns structured JSON analysis
       ↓
popup.js renders color-coded results
```

---

##  Challenges We Faced

- **API Billing** — Pivoted from OpenAI to Groq's free tier mid-hackathon
- **Inconsistent AI Output** — Built a JSON cleanup layer to handle markdown responses
- **Model Deprecation** — Our Groq model was decommissioned during the hackathon; adapted quickly
- **Emoji Rendering** — Fixed garbled characters with a single UTF-8 charset declaration

---

##  What's Next

- [ ] Queen's Student Mode — flags risks specific to student IDs and OSAP data
- [ ] Cross-site privacy dashboard
- [ ] Real-time alerts when a site's privacy policy changes
- [ ] Automatic policy detection without manual navigation

---

##  Team

| Name |
|------|
| Tasnin Binta Arif |
| Saida Yassin |
| Anah Merchant |

Built with 💙 at HackHer 2026 
