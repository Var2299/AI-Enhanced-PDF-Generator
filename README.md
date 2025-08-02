# 🚀 AI-Enhanced PDF Generator [(Live)](https://ai-enhanced-pdf-generator.vercel.app/).

A sleek **Next.js** + **React** application that lets you build, preview, and download professional PDF profiles—powered by AI enhancements! Perfect for resumes, CVs, portfolios, or any profile doc.  

<p align="center">
  <img src="https://user-images.githubusercontent.com/your-avatar/ai-pdf-generator.gif" alt="Demo" width="800"/>
</p>

---

## 🔥 Key Features

- ✍️ **Dynamic Form**  
  – Collects name, email, phone, position, and description  
  – Client-side validation with **React Hook Form** + **Zod**  
  – AI-powered “✨ Enhance” button to instantly polish your description  

- 👀 **Live Preview**  
  – Beautiful on-page PDF preview using **@react-pdf/renderer**  
  – Sticky action panel with document summary and AI status  
  – Responsive, mobile-friendly layout  

- 📄 **One-Click Download**  
  – Generate and download high-quality, print-ready PDF  
  – Filename auto-formatted (`<Your_Name>_profile.pdf`)  

- 🧠 **AI Enhancements**  
  – **Description Enhancer**: Rewrites your text to sound more professional  
  – **Professional Summary**: 2–3 sentence pitch for headers  
  – **Skill Suggestions**: AI-recommended skills badges  
  – Powered by **groq-sdk** + **Llama3** model  

- 🔄 **Smart State Persistence**  
  – **sessionStorage** keeps your form data when navigating back from preview  
  – Auto-clear on full page refresh for fresh starts  
  – Zero-loss user experience  

---

<img width="868" height="932" alt="image" src="https://github.com/user-attachments/assets/d5b5f6da-d322-4f86-9621-a00e13b1af7a" />

---

<img width="882" height="913" alt="image" src="https://github.com/user-attachments/assets/0288382d-9c1b-4cf6-9e26-2977779aff75" />

---

<img width="1516" height="967" alt="image" src="https://github.com/user-attachments/assets/1ceb8891-0cea-41ba-876f-e864f97e0cc7" />

---

<img width="1435" height="667" alt="image" src="https://github.com/user-attachments/assets/e4ba3f0f-f726-4f36-96df-ab951405160d" />

---

# PDF
<img width="707" height="977" alt="image" src="https://github.com/user-attachments/assets/199a112e-99a9-4f1a-90e7-2d9dbeed3681" />

---

## 🛠️ Tech Stack

| Feature                  | Technology                              |
| ------------------------ | --------------------------------------- |
| Framework                | Next.js (App Router) ➡️ React           |
| Forms & Validation       | react-hook-form + zod + @hookform/resolvers |
| PDF Rendering            | @react-pdf/renderer                     |
| AI & Data Fetching       | groq-sdk (Llama3-8B model)              |
| UI Components            | shadcn/ui (Card, Button, Input, etc.)   |
| Icons                    | lucide-react                            |
| Styling                  | Tailwind CSS                            |
| State Persistence        | sessionStorage + localStorage           |

---

## 📦 Installation

### Clone repo
```bash
git clone https://github.com/your-username/ai-pdf-generator.git
cd ai-pdf-generator
```

### Install dependencies
```bash
npm install
```
### or
```bash
yarn install 
```
### 🔧 Configuration

Create a `.env.local` file in the project root with your Groq API key:

```bash
GROQ_API_KEY=your_groq_api_key_here
```
### 💡 Usage

- Fill out your details & click **✨ Enhance** to AI-polish your description  
- Click **View PDF** to preview — make edits & click **Back to Form** anytime  
- Hit **Download PDF** to save a print-ready document  
