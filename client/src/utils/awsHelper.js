export async function uploadAwsImage(file, caption) {
    try {
        const formData = new FormData();
        formData.append('image', file);  
        formData.append('caption', caption || '');

        const response = await fetch('https://kelselyay.onrender.com/api/reports/testImage', {
            method: "POST",
            body: formData
        })
        if(!response.ok) {
            throw new Error("API issue with AWS uploading image")
        }

        const data = await response.json();
        if(data.imageUrl){
            return data.imageUrl;
        } else {
            return "https://res.cloudinary.com/dpmhxppeg/image/upload/v1743667345/Missing%20People%20Pictures/iiz12qayrwjtkoczh2rq.png";
        }
    } catch (error) {
        console.error("AWS upload error", error);
        return "https://res.cloudinary.com/dpmhxppeg/image/upload/v1743667345/Missing%20People%20Pictures/iiz12qayrwjtkoczh2rq.png";
    }
}