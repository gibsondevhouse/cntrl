import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { CONFIG, PERSONA } from '../config/index.js';
import { logger } from '../utils/logger.js';

class MuseService {
    private genAI: GoogleGenerativeAI | null;
    private model: GenerativeModel | null;

    constructor() {
        this.genAI = null;
        this.model = null;
        this.initialize();
    }

    private initialize(): void {
        if (!CONFIG.GEMINI_API_KEY) {
            logger.warn("MuseService: Missing API Key");
            return;
        }
        this.genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
        this.setPersona(PERSONA.tone);
    }

    public setPersona(tone: string): void {
        if (!this.genAI) return;

        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are ${PERSONA.name}, ${PERSONA.role}.
            TONE: ${tone}.
            CONTEXT: Running on CNTRL OS.
            GOAL: Help the user craft narratives. Be concise and literary.`
        });
    }

    public async oracleGenerate(query: string): Promise<string> {
        if (!this.genAI) throw new Error("MISSING_API_KEY");

        // The Oracle uses a distinct model configuration but shares the client
        const oracleModel = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are The Oracle.
            GOAL: Generate creative, distinct lists or descriptions for a fantasy author.
            FORMAT: Return ONLY a Markdown list or concise block. No conversational filler.
            TONE: Mystical, direct, evocative.`
        });

        const result = await oracleModel.generateContent(query);
        return result.response.text();
    }

    public async generateStream(prompt: string, onChunk: (text: string) => void): Promise<void> {
        if (!this.model) {
            throw new Error("MISSING_API_KEY");
        }

        const result = await this.model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            onChunk(chunkText);
        }
    }
}

export default new MuseService();