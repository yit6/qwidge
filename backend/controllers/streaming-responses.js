const {
    createChatStreamKnownService,
    createChatStreamSearch,
    chatWithGemini,
} = require('../lib/streaming-responses')
const fs = require("fs");

/**
 * To begin a chat session with Gemini, you need to initialize a
 * session and get a session ID. This endpoint will make a session
 * and return a session ID. You will need to specify whether the
 * session is for chatting about a specific service or for chatting
 * generally about all services.
 * 
 * For starting a general chat, provide in the req.body.mode 'general'
 * For starting a specific chat, provide in req.body.mode 'specific'
 * and provide in req.body.serviceID the ID as a number of which
 * service you are specifically talking about (currently not working)
 */
const newChatSession = async (req, res) => {
    if (req.body.mode === 'general') {
        const sessionID = await createChatStreamSearch();
        console.log(sessionID)
        res.json(sessionID)
    }
    else {
        const err = new Error('Invalid request, please specify either general or specific for mode parameter')
        err.status = 400
    }
}

/**
 * Method to send a message to a chatroom specified by
 * its sessionID. req.body should look like:
 * {
 *    sessionID: the session ID,
 *    message: whatever you want to send to gemini
 * }
 */
const continueChatSession = async (req, res) => {
try {
    const { sessionID, message } = req.body;
    const responseStream = await chatWithGemini(sessionID, message);

    // Set up streaming headers so the client knows to handle streamed text
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.(); // flush headers immediately if using compression

    for await (const chunk of responseStream) {
      // Each chunk is typically a text delta from the model
      res.write(chunk.text);
    }

    // When finished, close the stream
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error streaming chat");
  }
}

module.exports = {
    newChatSession,
    continueChatSession,
}