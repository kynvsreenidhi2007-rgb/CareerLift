import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("--- API: Parse Resume Request ---");
    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log(`Processing file: ${file.name} (${file.type})`);
        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        // PDF
        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            try {
                console.log("Dynamically importing pdf-parse...");
                // @ts-ignore
                const pdf = (await import("pdf-parse")).default;
                const data = await pdf(buffer);
                text = data.text;
                console.log(`PDF parsed successfully. Length: ${text.length}`);
            } catch (e) {
                console.error("PDF Parse Error:", e);
                return NextResponse.json({ error: "Failed to parse PDF content." }, { status: 500 });
            }
        }
        // DOCX
        else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.toLowerCase().endsWith(".docx")
        ) {
            try {
                console.log("Dynamically importing mammoth...");
                // @ts-ignore
                const mammoth = await import("mammoth");
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
                console.log("DOCX parsed successfully.");
            } catch (e) {
                console.error("DOCX Parse Error:", e);
                return NextResponse.json({ error: "Failed to parse DOCX content." }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Unsupported file format. Please upload PDF or DOCX." }, { status: 400 });
        }

        return NextResponse.json({ success: true, text });

    } catch (error: any) {
        console.error("API Parse Fatal Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
