"use client";

import { useState } from "react";

export default function TestGeocodePage() {
    const [address, setAddress] = useState("Yangon");
    const [result, setResult] = useState(null);

    const handleGeocode = async () => {
        try {
            const res = await fetch(`http://localhost:3002/api/reports/geocode?address=${encodeURIComponent(address)}`);
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Error fetching geocode:", error);
            setResult({ error: "Request failed" });
        }
    };    

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Test Geocode</h1>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
                />
                <button onClick={handleGeocode} style={{ padding: "0.5rem 1rem" }}>
                    Geocode
                </button>
            </div>

            <pre style={{ background: "#eee", padding: "1rem" }}>
                {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    );
}
