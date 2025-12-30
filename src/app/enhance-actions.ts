"use server";

import { optimizeResume } from "@/lib/ai";
import { StandardResumeJSON } from "@/lib/templates/standard";

export type EnhanceState = {
    success: boolean;
    data?: StandardResumeJSON;
    error?: string;
    progress?: string;
};

export async function enhanceResumeAction(prevState: any, formData: FormData): Promise<EnhanceState> {
    console.log("--- enhanceResumeAction started ---");
    try {
        // Now expects 'resumeText' instead of the file itself for parsing
        // (Or we can overwrite the parsing logic here if we wanted, but let's assume the client sends text)
        // Wait, FormData limits string size? No, usually fine for 1-2 pages of text.

        const resumeText = formData.get("resumeText") as string;
        const jobDescription = formData.get("jobDescription") as string;

        console.log(`Received text length: ${resumeText?.length}`);
        console.log(`Received JD length: ${jobDescription?.length}`);

        if (!resumeText || !jobDescription) {
            console.error("Missing text or JD");
            return { success: false, error: "Missing resume text or job description" };
        }

        if (resumeText.length < 50) {
            console.error("Resume text too short");
            return { success: false, error: "Resume text is too short or unreadable." };
        }

        // 2. Optimistic/Real AI Call
        // In a real production app, we might use a queue (BullMQ) for long-running tasks.
        // For this MVP, we'll await the OpenAI/Gemini call (can take 10-20s).
        // Vercel Server Actions have a timeout, but usually enough for a quick LLM call.

        console.log("Starting AI Optimization...");
        const optimizedData = await optimizeResume(resumeText, jobDescription);
        console.log("AI Optimization complete. Success:", !!optimizedData);

        return { success: true, data: optimizedData };

    } catch (error: any) {
        console.error("Enhancement Action Fatal Error:", error);
        return { success: false, error: error.message || "Something went wrong during AI optimization." };
    }
}
