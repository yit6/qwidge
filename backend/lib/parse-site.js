const axios = require('axios').default;
const { compile } = require('html-to-text');
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

const options = {
	wordwrap: false,
};

const compiledConvert = compile(options);

const parse_site = async (url) => {
	if (url.endsWith(".pdf")) {
		const pdf = await pdfjsLib.getDocument(url).promise;

		let all_text = []

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);

			const text_tokens = await page.getTextContent();

			const text = text_tokens.items.map(token => token.str).join(" ");
			all_text.push(text);
		}
		
		return all_text.join(" ");
	}

	if (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".png")) {
		return "image todo";
	}

	const site = await axios.get(url);		

	return compiledConvert(site.data);
};

module.exports = {
	parse_site,
}
