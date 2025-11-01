const { GoogleGenAI } =  require("@google/genai");
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

/**
 * For initializing the services available to a certain location, this controller
 * method takes in a specified location and will return a list of links 
 * @param {*} req 
 * @param {*} res 
 */
const generatePossibleSiteLisa = async (req, res) => {
    const { generatePossibleSiteList } = require('../lib/info-gathering')
    const response = await generatePossibleSiteList('Fairport, New York, 14450')
    res.send(response)
}

module.exports = {
    generatePossibleSiteLisa,
}