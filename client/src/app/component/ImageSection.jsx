"use client"

import ImageUpload from "./ImageUpload";

function ImageSection({imagePreview, isEditing, imageUrl, imageError, handleImageError, name, handleImageUpload}) {
    return (
        <div className="image-section">
            <div className="image-container">
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
            </div>
            {isEditing ? (
                <ImageUpload onUploadComplete={handleImageUpload}></ImageUpload>
            ): <div></div>}

            <style jsx>
                {`.image-section {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }
                
                .image-container {
                    width: 100%;
                    aspect-ratio: 3/4;
                    border-radius: 8px;
                    overflow: hidden;
                    background-color: rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }
                
                .person-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .image-placeholder {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    color: rgba(255, 255, 255, 0.4);
                    text-align: center;
                    font-size: 0.9rem;
                }`}
            </style>
        </div>
    )   
}

export default ImageSection;