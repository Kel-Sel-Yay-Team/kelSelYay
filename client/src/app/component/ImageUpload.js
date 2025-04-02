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
    <div style={{ backgroundColor: '#000', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="file"
          onChange={handleImageChange}
          style={{
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />
      </div>
      
      {previewUrl && (
        <div style={{ marginTop: '15px', maxWidth: '100%' }}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '200px', 
              borderRadius: '4px',
              border: '1px solid #555'
            }} 
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;