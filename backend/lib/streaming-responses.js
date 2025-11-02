const { GoogleGenAI } =  require("@google/genai");
const crypto = require('crypto')
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

// setup for handling multiple sessions
const sessions = new Map()

/**
 * Create a chat session for a user who wants talk about a specific service
 * @param {string} serviceDesc All the information about the service
 * @returns {string} SessionID to reference this particular chat session
 */
const createChatStreamKnownService = (serviceDesc) => {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
        {
            role: "model",
            parts: [{ text: "Hi, thanks for visiting! What services would you want to know about?" }],
        },
        ],
        // TODO: uncomment when services are actually stored somewhere
        // config: {
        //     systemInstruction: `You are a helpful AI assistant who answers questions on a specfic government \
        //     service. Here is all the information about that service: ${serviceDesc}`,
        // }
    });

    const sessionID = crypto.randomUUID()
    sessions.set(sessionID,chat)

    return sessionID
}

/**
 * Create a chat session for a user who wants to ask generally about all services
 * @param {object[]} serviceTitles array of strings representing the titles of 
 * the services that we have found
 * @returns sessionID for future
 */
const createChatStreamSearch = (services) => {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
        {
            role: "model",
            parts: [{ text: "Hi, thanks for visiting! What services would you want to know about?" }],
        },
        ],
        config: {
            systemInstruction: `You are a helpful AI assistant who answers questions on what government \
            services are available. Here is a list of what services are currently offered:
            ${services}`,
        }
    });

    const sessionID = crypto.randomUUID()
    sessions.set(sessionID,chat)

    return sessionID
}

const chatWithGemini = async (sessionID, message) => {
    const sessionChat = sessions.get(sessionID)
    const streamResponse = await sessionChat.sendMessageStream({
        message,
    });

    return streamResponse
}

module.exports = {
    createChatStreamKnownService, 
    createChatStreamSearch, 
    chatWithGemini,
}