export async function postNewReports(payload) {
    try {
        const response = await fetch("http://localhost:3002/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Something went wrong");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error posting new reports:", error);
        throw error; // Re-throw the error to handle it further up the chain if needed
    }
}

export async function getReports() {
    try {
        const response = await fetch("https://kelselyay.onrender.com/api/reports", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Something went wrong");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error; // Re-throw the error to handle it further up the chain if needed
    }
}

export async function getMissingPeople() {
    try {
        const response = await fetch("https://kelselyay.onrender.com/api/reports/notfound", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if(!response.ok) {
            throw new Error(`API issue when trying to fetch reports: ${response.status}`);
        }
        
        const data = await response.json();        
        return data;
    } catch (error) {
        return [];
    }
}

export async function existCoor(lat, lng) {
    try {
        const response = await fetch(`https://kelselyay.onrender.com/api/reports/coordexists?lat=${lat}&lng=${lng}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });
    
        if (!response.ok) {
          throw new Error(`API issue when checking coordinates: ${response.status}`);
        }
    
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error checking coordinates:", error);
        return false;
    }
}
