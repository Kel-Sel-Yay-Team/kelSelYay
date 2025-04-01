// Full Component (Fixed & Ready)
"use client"

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ImageUpload from "./ImageUpload";
import ValidationModal from "./ValidationModal";
import DetailRow from "./DetailRow";
import ImageSection from "./ImageSection";

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
    const [isSaving, setIsSaving] = useState(false);
    const [showNameValidation, setShowNameValidation] = useState(false);
    const [inputReporterName, setInputReporterName] = useState('');
    const [validationError, setValidationError] = useState('');
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isReportingSighting, setIsReportingSighting] = useState(false); // 💡 this decides which flow we're doing
    
    const [detailSection, setDetailSection] = useState([
        { label: 'Name', key: 'missingPersonName', stateSetter: setName, stateValue: name, isTextarea: false },
        { label: 'Description', key: 'missingPersonDescription', stateSetter: setDescription, stateValue: description, isTextarea: true },
        { label: 'Last Known Location', key: 'locationOfMissingPerson', stateSetter: setLocation, stateValue: location, isTextarea: false },
        { label: 'Missing Since', key: 'timeSinceMissing', stateSetter: setTime, stateValue: time, isTextarea: false },
        { label: 'Reported By', key: 'relationshipToReporter', stateSetter: setRelationship, stateValue: relationship, isTextarea: false },
        { label: 'Contact Number', key: 'phoneNumber', stateSetter: setPhoneNumber, stateValue: phoneNumber, isTextarea: false },
    ]);

    useEffect(() => {
        let imgUrl = detail.imageUrl;
        if(!imgUrl || imgUrl === 'https://example.com/image.jpg' || imgUrl === 'https://example.com/updated-image.jpg'){
            imgUrl = '/testPic.png';
        }
        setImageUrl(imgUrl)
    }, [detail.imageUrl]);

    useEffect(() => {
        setDetailSection([
            { label: 'Name', key: 'missingPersonName', stateSetter: setName, stateValue: name, isTextarea: false },
            { label: 'Description', key: 'missingPersonDescription', stateSetter: setDescription, stateValue: description, isTextarea: true },
            { label: 'Last Known Location', key: 'locationOfMissingPerson', stateSetter: setLocation, stateValue: location, isTextarea: false },
            { label: 'Missing Since', key: 'timeSinceMissing', stateSetter: setTime, stateValue: time, isTextarea: false },
            { label: 'Reported By', key: 'relationshipToReporter', stateSetter: setRelationship, stateValue: relationship, isTextarea: false },
            { label: 'Contact Number', key: 'phoneNumber', stateSetter: setPhoneNumber, stateValue: phoneNumber, isTextarea: false },
        ]);
    }, [name, description, location, time, relationship, phoneNumber]);


    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageUpload = (imageData) => {
        setNewImageFile(imageData.file);
        setImagePreview(imageData.previewUrl);
    };

    const toggleEditMode = () => {
        setIsReportingSighting(false);
        setShowNameValidation(true);
        setInputReporterName('');
        setValidationError('');
    };

    const toggleReportSighting = () => {
        setIsReportingSighting(true);
        setShowNameValidation(true);
        setInputReporterName('');
        setValidationError('');
    };

    const validateReporterName = async (inputName) => {
        if (!reporterName) {
            setShowNameValidation(false);
            isReportingSighting ? await handleMarkAsFound() : setIsEditing(true);
            return;
        }        
        if (inputName.trim() === reporterName.trim()) {
            // Names match, allow editing

            setShowNameValidation(false);
            isReportingSighting ? await handleMarkAsFound() : setIsEditing(true);
        } else {
            setValidationError('Reporter name does not match our records. Please try again.');
        }
    };

    const handleMarkAsFound = async () => {
        try {
            setIsSaving(true);

            const response = await fetch(`http://localhost:3002/api/reports/${detail._id || detail.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reporterName, found: true })
            });

            const result = await response.json();
            if (!response.ok) throw new Error('Failed to mark as found');

            if (onUpdateSuccess) onUpdateSuccess({ ...detail, found: true });
            alert('Sighting reported successfully!');
            onClose();

        } catch (error) {
            console.error('Error marking as found:', error);
            alert('Failed to mark as found.');
        } finally {
            setIsSaving(false);
        }
    };

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
                formData.append('folder', 'Missing People Pictures');
                
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
                <ValidationModal 
                    isOpen={showNameValidation}
                    onClose={() => setShowNameValidation(false)}
                    onValidate={validateReporterName}
                    title="Verify Reporter Identity"
                    message="Please enter the name of the person who originally reported this case:"
                    placeholder="Reporter name"
                    errorMessage={validationError}
                    buttonText="Verify"
                />
            )}

        

            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>
                
                <h1 className="modal-title">
                    {isEditing ? "Edit Missing Person Details" : "Missing Person Details"}
                </h1>
                
                <div className="modal-body">
                    <ImageSection
                        imagePreview={imagePreview}
                        isEditing={isEditing}
                        imageError={imageError}
                        imageUrl={imageUrl}
                        handleImageError={handleImageError}
                        handleImageUpload={handleImageUpload}
                        name={name}
                    />
                    
                    <div className="details-section">
                        {detailSection.map((section, index) => (
                            <DetailRow
                                key={index}
                                label={section.label}
                                value={section.stateValue}
                                isEditing={isEditing}
                                onChange={section.stateSetter}
                                placeholder={`Enter ${section.label}`}
                                isTextarea={section.isTextarea}
                            />
                        ))}
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
                            <button className="action-button" onClick={toggleReportSighting}>Report Sighting</button>
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
                
                .details-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
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
            `}</style>
        </div>
    );
}

export default DetailModal;