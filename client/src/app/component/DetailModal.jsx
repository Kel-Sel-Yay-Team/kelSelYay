"use client"

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ValidationModal from "./ValidationModal";
import DetailRow from "./DetailRow";
import ImageSection from "./ImageSection";
import { useLanguage } from "../context/LanguageContext";
import { uploadAwsImage } from "@/utils/awsHelper";

const getCoordinates = async (query) => {
    const res = await fetch(`https://kelselyay.onrender.com/api/reports/geocode?address=${encodeURIComponent(query)}`);
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
    const [time, setTime] = useState(detail.dateMissing);
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
        { label: 'Date of Missing', key: 'dateMissing', stateSetter: setTime, stateValue: time, isTextarea: false },
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
            { label: 'Missing Since', key: 'dateMissing', stateSetter: setTime, stateValue: time, isTextarea: false },
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

            const response = await fetch(`https://kelselyay.onrender.com/api/reports/${detail._id || detail.id}`, {
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
        setTime(detail.dateMissing);
        setIsEditing(false);
    };

    const handleRemove = async () => {
        try {
            setIsSaving(true);
            if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
                setIsSaving(false);
                return;
            }
            const response = await fetch(`https://kelselyay.onrender.com/api/reports/${detail._id || detail.id}`, {
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
            // Notify parent component about successful deletion
            if (onDeleteSuccess) {
                onDeleteSuccess(detail._id || detail.id);
            }
            
            // Close the modal
            onClose();
        } catch (error) {
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
            
                updatedImageUrl = await uploadAwsImage(newImageFile, "Missing person image")
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
                dateMissing: time,
                imageUrl: updatedImageUrl,
            };
            
            // Send update to server
            const response = await fetch(`https://kelselyay.onrender.com/api/reports/${detail._id || detail.id}`, {
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
                    <span className="x-icon-wrapper">
                        <X size={24} />
                    </span>
                </button>
                
                <h1 className="modal-title">
                    {/* <div className="modal-title-container"> */}
                        <p className="modal-title-text">{isEditing ? t("Edit Missing Person Details") : t("Missing Person Details")}</p>
                    {/* </div> */}
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
                    
                    <div className={`details-section ${isEditing ? 'editing' : ''}`}>
                        {detailSection.map((section, index) => {
                            return(
                                <DetailRow
                                    key={index}
                                    label={t(section.label)}
                                    value={section.key === 'dateMissing' && !isEditing
                                        ? new Date(section.stateValue).toLocaleDateString("en-US", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                          }) // or "my-MM"
                                        : section.stateValue}
                                    isEditing={isEditing}
                                    onChange={section.stateSetter}
                                    placeholder={t(`Enter ${section.label}`)}
                                    isTextarea={section.isTextarea}
                                />
                            )
                        })}
                    </div>
                </div>
                
                <div className="modal-footer">
                    {isEditing ? (
                        <>  
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
                            <button className="action-button edit-button" onClick={toggleEditMode}>
                                {t("Edit")}
                            </button>
                            <button className="action-button save-button" onClick={toggleReportSighting}>
                                {t("Mark As Found")}
                            </button>
                            <button className="action-button cancel-button" onClick={onClose}>
                                {t("Close")}
                            </button>
                        </>
                    )}
                </div>
    
                {isSaving && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="spinner"></div>
                            <p>{t("Editing report...")}</p>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .modal-content {
                    background-color: white;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                    overflow-y: auto;
                    position: relative;
                    padding: 24px;
                    color: #333;
                    z-index: 10000;
                }

                .close-button {
                  position: absolute;
                  top: 13px;
                  right: 13px;
                  background: transparent;
                  color: #666;
                  cursor: pointer;
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0; /* ✅ ensures full area is clickable */
                  border: none; /* ✅ optional but cleaner */
                  z-index: 1001;
                }

                .close-button:hover {
                    background-color: rgba(217, 48, 37, 0.1); /* Light red background on hover */
                    color: #d93025; /* Red icon on hover */
                }

                .modal-title {
                    margin-bottom: 20px;
                    text-align: center;
                    position: relative;
                    display: flex;
                    justify-content: center;
                }

                .modal-title-container {
                    display: inline-block;
                    background-color: #d93025;
                    border-radius: 8px;
                    padding: 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    min-width: 50%;
                    max-width: 60%;
                }

                .modal-title-text {
                    font-size: 1.6rem;
                    font-weight: 600;
                    color: red;
                    padding: 10px 24px;
                    margin: 0;
                }

                .modal-title::after {
                    display: none;
                }

                /* Adjust for mobile */
                @media (max-width: 768px) {
                    .modal-title-text {
                        font-size: 1.4rem;
                        padding: 8px 20px;
                    }
                    
                    .modal-title-container {
                        min-width: 70%;
                    }
                }

                /* Very small screens */
                @media (max-width: 480px) {

                    .modal-content {
                        max-height: ;
                    }

                    .modal-title-text {
                        font-size: 1.2rem;
                        padding: 8px 16px;
                    }
                    
                    .modal-title-container {
                        min-width: 80%;
                        min-height: 
                    }
                }
                
                .modal-body {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 24px;
                }


                .details-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* Styling for labels to add a subtle red accent */
                :global(.detail-row-label) {
                    color: #333;
                    border-left: 3px solid #d93025;
                    padding-left: 8px;
                    font-weight: 500;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                    padding-top: 16px;
                    border-top: 1px solid #eaeaea;
                }

                .action-button {
                    padding: 10px 16px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }

                .action-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.3); /* Red focus ring */
                }

                .cancel-button {
                    background-color: #f5f5f5;
                    color: #444;
                    border-color: #ddd;
                }

                .cancel-button:hover {
                    background-color: #eaeaea;
                }

                .save-button {
                    background-color: #d93025; /* Red for primary action button */
                    color: white;
                }

                .save-button:hover {
                    background-color: #c62828; /* Darker red on hover */
                }

                .edit-button {
                    background-color: #f5f5f5;
                    color: #d93025; /* Red text for edit button */
                    border-color: #d93025; /* Red border for edit button */
                }

                .edit-button:hover {
                    background-color: rgba(217, 48, 37, 0.1); /* Light red background on hover */
                }

                .remove-button {
                    background-color: white;
                    color: #d93025;
                    border-color: #d93025;
                    margin-right: auto;
                }

                .remove-button:hover {
                    background-color: #fce8e6;
                }

                .action-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .loading-overlay {
                    position: absolute;
                    inset: 0;
                    background-color: rgba(255, 255, 255, 0.85);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 12px;
                    z-index: 10001;
                }

                .loading-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(217, 48, 37, 0.2); /* Light red spinner track */
                    border-top-color: #d93025; /* Red spinner color */
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* Mobile optimizations that maintain desktop layout */
                @media (max-width: 768px) {
                    .modal-overlay {
                        padding: 0.5rem;
                        align-items: flex-start;
                    }

                    .modal-content {
                        width: 95%;
                        padding: 16px;
                        margin-top: 10vh; /* Position higher on the screen */
                    }

                    .modal-title {
                        font-size: 1.4rem;
                        padding-top: 8px;
                        margin-bottom: 16px;
                    }
                    
                    .modal-title::after {
                        left: 25%;
                        right: 25%;
                    }
                    
                    /* Keep two-column layout but adjust proportions for small screens */
                    .modal-body {
                        grid-template-columns: 0.3fr 1.2fr; /* Slightly adjust ratio */
                        gap: 12px;
                    }
                    
                    /* Optimize image size */
                    :global(.image-section) {
                        max-height: 180px;
                    }
                    
                    :global(.image-section img) {
                        max-height: 180px;
                        object-fit: contain;
                    }
                    
                    /* Make form elements more touchable */
                    :global(.detail-row-label) {
                        font-size: 0.85rem;
                        margin-bottom: 3px;
                        border-left: 2px solid #d93025;
                        padding-left: 6px;
                    }
                    
                    :global(.detail-row input),
                    :global(.detail-row textarea) {
                        font-size: 16px; /* Prevent iOS zoom */
                        padding: 8px;
                        min-height: 36px;
                    }
                    
                    :global(.detail-row textarea) {
                        min-height: 60px;
                    }
                    
                    .action-button {
                        padding: 8px 12px;
                        font-size: 0.85rem;
                        min-height: 36px;
                    }
                    
                    .loading-overlay {
                        background-color: rgba(255, 255, 255, 0.9);
                    }
                }
                
                /* Very small screens - maintain layout but further optimize */
                @media (max-width: 480px) {
                    .modal-content {
                        padding: 12px;
                        border-top: 3px solid #d93025;
                    }

                    .modal-title {
                        font-size: 1.2rem;
                    }
                    
                    .modal-title::after {
                        left: 20%;
                        right: 20%;
                    }
                    
                    .modal-body {
                        grid-template-columns: 0.8fr 1.2fr; /* Slightly adjust ratio */
                        gap: 8px;
                    }
                    
                    .modal-footer {
                        gap: 6px;
                    }
                    
                    .action-button {
                        padding: 8px;
                        font-size: 0.75rem;
                    }
                    
                    .remove-button {
                        font-size: 0.7rem;
                    }
                    
                    :global(.detail-row) {
                        margin-bottom: 6px;
                    }

                    .details-section{
                        font-size: 0.8rem;
                        gap: 8px;
                    }
                }
                @media (max-width: 320px) {
                    .modal-title-text {
                        font-size: 1.0rem;
                    }
                    .details-section{
                        font-size: 0.8rem;
                        gap: 4px;
                    }
                    .modal-body{
                        grid-template-columns: 0.8fr 1.2fr; /* Slightly adjust ratio */
                    }
                }
                :global(.editing .detail-row input),
                :global(.editing .detail-row textarea) {
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 8px;
                    background-color: #fff;
                    color: #333;
                    width: 100%;
                    resize: vertical;
                }

                /* Optional focus */
                :global(.editing .detail-row input:focus),
                :global(.editing .detail-row textarea:focus) {
                    border: 1px solid #d93025;
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(217, 48, 37, 0.2);
                }

            `}</style>
        </div>
    );
}

export default DetailModal;