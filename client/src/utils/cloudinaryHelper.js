
export async function cloudinaryImageUpload(imageFile) {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", imageFile);
  
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
      if (!uploadPreset || !cloudName) {
        throw new Error("Missing Cloudinary config");
      }
  
      formDataUpload.append("upload_preset", uploadPreset);
      formDataUpload.append("folder", "Missing People Pictures");
  
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formDataUpload,
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to upload image");
      }
  
      const cloudinaryData = await res.json();
      // Return the secure URL directly without using an undeclared variable
      return cloudinaryData.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error; // Re-throw to handle in the calling code
    }
  }