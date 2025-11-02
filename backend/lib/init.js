const { 
    generatePossibleSiteList,
    parseLinksFromPossibleSiteList,
 } = require('../lib/info-gathering')


const getLinksOfInterestArray = async () => {
    const response = await generatePossibleSiteList('Rochester, New York, 14450')
    const parsed = await parseLinksFromPossibleSiteList(response)
    return parsed
}

module.exports = {
    getLinksOfInterestArray,
}