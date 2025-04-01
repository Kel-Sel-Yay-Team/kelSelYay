"use client"

import { useState, useEffect } from "react";
import { X } from "lucide-react"

function DetailModal({ detail, onClose }) {    
    const [name, setName] = useState(detail.missingPersonName);
    const [phoneNumber, setPhoneNumber] = useState(detail.phoneNumber);
    const [description, setDescription] = useState(detail.missingPersonDescription);
    const [relationship, setRelationship] = useState(detail.relationshipToReporter);
    const [location, setLocation] = useState(detail.locationOfMissingPerson);
    const [time, setTime] = useState(detail.timeSinceMissing);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    
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

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>
                
                <h1 className="modal-title">Missing Person Details</h1>
                
                <div className="modal-body">
                    <div className="image-section">
                        <div className="image-container">
                            {imageUrl && !imageError ? (
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
                    </div>
                    
                    <div className="details-section">
                        <div className="detail-row">
                            <h3>Name</h3>
                            <p>{name || "Unknown"}</p>
                        </div>
                        
                        <div className="detail-row">
                            <h3>Description</h3>
                            <p>{description || "No description provided"}</p>
                        </div>
                        
                        <div className="detail-row">
                            <h3>Last Known Location</h3>
                            <p>{location || "Unknown"}</p>
                        </div>
                        
                        <div className="detail-row">
                            <h3>Missing Since</h3>
                            <p>{time || "Unknown"}</p>
                        </div>
                        
                        <div className="detail-row">
                            <h3>Reported By</h3>
                            <p>{relationship || "Unknown"}</p>
                        </div>
                        
                        <div className="detail-row">
                            <h3>Contact Number</h3>
                            <p>{phoneNumber || "No contact number provided"}</p>
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="action-button">Report Sighting</button>
                    <button className="action-button" onClick={onClose}>Close</button>
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
            `}</style>
        </div>
    );
}

export default DetailModal;