'use client';
import { useState } from 'react';

function ImageUpload({ onUploadComplete }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // your preset name

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    const imageUrl = data.secure_url;

    console.log('Uploaded:', imageUrl);
    onUploadComplete(imageUrl); // what we want to do with the imageURL - send this to your backend 
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={uploadToCloudinary}>Upload</button>
    </div>
  );
}

export default ImageUpload;
