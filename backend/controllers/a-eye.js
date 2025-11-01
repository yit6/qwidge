const { GoogleGenAI } =  require("@google/genai");
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

const generatePossibleSiteList = async (req, res) => {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain contrastive learning for multimodal LLMs",
    });
    res.send(response.text)
}

module.exports = {
    generatePossibleSiteList,
}