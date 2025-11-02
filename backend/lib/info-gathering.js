const { parse_site } = require("../lib/parse-site");
const db = require("../db");
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
					"type": "object",
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
				},
				"description": "A list of all the services extracted from the page",
			},
			"linksToExplore": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"link": {
							"type": "string",
						},
					},
					"required": [
						"link",
					],
				},
				"description": "A list of links that will lead to more information about services that the government offers"
			},
		},
		"required": [
			"services",
			"linksToExplore"
		]
	}

    const prompt = `We are researching what useful services our local government organizations provide. \
    Given a text version of a webpage, please carefully go through and extract meaningful services that are provided \
    to the public. Also extract processes such as requesting permission to build on your property \
    or requesting to rent out a town event space. Return a list of the services you find, giving each service/workflow \
    a short title and then a summary what a resident should know about that service. If there is not any information on the service, \
    leave the description blank. Also collect and return a list of website links that are sure lead to more information about \
    services that are offered. Here is the webpage: ${pageText}`  

    console.log("asking away!");

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });

    return JSON.parse(response.text);
}

// Remove duplicate services and unify entries
const removeDuplicates = async (serviceTitles) => {
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

    const prompt = `Given a list of government services, please look \
    for entries of the same service and unify them together into one. Here is a list \
    of the services: ${serviceTitles}`  

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });

    console.log(response.text);

    const parsedJSON = JSON.parse(response.text)
    return parsedJSON
}

const get_services_from_url = async (url, amount) => {
	console.log(url, amount);
	
	let queue = [url];

	while (queue.length != 0 && amount > 0) {

		console.log(queue);

		amount--;
		url = queue.shift();

		console.log(`Working on ${url}`);

		const text = await parse_site(url);

		const output = await extractServicesAndLinks(text);

		console.log(output);
		console.log(output.linksToExplore);

		queue.push(...(output.linksToExplore.map(o => o.link)));

		output.services.forEach((service) => {
			console.log(service);
	
			db.add_service(service.title, service.service_information, [url]);
		});
	}
}

module.exports = {
    generatePossibleSiteList,
    parseLinksFromPossibleSiteList,
    extractServicesAndLinks,
    removeDuplicates,
    get_services_from_url,
}
