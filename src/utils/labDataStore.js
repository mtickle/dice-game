// labDataStore.js

const labResults = [];

export function logLabResult(result) {
    labResults.push(result);
}

export function getLabResults() {
    return labResults;
}

export function clearLabResults() {
    labResults.length = 0;
}
