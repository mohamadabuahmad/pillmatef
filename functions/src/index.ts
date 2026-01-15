import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";

admin.initializeApp();

// Initialize OpenAI (API key stored in Firebase Functions config)
const openai = new OpenAI({
  apiKey: functions.config().openai?.key || process.env.OPENAI_API_KEY || "",
});

// System prompt for medication assistant
const MEDICATION_SYSTEM_PROMPT = `You are a professional medication assistant and healthcare advisor for the PillMate app. Your role is to help users with medication-related questions, drug interactions, dosage information, side effects, and medication schedules.

IMPORTANT GUIDELINES:
1. Always prioritize safety - if a question involves serious medical concerns, advise users to consult their doctor
2. Provide accurate, evidence-based information about medications
3. Help users understand drug interactions and potential side effects
4. Assist with medication scheduling and reminders
5. Explain medication instructions clearly
6. Be empathetic and supportive
7. If you don't know something, admit it and suggest consulting a healthcare professional
8. Never provide medical diagnoses - only general information
9. Always remind users that you are an AI assistant and not a replacement for professional medical advice

Your responses should be:
- Clear and easy to understand
- Concise but comprehensive
- Professional yet friendly
- Safety-focused
- Evidence-based when possible

Focus on medication management, adherence, interactions, and general medication education.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  userMedications?: string[];
}

// Firebase Cloud Function for chat
export const chatWithMedicationAI = functions.https.onCall(async (data: ChatRequest, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use chat"
    );
  }

  const { messages, userMedications } = data;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Messages array is required"
    );
  }

  // Check if OpenAI API key is configured
  if (!openai.apiKey) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "OpenAI API key is not configured. Please set it in Firebase Functions config."
    );
  }

  try {
    // Build system message with user's medications context
    const systemMessage: ChatMessage = {
      role: "system",
      content: userMedications && userMedications.length > 0
        ? `${MEDICATION_SYSTEM_PROMPT}\n\nUser's current medications: ${userMedications.join(", ")}. Consider these when answering questions about interactions or scheduling.`
        : MEDICATION_SYSTEM_PROMPT,
    };

    // Prepare messages for OpenAI API
    const apiMessages = [
      systemMessage,
      ...messages.filter(msg => msg.role !== "system"),
    ].map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: apiMessages as any,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content || 
      "Sorry, I could not generate a response.";

    // Log the interaction (optional - saves chat history)
    try {
      await admin.firestore()
        .collection("users")
        .doc(context.auth.uid)
        .collection("chatHistory")
        .add({
          messages: messages,
          response: aiResponse,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error("Error logging chat history:", logError);
    }

    return {
      success: true,
      response: aiResponse,
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      throw new functions.https.HttpsError(
        "internal",
        "OpenAI API key is invalid"
      );
    }
    
    if (error.status === 429) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Rate limit exceeded. Please try again later."
      );
    }

    throw new functions.https.HttpsError(
      "internal",
      error.message || "Failed to get AI response"
    );
  }
});
