export async function giveMockFeed() {
    const arrayOfFeeds = ['GOOD, BUT NEED TO IMPROVE IN GRAMMAR', 'NEED TO IMPROVE IN WRITING SKILLS'];

    const idx = Math.floor(Math.random()*arrayOfFeeds.length);
    return arrayOfFeeds[idx];
}


export async function AICorrectionService(questionDet, answer) {
    const {questionText, maxMarks, markingScheme} = questionDet;

    //AI Service
    const marks = Math.floor(Math.random() * maxMarks);
    const feeds = ['SPELLING MISTAKE', 'GOOD', 'CONTEXT SHOULD MATCH'];
    const idx = Math.floor(Math.random()*feeds.length);
    return {marksObtained:marks, feedBackGivenByAI:feeds[idx]};
}