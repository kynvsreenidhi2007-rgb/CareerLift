import OpenAI from "openai";
import { StandardResumeJSON } from "./templates/standard";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY, // Try both
    dangerouslyAllowBrowser: false,
});

export async function optimizeResume(
    resumeText: string,
    jobDescription: string
): Promise<StandardResumeJSON> {
    const systemPrompt = `
    You are an expert resume writer and career coach specializing in ATS optimization.
    Your task is to rewrite the candidate's resume to match the provided Job Description.

    GUIDELINES:
    1. **Deep Analysis**: Analyze the ENTIRE resume text. Do not hallucinate. Be critical but constructive.
    2. **ATS Keywords**: Identify missing keywords from the JD and naturally weave them into the resume.
    3. **Action Verbs**: Start every bullet point with a strong action verb (e.g., "Architected", "Spearheaded").
    4. **Quantify Results**: Use specific numbers/metrics where possible (or suggest them).
    5. **Originality**: Provide unique, tailored feedback in the analysis section, not generic advice.
    6. **Structure**: Return a JSON object matching the schema.

    SCHEMA (StandardResumeJSON):
    {
      "meta": { "templateId": "default-v1", "version": "1.0.0", "generatedAt": "ISO_STRING" },
      "header": { "name": "...", "contact": { "email": "...", "phone": "...", "linkedin": "...", "website": "..." } },
      "analysis": {
        "score": 0-100,
        "keywords": { "found": ["..."], "missing": ["..."], "score": "High/Medium/Low" },
        "improvements": ["..."],
        "missingSkills": ["..."]
      },
      "sections": [
        { "id": "exp", "title": "Professional Experience", "type": "experience", "content": [ { "institution": "...", "role": "...", "period": "...", "details": ["bullet 1", "bullet 2"] } ] },
        { "id": "proj", "title": "Key Projects", "type": "projects", "content": [ { "name": "...", "tech": "...", "description": "..." } ] },
        { "id": "edu", "title": "Education", "type": "education", "content": [ { "institution": "...", "degree": "...", "period": "..." } ] },
        { "id": "skills", "title": "Technical Skills", "type": "skills", "content": ["skill1", "skill2"] }
      ]
    }
  `;

    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
        console.log("AI Client - API Key Present:", !!apiKey);
        if (apiKey) console.log("AI Client - API Key First 4 chars:", apiKey.substring(0, 4));

        if (!apiKey || apiKey === "dummy" || apiKey.includes("sk-or-...")) {
            console.warn("OPENROUTER_API_KEY is missing or invalid (placeholder).");
            throw new Error("Missing or Invalid OpenRouter API Key. Please add it to .env.local");
        }

        console.log("Calling OpenAI/OpenRouter...");

        const response = await openai.chat.completions.create({
            model: "google/gemini-flash-1.5", // Fast and effective model on OpenRouter
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content received from AI");

        const json = JSON.parse(content) as StandardResumeJSON;
        return json;

    } catch (error) {
        console.error("AI Optimization Failed:", error);
        // Fallback Mock Data for Demo/Dev if API fails
        return {
            meta: { templateId: "fallback", version: "0.0.0", generatedAt: new Date().toISOString() },
            header: { name: "Candidate Name (Fallback)", contact: { email: "email@example.com", phone: "123-456-7890" } },
            sections: [
                { id: "summary", title: "Summary", type: "summary", content: "AI processing failed or API key missing. This is a placeholder." }
            ]
        } as any;
    }
}

export type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

export async function getChatResponse(history: Message[]): Promise<string> {
    const systemPrompt = `
      You are CareerLift Coach, an expert AI career counselor.
      Your goal is to help users improve their resumes, prepare for interviews, and navigate their careers.
      
      TRAITS:
      - Encouraging and positive.
      - Concise and actionable advice.
      - Knowledgeable about ATS optimization and modern hiring trends.
      
      CONTEXT:
      The user is likely a student or job seeker using the CareerLift platform to build/enhance their resume.
    `;

    try {
        if (process.env.OPENROUTER_API_KEY === undefined) {
            return "I'm sorry, I can't connect to my brain right now (Missing API Key). But I'm rooting for you!";
        }

        // Filter out system messages from history to avoid duplication if any
        const safeHistory = history.filter(m => m.role !== 'system');

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...safeHistory
        ];

        const response = await openai.chat.completions.create({
            model: "google/gemini-flash-1.5",
            messages: messages,
        });

        return response.choices[0].message.content || "I'm not sure what to say.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
}
