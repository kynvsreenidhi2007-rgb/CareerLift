import { ResumeData } from "@/types/resume";

export interface StandardResumeJSON {
    meta: {
        templateId: string;
        version: string;
        generatedAt: string;
    };
    header: {
        name: string;
        contact: {
            email: string;
            phone: string;
            location?: string;
            linkedin?: string;
            website?: string;
        };
    };
    analysis?: {
        score: number;
        keywords: {
            found: string[];
            missing: string[];
            score: "High" | "Medium" | "Low";
        };
        improvements: string[];
        missingSkills: string[];
    };
    sections: {
        id: string;
        title: string;
        type: "summary" | "education" | "experience" | "projects" | "skills";
        content: any; // Flexible content based on type
    }[];
}

export function bindToTemplate(data: ResumeData): StandardResumeJSON {
    return {
        meta: {
            templateId: "default-v1",
            version: "1.0.0",
            generatedAt: new Date().toISOString(),
        },
        analysis: {
            score: 0,
            keywords: { found: [], missing: [], score: "Low" },
            improvements: [],
            missingSkills: []
        },
        header: {
            name: data.personalInfo.fullName,
            contact: {
                email: data.personalInfo.email,
                phone: data.personalInfo.phone,
                // Assuming 'location' might be added to personalInfo in standard types later, 
                // but for now we map what we have or accept extended data if passed (though type is strict).
                // If the form has a separate location state, it needs to be passed or merged. 
                // For this pure mapper, we'll only map what's in ResumeData.
                linkedin: data.personalInfo.linkedin || undefined,
                website: data.personalInfo.website || undefined,
            },
        },
        sections: [
            // 2. Professional Summary
            {
                id: "summary",
                title: "Professional Summary",
                type: "summary",
                content: "Experienced professional with a proven track record. (AI Generated Placeholder)",
            },
            // 3. Skills
            {
                id: "skills",
                title: "Technical Skills",
                type: "skills",
                content: data.skills.split(",").map(s => s.trim()).filter(Boolean),
            },
            // 4. Experience
            {
                id: "exp",
                title: "Professional Experience",
                type: "experience",
                content: data.experience.map((exp) => ({
                    institution: exp.company,
                    role: exp.position,
                    period: `${exp.startDate} - ${exp.endDate || "Present"}`,
                    details: exp.description ? [exp.description] : [],
                })),
            },
            // 5. Projects
            {
                id: "proj",
                title: "Key Projects",
                type: "projects",
                content: data.projects.map((proj) => ({
                    name: proj.name,
                    tech: proj.technologies,
                    description: proj.description,
                })),
            },
            // 6. Education
            {
                id: "edu",
                title: "Education",
                type: "education",
                content: data.education.map((edu) => ({
                    institution: edu.school,
                    degree: edu.degree,
                    period: `${edu.startDate} - ${edu.endDate || "Present"}`,
                })),
            },
        ],
    };
}
