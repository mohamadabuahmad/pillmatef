"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicationSuggestions = exports.checkDrugInteraction = exports.checkMedicationAllergy = exports.chatWithMedicationAI = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const openai_1 = require("openai");
// Initialize Firebase Admin
admin.initializeApp();
// Initialize OpenAI
const openai = new openai_1.default({
    apiKey: ((_a = functions.config().openai) === null || _a === void 0 ? void 0 : _a.key) || process.env.OPENAI_API_KEY || "",
});
exports.chatWithMedicationAI = functions
    .region("us-central1")
    .https
    .onCall(async (data, context) => {
    var _a, _b;
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { messages, userMedications = [] } = data;
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "Messages array is required");
    }
    // Check API key
    if (!openai.apiKey) {
        throw new functions.https.HttpsError("failed-precondition", "OpenAI API key not configured");
    }
    try {
        // Build system prompt
        const systemPrompt = `You are a helpful medication assistant for PillMate app. 
Help users with medication questions, drug interactions, dosage, and scheduling.
${userMedications.length > 0 ? `User's medications: ${userMedications.join(", ")}` : ""}
Always prioritize safety and recommend consulting a doctor for serious concerns.`;
        // Call OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            max_tokens: 500,
            temperature: 0.7,
        });
        const aiResponse = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) ||
            "Sorry, I couldn't generate a response.";
        return {
            success: true,
            response: aiResponse,
        };
    }
    catch (error) {
        console.error("Chat error:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to get AI response");
    }
});
exports.checkMedicationAllergy = functions
    .region("us-central1")
    .https
    .onCall(async (data, context) => {
    var _a, _b;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { medicationName, userAllergies } = data;
    if (!medicationName || !userAllergies || userAllergies.length === 0) {
        return {
            hasAllergy: false,
            severity: "none",
            message: "",
            shouldBlock: false,
        };
    }
    if (!openai.apiKey) {
        throw new functions.https.HttpsError("failed-precondition", "OpenAI API key not configured");
    }
    try {
        const prompt = `Check if medication "${medicationName}" conflicts with allergies: ${userAllergies.join(", ")}.

Return ONLY JSON:
{
  "hasAllergy": true/false,
  "severity": "high"/"medium"/"low"/"none",
  "message": "explanation",
  "shouldBlock": true/false
}`;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Return only valid JSON." },
                { role: "user", content: prompt },
            ],
            max_tokens: 200,
            temperature: 0.2,
        });
        const content = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) ||
            '{"hasAllergy":false,"severity":"none","message":"","shouldBlock":false}';
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const result = JSON.parse(cleaned);
        return {
            hasAllergy: result.hasAllergy || false,
            severity: result.severity || "none",
            message: result.message || "",
            shouldBlock: result.shouldBlock || false,
        };
    }
    catch (error) {
        console.error("Allergy check error:", error);
        return {
            hasAllergy: false,
            severity: "none",
            message: "Unable to verify. Please consult your doctor.",
            shouldBlock: false,
        };
    }
});
exports.checkDrugInteraction = functions
    .region("us-central1")
    .https
    .onCall(async (data, context) => {
    var _a, _b;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { medication1, medication2, medication1Time, medication2Time } = data;
    if (!medication1 || !medication2) {
        throw new functions.https.HttpsError("invalid-argument", "Both medications are required");
    }
    if (!openai.apiKey) {
        throw new functions.https.HttpsError("failed-precondition", "OpenAI API key not configured");
    }
    try {
        const timeInfo = medication1Time && medication2Time
            ? ` Times: ${medication1} at ${medication1Time}, ${medication2} at ${medication2Time}.`
            : "";
        const prompt = `Check drug interaction between "${medication1}" and "${medication2}".${timeInfo}

Return ONLY JSON:
{
  "canTakeTogether": true/false,
  "interactionLevel": "severe"/"moderate"/"mild"/"none",
  "timeGapRequired": number (hours, 0 if safe together),
  "message": "explanation",
  "recommendation": "take_together"/"space_hours"/"avoid"
}`;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Return only valid JSON." },
                { role: "user", content: prompt },
            ],
            max_tokens: 250,
            temperature: 0.2,
        });
        const content = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) ||
            '{"canTakeTogether":true,"interactionLevel":"none","timeGapRequired":0,"message":"","recommendation":"take_together"}';
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const result = JSON.parse(cleaned);
        return {
            canTakeTogether: result.canTakeTogether !== false,
            interactionLevel: result.interactionLevel || "none",
            timeGapRequired: result.timeGapRequired || 0,
            message: result.message || "",
            recommendation: result.recommendation || "take_together",
        };
    }
    catch (error) {
        console.error("Interaction check error:", error);
        return {
            canTakeTogether: true,
            interactionLevel: "none",
            timeGapRequired: 0,
            message: "Unable to verify. Please consult your doctor.",
            recommendation: "take_together",
        };
    }
});
exports.getMedicationSuggestions = functions
    .region("us-central1")
    .https
    .onCall(async (data, context) => {
    var _a, _b;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { query, limit = 5 } = data;
    if (!query || query.trim().length < 2) {
        return { suggestions: [] };
    }
    if (!openai.apiKey) {
        throw new functions.https.HttpsError("failed-precondition", "OpenAI API key not configured");
    }
    try {
        const prompt = `Given "${query.trim()}", suggest ${limit} common medication names (brand or generic).

Return ONLY a JSON array: ["Medication1", "Medication2", ...]`;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Return only valid JSON array." },
                { role: "user", content: prompt },
            ],
            max_tokens: 150,
            temperature: 0.3,
        });
        const content = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "[]";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const suggestions = JSON.parse(cleaned);
        return {
            suggestions: Array.isArray(suggestions) ? suggestions.slice(0, limit) : [],
        };
    }
    catch (error) {
        console.error("Suggestions error:", error);
        return { suggestions: [] };
    }
});
//# sourceMappingURL=index.js.map