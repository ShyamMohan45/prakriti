# DxAssist - Complete Setup & Usage Guide

## ✅ What's Been Set Up

Your DxAssist application now has:

1. **Document Analysis Backend** (Port 8001)
   - Analyzes clinical PDFs
   - Generates summaries and identifies conditions
   - Stores analysis history per user

2. **Streaming Chat Backend** (Port 8000)  
   - FastAPI server for real-time clinical discussions
   - Powered by HuggingFace's Meta-Llama 3 model
   - Provides evidence-based clinical assistance

3. **Frontend with Document Analyzer**
   - Upload clinical PDFs at `/diagnostics/analyze`
   - View analysis results with clinical priorities
   - **NEW**: Ask follow-up questions via streaming chat

---

## 🚀 How to Run Everything

### Step 1: Set Up HuggingFace Token

1. Go to https://huggingface.co/settings/tokens
2. Create a new access token (read access is fine)
3. Copy the token

### Step 2: Configure Backend Environment

Create `.env` file in `/backend/`:

```bash
cd backend
```

Edit or create `.env` file with:

```
HUGGINGFACEHUB_API_TOKEN=your_token_from_step_1
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASS=your_mysql_password
DATABASE_NAME=dxassist
```

### Step 3: Start the Virtual Environment

```bash
# In backend folder
.\venv\Scripts\activate
```

You should see `(venv)` in your prompt.

### Step 4: Start Both Backends

**Terminal 1 - Document Analysis Backend (Port 8001):**
```bash
cd backend
python app/main.py
```

**Terminal 2 - Streaming Chat Backend (Port 8000):**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Wait for messages like:
```
INFO: Application startup complete
```

### Step 5: Start Frontend

**Terminal 3:**
```bash
npm run dev
```

---

## 📖 How to Use

### Upload & Analyze Document

1. Open http://localhost:3000/diagnostics/analyze
2. Click "Choose File" and select a clinical PDF
3. Click "Analyze Document"
4. Wait for analysis to complete

### Ask Clinical Questions

Once analysis is done:

1. Scroll down to "💬 Clinical Discussion" section
2. Type your question (e.g., "What are the next steps for this patient?")
3. Click "Send" or press Enter
4. Watch the response stream in real-time

---

## 🔧 Troubleshooting

### "Email not configured" Error
- Restart your Next.js dev server (Ctrl+C and `npm run dev`)
- Ensure `.env.local` has EMAIL_USER and EMAIL_PASS

### "HuggingFace API token not configured"
- Check that HUGGINGFACEHUB_API_TOKEN is in `/backend/.env`
- Token must have read access
- Restart the backend with `python app/main.py`

### Chat Not Working
- Ensure port 8000 backend is running: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Check browser console (F12) for errors
- Verify HuggingFace token is valid

### Database Connection Error
- Verify MySQL is running
- Check DATABASE_PASS in `.env` matches your actual MySQL password
- Ensure DATABASE_NAME=dxassist exists

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│     Next.js Frontend (3000)          │
│    ├─ Document Upload Form           │
│    └─ Streaming Chat Interface       │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│Backend 8001  │  │Backend 8000  │
│(Existing)    │  │(New Streaming)
│- Analyze PDF │  │- Chat Stream  │
│- Store DB    │  │- LLM Responses│
└────────┬─────┘  └──────┬───────┘
         │                │
         └────────┬───────┘
                  ▼
            ┌──────────────┐
            │   MySQL DB   │
            └──────────────┘
```

---

## 🎯 Key Features Added

✅ **Streaming Chat** - Real-time responses as they're generated
✅ **Evidence-Based** - Responses cite WHO, CDC, NHS, Mayo Clinic
✅ **Clinical Focus** - Trained on medical domain
✅ **Isolated Backend** - Your existing backend remains unchanged
✅ **Auto-Scroll** - Chat automatically scrolls to latest message
✅ **Error Handling** - Graceful fallbacks if API fails

---

## 📝 Example Workflow

1. **Upload** → Clinical note for a CKD patient
2. **Analysis** → System identifies Stage 5 CKD, hypertension, symptoms
3. **Question** → "What are treatment options?"
4. **Response** → Streaming response discussing dialysis, transplant, nephrology referral with citations

---

## 🆘 Need Help?

Check:
- Terminal output for error messages
- Browser console (F12 > Console)
- `.env` file for missing credentials
- That all three servers are running (ports 3000, 8000, 8001)

---

**Your DxAssist system is now ready for clinical document analysis with AI-powered discussions!** 🎉
