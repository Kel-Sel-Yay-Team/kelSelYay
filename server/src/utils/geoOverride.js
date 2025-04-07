const customLocationOverrides = {
    "sky villa": { lat: 21.985738, lng: 96.116109 }
};


export function checkForCustomLocation(location) {
    const normalized = location.toLowerCase().replace(/\s+/g, ' '); // normalize spaces
    const words = normalized.split(' ');
    const compact = normalized.replace(/\s/g, '');

    for (const keyword in customLocationOverrides) {
        const kwCompact = keyword.replace(/\s/g, '');
        const kwWords = keyword.split(' ');

        // match compact forms (e.g., "skyvilla") or relaxed match (keywords appearing in order)
        const keywordFound =
            compact.includes(kwCompact) ||
            (kwWords.every(kw => words.includes(kw)) &&
             words.indexOf(kwWords[0]) < words.indexOf(kwWords[kwWords.length - 1]));

        if (keywordFound) {
            return customLocationOverrides[keyword];
        }
    }

    return false;
}

