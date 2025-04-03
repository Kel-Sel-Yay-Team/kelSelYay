"use client"

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ValidationModal from "./ValidationModal";
import DetailRow from "./DetailRow";
import ImageSection from "./ImageSection";
import { useLanguage } from "../context/LanguageContext";

const getCoordinates = async (query) => {
    const res = await fetch(`http://localhost:3002/api/reports/geocode?address=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data.results || !data.results.length) return null;
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
}

function DetailModal({ detail, onClose, onUpdateSuccess, onDeleteSuccess }) {
    const { t } = useLanguage();

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

            const updateData = {
                reporterName: reporterName,
                locationOfMissingPerson: location,
                missingPersonName: name,
                phoneNumber: phoneNumber,
                missingPersonDescription: description,
                relationshipToReporter: relationship,
                timeSinceMissing: time,
                imageUrl: updatedImageUrl,
            };
            
            // Send update to server
            const response = await fetch(`http://localhost:3002/api/reports/${detail._id || detail.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
                        
            const updatedPerson = await response.json();
            if (!response.ok) throw new Error(updatedPerson.error || "Something went wrong");

            if (onUpdateSuccess) onUpdateSuccess(updatedPerson.data);

            // Update the local state with the new values
            setImageUrl(updatedImageUrl);
            setImagePreview(null);
            setNewImageFile(null);
            setNewImageUrl(null);
            setImageError(false);
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
            {showNameValidation && (
                <ValidationModal 
                    isOpen={showNameValidation}
                    onClose={() => setShowNameValidation(false)}
                    onValidate={validateReporterName}
                    title={t("Verify Reporter Identity")}
                    message={t("Please enter the name of the person who originally reported this case:")}
                    placeholder={t("Reporter name")}
                    errorMessage={validationError ? t(validationError) : ''}
                    buttonText={t("Verify")}
                />
            )}

            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <h1 className="modal-title">
                    {isEditing ? t("Edit Missing Person Details") : t("Missing Person Details")}
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
                                label={t(section.label)}
                                value={section.stateValue}
                                isEditing={isEditing}
                                onChange={section.stateSetter}
                                placeholder={t(`Enter ${section.label}`)}
                                isTextarea={section.isTextarea}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="modal-footer">
                    {isEditing ? (
                        <>  
                            <button 
                                className="action-button remove-button" 
                                onClick={handleRemove}
                            >
                                {t('Remove Report')}
                            </button>
                            <button 
                                className="action-button cancel-button" 
                                onClick={handleCancel}
                            >
                                {t("Cancel")}
                            </button>
                            <button 
                                className="action-button save-button" 
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? t('Saving...') : t('Save Changes')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="action-button cancel-button" onClick={onClose}>
                                {t("Close")}
                            </button>
                            <button className="action-button save-button" onClick={toggleReportSighting}>
                                {t("Report Sighting")}
                            </button>
                            <button className="action-button edit-button" onClick={toggleEditMode}>
                                {t("Edit")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailModal;