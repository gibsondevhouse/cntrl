import type { Socket } from 'socket.io';
import MuseService from '../services/MuseService.js';
import NovelRepository from '../repositories/NovelRepository.js';
import { DRIVE_ROOT } from '../config/index.js';
import { CreateNovelSchema } from '../schemas/novel.schema.js';

interface CommandData {
    text: string;
}

export const handleConnection = (socket: Socket) => {
    console.log("CNTRL Terminal Connected:", socket.id);

    socket.emit("message", {
        sender: "system",
        text: `CNTRL CORE ONLINE. Drive mount: ${DRIVE_ROOT}`,
    });

    socket.on("list_novels", async () => {
        try {
            const novels = await NovelRepository.getNovels();
            socket.emit("novels_list", { novels });
        } catch (error) {
            socket.emit("message", { sender: "system", text: "Error listing novels." });
        }
    });

    socket.on("open_novel", async (data: { name: string }) => {
        try {
            NovelRepository.setActiveNovel(data.name);
            const context = await NovelRepository.getActiveContext();
            socket.emit("message", { sender: "system", text: `Context switched to: ${context.title}` });
        } catch (error) {
            socket.emit("message", { sender: "system", text: `Error: Novel "${data.name}" not found.` });
        }
    });

    socket.on("update_persona", (data: { tone: string }) => {
        MuseService.setPersona(data.tone);
        socket.emit("message", { sender: "system", text: `Persona updated to: ${data.tone}` });
    });

    socket.on("save_chat", async (data: { messages: any[] }) => {
        try {
            const active = NovelRepository.getActiveNovelName();
            if (!active) throw new Error("No active novel context.");
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${active}/00_Meta/Logs/Chat-${timestamp}.md`;
            
            const content = data.messages
                .map(m => `**${m.sender}**: ${m.text}`)
                .join('\n\n');
                
            await NovelRepository.writeFile(fileName, `# Chat Log - ${new Date().toLocaleString()}\n\n${content}`);
            socket.emit("message", { sender: "system", text: `Chat saved to ${fileName}` });
        } catch (error) {
            socket.emit("message", { sender: "system", text: `Save Error: ${(error as Error).message}` });
        }
    });

    // --- FANTASY MODULES ---

    socket.on("lore_add", async (data: { key: string, content: string }) => {
        try {
            await NovelRepository.writeLore(data.key, data.content);
            socket.emit("message", { sender: "system", text: `[CODEX] Written: ${data.key}` });
        } catch (e) {
            socket.emit("message", { sender: "system", text: `Codex Error: ${(e as Error).message}` });
        }
    });

    socket.on("lore_get", async (data: { key: string }) => {
        try {
            const content = await NovelRepository.readLore(data.key);
            socket.emit("message", { sender: "system", text: `[CODEX] ${data.key}:\n\n${content}` });
        } catch (e) {
            socket.emit("message", { sender: "system", text: `Codex Error: Entry '${data.key}' not found.` });
        }
    });

    socket.on("lore_list", async () => {
        try {
            const list = await NovelRepository.listLore();
            const text = list.length ? list.map(k => `▫ ${k}`).join('\n') : "The Codex is empty.";
            socket.emit("message", { sender: "system", text: `[CODEX] Index:\n${text}` });
        } catch (e) {
            socket.emit("message", { sender: "system", text: `Codex Error: ${(e as Error).message}` });
        }
    });

    socket.on("oracle_roll", async (data: { query: string }) => {
        try {
            socket.emit("agent_state", { state: "THINKING" });
            const result = await MuseService.oracleGenerate(data.query);
            socket.emit("message", { sender: "system", text: `[ORACLE] Result:\n${result}` });
            socket.emit("agent_state", { state: "IDLE" });
        } catch (e) {
            socket.emit("message", { sender: "system", text: `Oracle Silence: ${(e as Error).message}` });
            socket.emit("agent_state", { state: "IDLE" });
        }
    });

    socket.on("get_stats", async () => {
        try {
            const stats = await NovelRepository.getStats();
            socket.emit("message", { sender: "system", text: `[SCRIBE] Progress Report:\n\n▪ Words: ${stats.wordCount}\n▪ Chapters: ${stats.chapterCount}` });
        } catch (e) {
            socket.emit("message", { sender: "system", text: `Scribe Error: ${(e as Error).message}` });
        }
    });

    socket.on("command", async (data: CommandData) => {
        const { text } = data;
        
        // 1. Thinking
        socket.emit("agent_state", { state: "THINKING" });

        // 2. Context Retrieval
        let contextStr = "No active novel context.";
        const context = await NovelRepository.getActiveContext();
        if (context.found) {
            contextStr = `Current Project: ${context.title}\nPremise: ${context.summary}`;
        }

        // 3. Inference
        try {
            const prompt = `[CONTEXT]\n${contextStr}\n\n[USER INPUT]\n${text}`;
            
            socket.emit("agent_state", { state: "WRITING" });
            
            let fullResponse = "";
            await MuseService.generateStream(prompt, (chunk: string) => {
                fullResponse += chunk;
                socket.emit("agent_token", { token: chunk });
            });

            socket.emit("agent_state", { state: "IDLE" });
            socket.emit("message", { sender: "AGENT", text: fullResponse, final: true });

        } catch (error) {
            console.error("Agent Error:", error);
            let errorMsg = "The Muse is silent.";
            if ((error as Error).message === "MISSING_API_KEY") {
                errorMsg = "SYSTEM ALERT: API Key missing.";
            }
            socket.emit("agent_state", { state: "IDLE" });
            socket.emit("message", { sender: "AGENT", text: errorMsg, final: true });
        }
    });
};
