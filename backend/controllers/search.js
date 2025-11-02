const db = require('../db');
const info_gathering = require('../lib/info-gathering');

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({apiKey: `${process.env.GEMINI_API}`});

const search_services = async (req, res) => {
	
	const ids = await db.get_all_service_ids();
	const services = JSON.stringify(await Promise.all(ids.map(db.get_service)));
	
	// return all if no search text
	if (!req.query.q) {
		res.send(services);
		return;
	}

	const JSONschema = {
		"type": "object",
		"properties": {
			"ids": {
				"type": "array",
				"items": {
					"type": "number",
					"required": [],
				},
				"description": "ids of relevant objects",
			},
		},
		"required": [
			"ids",
		],
	};

	const prompt = `Given some search text and a list of json objects I want you to return the ids of the ones relevant to the search in a list. Please order them by relevancy and follow the schema. Here is the search text: "${req.query.q}". Here are the objects to search: ${services}`;

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: JSONschema,
		},
	});

	res.json(response.text);
}

const search_url = async (req, res) => {
	res.send(`<a href="http://qwidge.tech">Take me away from here!<a>`);
	if (!req.body.url) {
		let e = new Error("No url in body");
		e.status = 400;
		throw e;
	}
	
	await info_gathering.get_services_from_url(req.body.url, 3);
};

module.exports = {
	search_services,
	search_url,
}
