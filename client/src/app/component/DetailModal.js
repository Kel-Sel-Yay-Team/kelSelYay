"use client"

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ImageUpload from "./ImageUpload";

function DetailModal({ detail, onClose, onUpdateSuccess, onDeleteSuccess }) {    
    const [reporterName, setReporterName] = useState(detail.reporterName);
    const [name, setName] = useState(detail.missingPersonName);
    const [phoneNumber, setPhoneNumber] = useState(detail.phoneNumber);
    const [description, setDescription] = useState(detail.missingPersonDescription);
    const [relationship, setRelationship] = useState(detail.relationshipToReporter);
    const [location, setLocation] = useState(detail.locationOfMissingPerson);
    const [time, setTime] = useState(detail.timeSinceMissing);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [isSaving, setIsSaving] = useState(false)
    const [showNameValidation, setShowNameValidation] = useState(false);
    const [inputReporterName, setInputReporterName] = useState('')
    const [validationError, setValidationError] = useState('')
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    useEffect(() => {
        let imgUrl = detail.imageUrl;
        if(!imgUrl || imgUrl === 'https://example.com/image.jpg' || imgUrl === 'https://example.com/updated-image.jpg'){
            imgUrl = '/testPic.png';
        }
        setImageUrl(imgUrl)
    }, [detail.imageUrl]);
    
    const handleImageError = () => {
        console.log("Image failed to load:", imageUrl);
        setImageError(true);
    };

    const handleImageUpload = (imageData) => {
        // Store both the file object for later upload and preview URL for immediate display
        setNewImageFile(imageData.file);
        setImagePreview(imageData.previewUrl);
    };
      
    const toggleEditMode = () => {
        setShowNameValidation(true);
        setInputReporterName('');
        setValidationError('');
        // setIsEditing(true);
    }

    const validateReporterName = () => {
        if (!reporterName) {
            // If no reporter name is stored, allow editing
            setShowNameValidation(false);
            setIsEditing(true);
            return;
        }
        
        if (inputReporterName.trim() === reporterName.trim()) {
            // Names match, allow editing
            setShowNameValidation(false);
            setIsEditing(true);
        } else {
            // Names don't match, show error
            setValidationError('Reporter name does not match our records. Please try again.');
        }
    }

    const handleCancel = () => {
        // Reset form values to original data
        setName(detail.missingPersonName);
        setPhoneNumber(detail.phoneNumber);
        setDescription(detail.missingPersonDescription);
        setRelationship(detail.relationshipToReporter);
        setLocation(detail.locationOfMissingPerson);
        setTime(detail.timeSinceMissing);
        setIsEditing(false);
    };

    const handleRemove = async () => {
        try {
            setIsSaving(true);
            if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
                setIsSaving(false);
                return;
            }
            const response = await fetch(`http://localhost:3002/api/reports/${detail._id || detail.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reporterName })
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Failed to delete record');
            }
            console.log("Remove successful:", result);
            // Notify parent component about successful deletion
            if (onDeleteSuccess) {
                onDeleteSuccess(detail._id || detail.id);
            }
            
            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete report. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true);
            
            let updatedImageUrl = detail.imageUrl;
            
            // Upload new image if available
            if (newImageFile) {
                const formData = new FormData();
                formData.append('file', newImageFile);
                
                // Check if environment variables are accessible
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                
                console.log("Upload preset:", uploadPreset);
                console.log("Cloud name:", cloudName);
                
                if (!uploadPreset || !cloudName) {
                    throw new Error('Missing Cloudinary configuration');
                }
                
                formData.append('upload_preset', uploadPreset);
                
          
                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
          
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error("Cloudinary error response:", errorData);
                    throw new Error(`Failed to upload image: ${res.status} ${res.statusText}`);
                }
          
                const data = await res.json();
                updatedImageUrl = data.secure_url;
                console.log("Image uploaded successfully:", updatedImageUrl);
            } else if (newImageUrl) {
                updatedImageUrl = newImageUrl;
            }
            
            // Create updated data object
            const updateData = {
                reporterName: reporterName, // Required by server for validation
                locationOfMissingPerson: location,
                missingPersonName: name,
                phoneNumber: phoneNumber,
                missingPersonDescription: description,
                relationshipToReporter: relationship,
                timeSinceMissing: time,
                imageUrl: updatedImageUrl,  // Use the new image URL here!
            };
            
            // Send update to server
            const response = await fetch(`http://localhost:3002/api/reports/${detail._id || detail.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error('Failed to update record');
            }
            console.log("Update successful:", result);

            // Update the local state with the new values
            setImageUrl(updatedImageUrl);
            setImagePreview(null);
            setNewImageFile(null);
            setNewImageUrl(null);
            setImageError(false);
            
            // Create updated person object to pass back to parent
            const updatedPerson = {
                ...detail,
                reporterName: reporterName,
                missingPersonName: name,
                phoneNumber: phoneNumber,
                missingPersonDescription: description,
                relationshipToReporter: relationship,
                locationOfMissingPerson: location,
                timeSinceMissing: time,
                imageUrl: updatedImageUrl
            };
            
            // Call the onUpdateSuccess callback with the updated person
            if (onUpdateSuccess) {
                onUpdateSuccess(updatedPerson);
            }

            // Exit edit mode
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating record:', error);
            alert('Failed to update information. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            {/* Validation Modal */}
            {showNameValidation && (
                <div className="validation-modal">
                    <div className="validation-content">
                        <h2>Verify Reporter Identity</h2>
                        <p>Please enter the name of the person who originally reported this case:</p>
                        
                        <div className="input-group">
                            <input 
                                type="text"
                                value={inputReporterName}
                                onChange={(e) => setInputReporterName(e.target.value)}
                                placeholder="Reporter name"
                                className="reporter-input"
                            />
                            {validationError && (
                                <div className="validation-error">{validationError}</div>
                            )}
                        </div>
                        
                        <div className="validation-actions">
                            <button 
                                className="action-button verify-button"
                                onClick={validateReporterName}
                            >
                                Verify
                            </button>
                            <button 
                                className="action-button cancel-button"
                                onClick={() => setShowNameValidation(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>
                
                <h1 className="modal-title">
                    {isEditing ? "Edit Missing Person Details" : "Missing Person Details"}
                </h1>
                
                <div className="modal-body">
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
                    </div>
                    
                    <div className="details-section">
                        <div className="detail-row">
                            <h3>Name</h3>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={name || ""} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="edit-input"
                                    placeholder="Name" 
                                    autoFocus
                                />
                            ) : (
                                <p>{name || "Unknown"}</p>
                            )}
                        </div>
                        
                        <div className="detail-row">
                            <h3>Description</h3>
                            {isEditing ? (
                                <textarea 
                                    value={description || ""} 
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="edit-input"
                                    rows={3}
                                    placeholder="Description" 
                                    autoFocus
                                />
                            ) : (
                                <p>{description || "No description provided"}</p>
                            )}
                        </div>
                        
                        <div className="detail-row">
                            <h3>Last Known Location</h3>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={location || ""} 
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="edit-input"
                                    placeholder="Location" 
                                    autoFocus
                                />
                            ) : (
                                <p>{location || "Unknown"}</p>
                            )}
                        </div>
                        
                        <div className="detail-row">
                            <h3>Missing Since</h3>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={time || ""} 
                                    onChange={(e) => setTime(e.target.value)}
                                    className="edit-input"
                                    placeholder="Time since missing" 
                                    autoFocus
                                />
                            ) : (
                                <p>{time || "Unknown"}</p>
                            )}
                        </div>
                        
                        <div className="detail-row">
                            <h3>Reported By</h3>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={relationship || ""} 
                                    onChange={(e) => setRelationship(e.target.value)}
                                    className="edit-input"
                                    placeholder="Relationship" 
                                    autoFocus
                                />
                            ) : (
                                <p>{relationship || "Unknown"}</p>
                            )}
                        </div>
                        
                        <div className="detail-row">
                            <h3>Contact Number</h3>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={phoneNumber || ""} 
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="edit-input"
                                    placeholder="Phone number" 
                                    autoFocus
                                />
                            ) : (
                                <p>{phoneNumber || "No contact number provided"}</p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    {isEditing ? (
                        <>  
                            <button 
                                className="action-button save-button" 
                                onClick={handleRemove}
                            >
                                Remove Report
                            </button>
                            <button 
                                className="action-button save-button" 
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                                className="action-button cancel-button" 
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="action-button edit-button" 
                                onClick={toggleEditMode}
                            >
                                Edit
                            </button>
                            <button className="action-button">Report Sighting</button>
                            <button className="action-button" onClick={onClose}>Close</button>
                        </>
                    )}
                </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.75);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                }
                
                .modal-content {
                    width: 80%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background: rgba(20, 20, 20, 0.8);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    color: #fff;
                    position: relative;
                }
                
                .close-button {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: color 0.3s ease;
                    padding: 0.5rem;
                    border-radius: 50%;
                }
                
                .close-button:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .modal-title {
                    margin-top: 0;
                    font-size: 1.8rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    background: linear-gradient(90deg, #646cff, #9089fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                }
                
                .modal-body {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        grid-template-columns: 1fr;
                    }
                }
                
                .image-section {
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
                }
                
                .details-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .detail-row {
                    padding: 0.75rem;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }
                
                .detail-row:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .detail-row h3 {
                    margin: 0;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .detail-row p {
                    margin: 0.5rem 0 0;
                    font-size: 1rem;
                    color: white;
                }
                
                .modal-footer {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                
                .action-button {
                    background: rgba(100, 108, 255, 0.2);
                    color: #646cff;
                    border: 1px solid rgba(100, 108, 255, 0.4);
                    border-radius: 8px;
                    padding: 0.75rem 1.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .action-button:hover {
                    background: rgba(100, 108, 255, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .validation-modal {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1100;
                    backdrop-filter: blur(10px);
                }
                
                .validation-content {
                    width: 90%;
                    max-width: 500px;
                    background: rgba(30, 30, 30, 0.9);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    color: #fff;
                }
                
                .validation-content h2 {
                    margin-top: 0;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    color: #646cff;
                }
                
                .input-group {
                    margin: 1.5rem 0;
                }
                
                .reporter-input {
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    color: white;
                    padding: 12px 16px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                
                .reporter-input:focus {
                    outline: none;
                    border-color: #646cff;
                    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
                }
                
                .validation-error {
                    color: #ff6b6b;
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                }
                
                .validation-actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                .verify-button {
                    background: rgba(22, 163, 74, 0.2);
                    color: #16a34a;
                    border: 1px solid rgba(22, 163, 74, 0.4);
                }
                
                .verify-button:hover {
                    background: rgba(22, 163, 74, 0.3);
                }

                .edit-input {
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.15); /* Slightly brighter background */
                    border: 2px solid rgba(100, 108, 255, 0.5); /* More visible border with brand color */
                    border-radius: 4px;
                    color: white;
                    padding: 8px 12px;
                    font-size: 0.95rem;
                    margin-top: 0.5rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 8px rgba(100, 108, 255, 0.2); /* Subtle glow effect */
                }
                
                .edit-input:focus {
                    outline: none;
                    border-color: #646cff;
                    background-color: rgba(255, 255, 255, 0.2); /* Brighten more on focus */
                    box-shadow: 0 0 12px rgba(100, 108, 255, 0.4); /* Enhanced glow on focus */
                }
                
                /* Add a subtle pulse animation for new inputs */
                @keyframes pulse-border {
                    0% { border-color: rgba(100, 108, 255, 0.3); }
                    50% { border-color: rgba(100, 108, 255, 0.8); }
                    100% { border-color: rgba(100, 108, 255, 0.3); }
                }
                
                /* Apply animation to new inputs when edit mode is first enabled */
                .detail-row.just-editable .edit-input {
                    animation: pulse-border 2s ease-in-out;
                }
                
                textarea.edit-input {
                    resize: vertical;
                    min-height: 80px;
                }
                
                /* Make the edit mode row more distinct */
                .detail-row.editing {
                    background: rgba(100, 108, 255, 0.1);
                    border-left: 3px solid #646cff;
                }

            `}</style>
        </div>
    );
}

export default DetailModal;