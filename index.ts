import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate summary suggestions
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { jobHistory, skills } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert resume writer who specializes in creating professional summaries." },
        { role: "user", content: `Generate 2 professional resume summary options for:\nJob History: ${jobHistory}\nSkills: ${skills.join(", ")}` }
      ]
    });

    res.json({ suggestions: response.choices[0]?.message?.content || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate summary" });
  }
});

// Generate job description suggestions
app.post("/api/ai/generate-job-description", async (req, res) => {
  try {
    const { jobTitle, company, responsibilities } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert resume writer specializing in job descriptions." },
        { role: "user", content: `Create 2 achievement-focused bullet points for ${jobTitle} at ${company}.\nResponsibilities: ${responsibilities}` }
      ]
    });

    res.json({ suggestions: response.choices[0]?.message?.content || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate job description" });
  }
});

// Resume storage (in-memory)
const resumes = new Map();
let resumeId = 1;

app.post("/api/resumes", (req, res) => {
  const id = resumeId++;
  const resume = { id, ...req.body, createdAt: new Date() };
  resumes.set(id, resume);
  res.status(201).json(resume);
});

app.get("/api/resumes/:id", (req, res) => {
  const resume = resumes.get(parseInt(req.params.id));
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
});

// Dynamic Port for Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
