"use client"

import ImageUpload from "./ImageUpload";

function ImageSection({ imagePreview, isEditing, imageUrl, imageError, handleImageError, name, handleImageUpload }) {
  return (
    <div className="image-section">
      {(imagePreview && isEditing) ? (
        <img 
          src={imagePreview} 
          alt={`${name || 'Missing Person'} (Preview)`} 
          className="person-image"
        />
      ) : (imageUrl && !imageError) ? (
        <img 
          src={imageUrl} 
          alt={`${name || 'Missing Person'}`} 
          className="person-image"
          onError={handleImageError}
        />
      ) : (
        <div className="image-placeholder">
          No Image Available
        </div>
      )}

      {isEditing && (
        <ImageUpload onUploadComplete={handleImageUpload} isEditing={isEditing} />
      )}

      <style jsx>{`
        .image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .person-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          margin-bottom: 0.5rem;
        }

        .image-placeholder {
          width: 100%;
          padding: 2rem;
          text-align: center;
          color: rgba(0, 0, 0, 0.5);
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  )
}

export default ImageSection;
