const {
    createChatStreamKnownService,
    createChatStreamSearch,
    chatWithGemini,
} = require('../lib/streaming-responses')

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
const newChatSession = (req, res) => {
    if (req.body.mode === 'general') {
        const sessionID = createChatStreamSearch();
        res.json(sessionID)
    }
    else if (req.body.mode === 'specific') {
        const sessionID = createChatStreamKnownService();
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
        const sessionID = req.body.sessionID;
        const message = req.body.message;

        console.log(`Received message for sessionID: ${sessionID}, message: "${message}"`);

        // Get the stream from chatWithGemini
        const streamResponse = await chatWithGemini(sessionID, message);

        // Log the full streamResponse to confirm it's an async iterator
        console.log("Full streamResponse:", streamResponse);

        if (!streamResponse) {
            throw new Error("No response from the chat session.");
        }

        let result = '';
        const chunkSize = 1; // Adjust chunk size as needed (e.g., 100 characters per chunk)
        const delay = 100; // Delay in milliseconds between chunks (e.g., 500ms)

        // Check if streamResponse is an async iterable and process chunks
        if (streamResponse[Symbol.asyncIterator]) {
            console.log("streamResponse is an async iterable. Processing chunks...");

            res.setHeader('Content-Type', 'text/plain');
            res.flushHeaders(); // Start sending the response headers

            // Use a for-await-of loop to consume the stream
            for await (const chunk of streamResponse) {
                // Log the chunk type and value for debugging
                console.log('Received chunk:', chunk);
                console.log('Chunk type:', typeof chunk);

                // Check if chunk is an object (which is expected)
                if (chunk && chunk.candidates && Array.isArray(chunk.candidates)) {
                    // Extract the content from the candidates
                    const chunkContent = chunk.candidates[0]?.content;

                    if (chunkContent && chunkContent.parts && Array.isArray(chunkContent.parts)) {
                        // Extract the text from parts
                        const chunkText = chunkContent.parts.map(part => part.text).join(' ');
                        console.log('Extracted text from chunk:', chunkText);

                        // Append chunk content to result
                        result += chunkText;

                        // Send a smaller part of the result to the client
                        res.write(chunkText);

                        // Optionally, introduce a delay before sending the next chunk
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        console.warn("No parts found in chunk content:", chunkContent);
                    }
                } else {
                    console.warn("Unexpected chunk format:", chunk);
                    // Handle unexpected chunk structure if necessary
                }
            }

            // End the response once all chunks have been sent
            res.end();
            console.log('Final output (streamed):', result);
        } else {
            console.log("streamResponse is not an async iterable.");
            // Handle the case where the response is not a stream (e.g., a single response object)
            res.json(streamResponse);
        }

    } catch (error) {
        console.error('Error in continueChatSession:', error);
        res.status(500).json({ error: 'Error processing chat: ' + error.message });
    }
};

module.exports = {
    newChatSession,
    continueChatSession,
}