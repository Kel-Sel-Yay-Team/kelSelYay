import { useState } from 'react';

function ImageUpload({ onUploadComplete }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass both the file and preview URL to parent component
      onUploadComplete({ file, previewUrl: objectUrl });
    }
  };

  return (
    <div className="image-upload-container">
      <div className="upload-input-wrapper">
        <input
          type="file"
          onChange={handleImageChange}
          className="file-input"
          accept="image/*"
        />
      </div>
      
      {previewUrl && (
        <div className="preview-container">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="image-preview"
          />
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #eaeaea;
          width: 100%;
          margin-bottom: 10px;
        }

        .upload-input-wrapper {
          margin-bottom: 12px;
        }

        .file-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #d93025;
          border-radius: 4px;
          cursor: pointer;
          background-color: white;
          color: #333;
        }

        .preview-container {
          margin-top: 12px;
          max-width: 100%;
        }

        .image-preview {
          max-width: 100%;
          max-height: 180px;
          border-radius: 4px;
          border: 1px solid #d93025;
          object-fit: contain;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .image-upload-container {
            padding: 10px;
          }
          
          .file-input {
            font-size: 14px;
            padding: 6px;
          }
          
          .image-preview {
            max-height: 150px;
          }
        }
        
        @media (max-width: 480px) {
          .image-upload-container {
            padding: 8px;
          }
          
          .file-input {
            padding: 5px;
          }
          
          .image-preview {
            max-height: 120px;
          }
        }
      `}</style>
    </div>
  );
}

export default ImageUpload;