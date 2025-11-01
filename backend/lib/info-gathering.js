const { GoogleGenAI } =  require("@google/genai");
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

const generatePossibleSiteList = async (location) => {
    const JSONschema = {
        "type": "object",
        "properties": {
            "links": {
            "type": "array",
            "items": {
                "type": "string",
                "required": [],
            },
            // "description": "A list of links to the websites"
            }
        },
        "required": [
            "links"
        ]
    }

    const prompt = `I want to know about all the local government services that my local municipality offers. \
    I live in ${location}. Please return a list of links to the local government websites near ${location}. \
    Don't forget about the library system as well as any other government entity that offers services to the public.`

    const testPrompt = 'Give me a list of the colors of the rainbow'

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: testPrompt,
        config: {
            // tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });
    console.log(response)
    console.log(response.text)
    return response
}

module.exports = {
    generatePossibleSiteList,
}