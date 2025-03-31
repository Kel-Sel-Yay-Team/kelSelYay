'use client';
import Mapbox from "./component/Mapbox";
import ImageUpload from "./component/ImageUpload";

export default function Home() {

  const handleImageUpload = (url) => {
    console.log("Uploaded Image URL:", url);
  };

  return (
    <div>
      <ImageUpload onUploadComplete={handleImageUpload} />
      <Mapbox />
    </div>
  );
}