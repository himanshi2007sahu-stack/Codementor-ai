import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '5mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI:', err);
    }
  }

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      ok: true,
      hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    });
  });

  // AI Teacher assistance endpoint
  app.post('/api/gemini/teacher', async (req: Request, res: Response) => {
    const { topic, mode, context, question, language = 'Java', style = 'english' } = req.body;

    if (!ai || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(200).json({
        fallback: true,
        message: 'No external Gemini API key configured. Utilizing built-in expert curriculum & reasoning engine.',
      });
    }

    try {
      let prompt = '';
      if (mode === 'explain-simply') {
        prompt = `You are CodeMentor AI, a world-class Data Structures and Algorithms teacher who specializes in crystal-clear, beginner-friendly explanations.
Topic: "${topic}"
Target Language: ${language}
Tone/Language: ${style === 'hinglish' ? 'Friendly Hinglish (mix of conversational Hindi words written in English alphabet and clear English technical terms, e.g. "Arrays mein elements sequential memory locations pe store hote hain")' : 'Simple, highly intuitive plain English with vivid everyday metaphors'}.
Explain this topic simply:
1. What it is in 2 sentences.
2. An intuitive real-world analogy.
3. Why we use it over other alternatives.
4. Quick 3-step visualization description.
Keep formatting clean with bullet points and bold highlights.`;
      } else if (mode === 'another-example') {
        prompt = `You are CodeMentor AI, an expert DSA instructor.
Topic: "${topic}"
Context provided: "${context || ''}"
Provide an entirely NEW, intuitive, practical real-world scenario where this data structure or algorithm is used in modern tech companies (like Google, Netflix, Uber, or gaming engines).
Include:
1. Scenario overview
2. Why this specific DSA solves the problem efficiently
3. Brief dry-run demonstration of how data flows`;
      } else if (mode === 'hint') {
        prompt = `You are a DSA mentor helping a student solve a problem on "${topic}".
Problem context: "${context || ''}"
Provide a progressive Socratic hint. Do NOT give away the full code solution immediately.
Hint 1: Conceptual intuition to notice
Hint 2: Edge cases to watch out for
Hint 3: Data structure invariant to remember`;
      } else if (mode === 'explain-code') {
        prompt = `You are a DSA code explainer. Explain this ${language} code for "${topic}":
\`\`\`${language}
${context}
\`\`\`
Provide a line-by-line or block-by-block breakdown, explaining what each line does, pointer movements, loop invariants, and time/space complexity analysis.`;
      } else {
        // general query
        prompt = `You are CodeMentor AI, an encouraging and rigorous DSA teacher.
Topic: "${topic}"
User asked: "${question}"
Context: "${context || ''}"
Language preference: ${style === 'hinglish' ? 'Hinglish (mix of Hindi + English)' : 'Clear English'}.
Provide an accurate, educational, clear DSA response.`;
      }

      const callWithTimeout = (promise: Promise<any>, ms = 6000) =>
        Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('AI request timed out')), ms)),
        ]);

      let response;
      try {
        response = await callWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are CodeMentor AI, a patient, encouraging, top-tier DSA educator for engineering students. You give precise, pedagogically brilliant answers with clean markdown.',
            },
          }),
          5000
        );
      } catch (firstErr) {
        try {
          response = await callWithTimeout(
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: prompt,
              config: {
                systemInstruction: 'You are CodeMentor AI, a patient, encouraging, top-tier DSA educator for engineering students. You give precise, pedagogically brilliant answers with clean markdown.',
              },
            }),
            4000
          );
        } catch (secondErr) {
          return res.status(200).json({
            fallback: true,
            error: 'Upstream model unavailable. Loaded comprehensive built-in curriculum lesson.',
          });
        }
      }

      res.json({
        success: true,
        text: response.text || '',
        fallback: false,
      });
    } catch (err: any) {
      console.error('Gemini Teacher error:', err);
      res.status(200).json({
        fallback: true,
        error: err.message || 'Gemini API call failed',
      });
    }
  });

  // Syllabus Parser endpoint
  app.post('/api/gemini/parse-syllabus', async (req: Request, res: Response) => {
    const { syllabusText } = req.body;

    if (!syllabusText || typeof syllabusText !== 'string') {
      return res.status(400).json({ error: 'Syllabus text is required.' });
    }

    if (!ai || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({ fallback: true });
    }

    try {
      const prompt = `Extract and structure the following college/university DSA syllabus into clean JSON units/modules.
Syllabus Text:
${syllabusText.slice(0, 4000)}

Return JSON with this exact structure:
{
  "title": "Course Title (e.g. Data Structures & Algorithms)",
  "modules": [
    {
      "id": "m1",
      "title": "Unit / Module Name",
      "description": "Short module summary",
      "topics": [
        {
          "id": "t1",
          "title": "Topic name (e.g. Singly Linked List)",
          "category": "arrays" | "linked-lists" | "stacks-queues" | "trees" | "graphs" | "sorting-searching" | "dp-recursion" | "basics",
          "difficulty": "Easy" | "Medium" | "Hard",
          "estimatedHours": 2,
          "subtopics": ["Node structure", "Insertion at head", "Traversal", "Deletion"]
        }
      ]
    }
  ]
}
Return only valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error('Parse syllabus error:', err);
      res.json({ fallback: true, error: err.message });
    }
  });

  // Code Feedback endpoint
  app.post('/api/gemini/code-review', async (req: Request, res: Response) => {
    const { code, problemTitle, language = 'Java' } = req.body;

    if (!ai || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({ fallback: true });
    }

    try {
      const prompt = `Review this student's ${language} solution for "${problemTitle}".
Code:
\`\`\`${language}
${code}
\`\`\`

Analyze:
1. Correctness & logic soundness
2. Time complexity and Space complexity
3. Edge cases missed (e.g. empty input, single element, negative numbers, overflow)
4. Clean code suggestions
5. Score out of 10.
Keep it constructive, encouraging, and clear.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({ success: true, feedback: response.text || '' });
    } catch (err: any) {
      res.json({ fallback: true, error: err.message });
    }
  });

  // Setup Vite in Dev or Static files in Prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeMentor AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
