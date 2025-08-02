# 🚀 AI-Enhanced PDF Generator

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

# Clone repo
```bash
git clone https://github.com/your-username/ai-pdf-generator.git
cd ai-pdf-generator
```

# Install dependencies
```bash
npm install
```
# or
```bash
yarn install 💡
```
## 🔧 Configuration

Create a `.env.local` file in the project root with your Groq API key:

```bash
GROQ_API_KEY=your_groq_api_key_here
```
### 💡 Usage

- Fill out your details & click **✨ Enhance** to AI-polish your description  
- Click **View PDF** to preview — make edits & click **Back to Form** anytime  
- Hit **Download PDF** to save a print-ready document  
