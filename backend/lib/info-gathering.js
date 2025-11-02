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
						"organization": {
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
    a short title, and then a summary what a resident should know about that service. Also take note of the organization that offers it\
    If there is not any information on the service, leave the description blank. Also collect and return a list of\
    website links that are sure lead to more information about \
    services that are offered, sorted by importantance. Also, please only include links that seem very likely to include more previously unseens services. \
    Here is the webpage: ${pageText}`  

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

// Just go to the internet and find stuff
const convertResearchToJSONschema = async (topic) => {
	const JSONschema = {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
            },
            "description": {
                "type": "string",
            },
            "sources": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "title",
            "description",
            "sources"
        ]
    }

    const prompt = `We are researching what useful services our local government organizations provide. \
    Given a text version of a webpage, please carefully go through and extract meaningful services that are provided \
    to the public. Also extract processes such as requesting permission to build on your property \
    or requesting to rent out a town event space. Return a list of the services you find, giving each service/workflow \
    a short title, and then a summary what a resident should know about that service. Also take note of the organization that offers it\
    If there is not any information on the service, leave the description blank. Also collect and return a list of\
    website links that are sure lead to more information about \
    services that are offered, sorted by importantance. Also, please only include links that seem very likely to include more previously unseens services. \
    Here is the webpage: ${pageText}`  

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
// both parameters of this function should be arrays of objects where
// the objects have a title, service_information, and id_num
const removeDuplicateServices = async (organization) => {
	const JSONschema = {
		"type": "array",
		"description": "List of objects containing information on duplicate services",
		"items": {
			"type": "object",
			"required": [
				"duplicateServiceIDs",
				"mergedServiceTitle",
				"mergedServiceDescription"
			],
			"properties": {
				"duplicateServiceIDs": {
					"type": "array",
					"items": {
						"type":"number"
					}
				},
				"mergedServiceTitle": {
					"type": "string",
				},
				"mergedServiceDescription": {
					"type": "string",
				}
			}
		}
	}

    const services = await db.get_services_light(organization);

    console.log(`removing duplicates for ${organization}`);

    const prompt = `You are a discrening AI assistant. Given a list of government services, please look \
    for entries of the same or very similar service and group them together by their respective IDs into lists. \
    After each list of IDs of similar services, provide a unified title and description for that service. It is \
    very well possible that there are no duplicate services. In that case, just return an empty array.
    Here is the list of services: ${JSON.stringify(services)}`  

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });

    JSON.parse(response.text).forEach(async (d) => {
    	console.log(d);
	const new_id = await db.add_service(d.mergedServiceTitle, d.mergedServiceDescription, organization, []);
    	console.log(`added ${new_id}`);
    	d.duplicateServiceIDs.forEach(async (id) => {
		db.updateRels(id, new_id);
		db.delete_service(id);
		console.log(`removed ${id}`);
	});
    });
}

// Remove duplicate services and unify entries
const removeDuplicateOrgs = async (org_set) => {

    const JSONschema = {
        "type": "array",
        "items": {
            "description": "(potentially empty) Array of objects holding information about duplicate organization names",
            "type": "object",
            "required": [
                "duplicateOrganizations",
                "representativeName"
            ],
            "properties": {
                "duplicateOrganizations": {
                    "type": "array",
                    "items": {
                        "type":"string"
                    },
                    "description":"Array of strings representing organizations with basically the same name"
                },
                "representativeName": {
                    "type": "string",
                    "description":"A name picked from the one of the duplicate organization names"
                }
            }
        }
    }

    const prompt = `You are a discrening AI assistant. Given a list of organization names, please look \
    for entries of the same or extremely similar organization name and group them together into lists. If there are no \
    duplicate entries just return back the input unaltered. For each list of grouped together organizations with basically the \
    same name, choose from the list one name that all the rest of the orgs can be renamed to. There might not be duplicates, in that \
    case just return an empty array. Here is the list of the organizations: ${(await db.get_org_names()).map(name=>'"'+name+'"').join(" ")}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: JSONschema,
        },
    });

    JSON.parse(response.text).forEach(duplicate => {
    	duplicate.duplicateOrganizations.forEach(name => {
		db.merge_org_into(name, duplicate.representativeName);
		if (org_set.has(name)) {
			org_set.delete(name);
			org_set.add(duplicate.representativeName);
		};
	});
    });

    return org_set;
}

const get_services_from_url = async (url, amount) => {

	let queue = [url];
	let visited_set = new Set();
	let org_set = new Set();

	while (queue.length != 0 && amount > 0) {

		url = queue.shift();

		if (visited_set.size > 0 ) {

			if (visited_set.has(url)) {
				continue;
			}

			const prompt = `Does the url "${url}" seem like it would contain different enough information\
			from any of these: ${[...visited_set].join(" ")} to justify a costly processing step? Respond with a single word yes/no answer.`

			const response = await ai.models.generateContent({
				model: "gemini-2.5-flash",
				contents: prompt,
			});

			if (response.text.toLowerCase() == "no") {
				continue;
			}
		}

		visited_set.add(url);
		amount--;

		console.log(`Working on ${url}`);

		const text = await parse_site(url);
		const output = await extractServicesAndLinks(text);

		queue.push(...(output.linksToExplore.map(o => o.link)));

		output.services.forEach((service) => {
			db.add_service(service.title, service.service_information, service.organization, [url]);
			org_set.add(service.organization);
		});
	}

	console.log(org_set);

	org_set = await removeDuplicateOrgs(org_set);
	org_set.forEach(removeDuplicateServices);
}

module.exports = {
    generatePossibleSiteList,
    parseLinksFromPossibleSiteList,
    extractServicesAndLinks,
    get_services_from_url,
}
