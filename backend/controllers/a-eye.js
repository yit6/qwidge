const { 
    generatePossibleSiteList,
    parseLinksFromPossibleSiteList,
 } = require('../lib/info-gathering')

const { GoogleGenAI } =  require("@google/genai");
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

/**
 * For initializing the services available to a certain location, this controller
 * method takes in a specified location and will return a list of links 
 * @param {*} req 
 * @param {*} res 
 */
const generatePossibleSiteLisa = async (req, res) => {
    const response = await generatePossibleSiteList('Fairport, New York, 14450')
    const parsed = await parseLinksFromPossibleSiteList(response)
    res.send(parsed)
}

module.exports = {
    generatePossibleSiteLisa,
}