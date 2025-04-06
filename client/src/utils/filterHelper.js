export async function filter(data) {
    let hashMap = {};

    if (!data || !Array.isArray(data)) {
        console.error('Invalid data provided to filter function:', data);
        return hashMap; 
    }

    data.forEach(people => {
        const lat = people.lat;
        const lng = people.lng;
        const key = `${lat},${lng}`;

        if(key in hashMap) {
            hashMap[key].push(people);
        } else {
            hashMap[key] = [people];
        }
    });
    return hashMap;
}

export async function getMarkers(hashMap) {
    const location = Object.keys(hashMap).map(key => {
        const [lat, lng] = key.split(',')
        return {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        }
    })

    return location;
}