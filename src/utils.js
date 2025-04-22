const Papa = require('papaparse');
const { XMLParser } = require('fast-xml-parser');

function parseCsv(data) {
    return Papa.parse(data, {
        header: true,
        dynamicTyping: true
    }).data;
};

function parseJson(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Invalid JSON:', error);
        return null;
    }
};

function parseTxt(data) {
    return data.split('\n').map(line => line.trim()).filter(Boolean);
};

function parseXml(data) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
    });
    return parser.parse(data);
};

module.exports = { parseCsv, parseJson, parseTxt, parseXml };