import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';
import FormData from 'form-data';  

// Create equivalents of __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadDir = path.join(__dirname, 'downloaded-images');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

async function getAllData() {
    try {
        console.log("Fetching data from API...");
        const response = await fetch("https://kelselyay.onrender.com/api/reports/", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        
        if(!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Successfully fetched ${data.length} records`);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; 
    }
}

async function downloadImage(imageUrl, id) {
    try {
        console.log(`Downloading: ${imageUrl}`);
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
        }
        
        // Extract file extension from URL or Content-Type
        let extension = 'jpg';  // Default extension
        const contentType = response.headers.get('content-type');
        if (contentType) {
            if (contentType.includes('jpeg')) extension = 'jpg';
            else if (contentType.includes('png')) extension = 'png';
            else if (contentType.includes('gif')) extension = 'gif';
            else if (contentType.includes('webp')) extension = 'webp';
        }
        
        const filename = path.join(downloadDir, `${id}.${extension}`);
        const fileStream = fs.createWriteStream(filename);
        
        // Use pipeline to properly handle the streaming
        await pipeline(response.body, fileStream);
        
        console.log(`Successfully downloaded: ${filename}`);
        return filename;
    } catch (error) {
        console.error(`Error downloading ${imageUrl}:`, error);
        throw error;
    }
}


async function uploadToAWS(filePath, caption) {
    try {
        console.log(`Uploading to AWS: ${filePath}`);
        
        // Create form data
        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath));
        formData.append('caption', caption || '');
        
        const response = await fetch('https://kelselyay.onrender.com/api/reports/testImage', {
            method: "POST",
            body: formData,
            headers: formData.getHeaders() // Important for Node.js FormData
        });
        
        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(`API issue with AWS uploading image: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        if(data.imageUrl){
            console.log(`Successfully uploaded to AWS: ${data.imageUrl}`);
            return data.imageUrl;
        } else {
            throw new Error("No image URL in response");
        }
    } catch (error) {
        console.error("AWS upload error", error);
        throw error;
    }
}

async function updatedReport(newUrl, id, reporterName) {
    try {
        const response = await fetch(`https://kelselyay.onrender.com/api/reports/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                reporterName: reporterName,
                imageUrl: newUrl
            })
        })
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update database: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Successfully updated database record for ${id}`);
        return data;

    } catch (error) {
        console.error(`Error updating database for ${id}:`, error);
        throw error;
    }
}

async function process(data) {
    for (const info of data) {
        if (info.imageUrl && info.imageUrl.includes('cloudinary')) {
            try {
                console.log(`Processing image for ${info._id}`);
                const filename = await downloadImage(info.imageUrl, info._id);
                const newImageUrl = await uploadToAWS(filename, '');
                const newData = await updatedReport(newImageUrl, info._id, info.reporterName)
                console.log(`Successfully updated record: ${newData._id}`);
                try {
                    fs.unlinkSync(filename);
                    console.log(`Removed temporary file: ${filename}`);
                } catch (err) {
                    console.error(`Error remqfoving file ${filename}:`, err);
                }
            } catch (error) {
                console.error(`Failed to process ${info._id}:`, error);
                // Continue with the next image even if one fails
            }
        } else {
            console.log(`Skipping ${info._id} - not a Cloudinary image or no image URL`);
        }
    }
    console.log("All images processed!");
}


async function main() {
    try {
        const data = await getAllData();
        
        if (!data || data.length === 0) {
            console.log("No data found to migrate");
            return;
        }
        
        console.log("Data fetched successfully. Ready to process:");
        console.log(`Total records: ${data.length}`);
        const isTestMode = typeof process !== 'undefined' && 
        Array.isArray(process.argv) && 
        process.argv.includes('--test');

        if (isTestMode) {
            console.log("TEST MODE: Processing only first item");
            const testData = data.slice(0, 1);
            await process(testData);
        } else {
            await process(data);
        }
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1); 
    }
}

main();