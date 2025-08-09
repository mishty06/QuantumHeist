
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'mock_key' });
const model = "gemini-2.5-flash";

const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const simulateShor = async (modulus: number): Promise<{ factors: number[] } | null> => {
    if (!process.env.API_KEY) {
        await mockDelay(1500);
        // Find factors for mock
        for(let i = 2; i < modulus; i++) {
            if (modulus % i === 0) {
                return { factors: [i, modulus / i] };
            }
        }
        return { factors: [] };
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `You are a quantum computer simulator. Emulate Shor's algorithm to find the prime factors of the number ${modulus}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        factors: {
                            type: Type.ARRAY,
                            items: { type: Type.INTEGER }
                        }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error simulating Shor's algorithm:", error);
        return null;
    }
};

export const simulateQRNG = async (count: number, max: number): Promise<{ numbers: number[] } | null> => {
    if (!process.env.API_KEY) {
        await mockDelay(1000);
        return { numbers: Array.from({ length: count }, () => Math.floor(Math.random() * (max + 1))) };
    }
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `You are a quantum random number generator (QRNG) simulator. Generate a sequence of ${count} random integers between 0 and ${max} (inclusive).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        numbers: {
                            type: Type.ARRAY,
                            items: { type: Type.INTEGER }
                        }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error simulating QRNG:", error);
        return null;
    }
};

export const getEducationalText = async (topic: string): Promise<string> => {
     if (!process.env.API_KEY) {
        await mockDelay(500);
        if (topic === 'QRNG') return "Mock: QRNGs use quantum mechanics to produce truly random numbers, essential for strong cryptography. Unlike classical generators, their output is impossible to predict, making them a cornerstone of secure communications.";
        if (topic === 'Shor') return "Mock: Shor's algorithm, run on a powerful quantum computer, can quickly find the prime factors of large numbers. This ability breaks many current encryption standards like RSA, which rely on the difficulty of this exact problem.";
        return "Mock: Learn more about quantum computing online!";
    }
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `You are a cybersecurity educator. Explain the concept of "${topic}" in simple, engaging terms for a beginner who just completed a game level about it. Describe its relevance to cybersecurity. Keep the explanation under 100 words and easy to understand.`,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting educational text:", error);
        return "Could not retrieve explanation. Quantum interference, perhaps?";
    }
};
