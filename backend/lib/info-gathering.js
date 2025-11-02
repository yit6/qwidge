const { GoogleGenAI } =  require("@google/genai");
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

// Come up with what local government sites are relevant in a report-like style
const generatePossibleSiteList = async (location) => {
    const prompt = `I want to know about all the local government services that my local municipality offers. \
    I live in ${location}. Please return a list of links to the local government websites near ${location}. \
    Don't forget about the library system as well as any other government entity that offers services to the public.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    return response.text
}

// After we get the report of what municipalities there are and what
// their website links are, go through and extract the links.
const parseLinksFromPossibleSiteList = async (text) => {
    const JSONschema = {
        "type": "object",
        "properties": {
            "links": {
            "type": "array",
            "items": {
                "type": "string",
                "required": [],
            },
            "description": "A list of links to the websites"
            }
        },
        "required": [
            "links"
        ]
    }

    const prompt = `Given a research report, I want you to pick out any \
    website links in the report and put them into a list. Just return in the specified schema a list \
    of links. Here is the report: ${text}`


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });
    
    const linksArray = JSON.parse(response.text).links
    return linksArray
}

// Go through a page of text and extract titles and descriptions of services offered
const extractServicesAndLinks = async (pageText) => {
    const JSONschema = {
        "type": "object",
        "properties": {
            "services": {
            "type": "array",
                "items": {
                    "properties": {
                    "service_information": {
                        "type": "string",
                    },
                    "title": {
                        "type": "string",
                    },
                    },
                    "required": [
                    "title",
                    "service_information"
                    ],
                }
            },
            "description": "A list of all the services extracted from the page",
            "linksToExplore": {
            "type": "array",
                "items": {
                    "properties": {
                    "link": {
                        "type": "string",
                    },
                    },
                    "required": [
                    "link",
                    ],
                }
            },
            "description": "A list links that will lead to more information about services"
        },
        "required": [
            "services",
            "linksToExplore"
        ]
    }

    const prompt = `We are researching what services our local government organizations provide. \
    Given a text version of a webpage, please carefully go through and extract any services that are provided \
    to the public. Also extract any processes such as requesting permission to build on your property \
    or requesting to rent out a town event space. Return a list of the services you find, giving each service/workflow \
    a short title and then all the information on the page about that service. If there is not any information on the service, \
    leave the description blank. Also collect and return a list of website links that might lead to more information about \
    services that are offered. Here is the webpage: ${pageText}`  

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });

    const parsedJSON = JSON.parse(response.text)
    return parsedJSON
}

// Remove duplicate services and unify entries
const finalizeServiceArray = async (pageText) => {
    const JSONschema = {
        "type": "object",
        "properties": {
            "services": {
            "type": "array",
                "items": {
                    "properties": {
                    "title": {
                        "type": "string",
                    },
                    "service_information": {
                        "type": "string",
                    }
                    },
                    "required": [
                    "title",
                    "service_information"
                    ],
                }
            },
            "description": "A list of all the services extracted from the page"
        },
        "required": [
            "services"
        ]
    }

    const prompt = `Given a list of government services and descriptions of the services, please look \
    for entries of the same service and unify them together into one.`  

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });

    const parsedJSON = JSON.parse(response.text)
    return parsedJSON
}

module.exports = {
    generatePossibleSiteList,
    parseLinksFromPossibleSiteList,
    extractServicesAndLinks,
    finalizeServiceArray,
}