"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ReportMissingPerson({ onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    reporterName: "",
    missingPersonName: "",
    phoneNumber: "",
    missingPersonDescription: "",
    relationshipToReporter: "",
    locationOfMissingPerson: "",
    timeSinceMissing: "",
    imageUrl: "", // optional, use imagePreview if needed
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const {t} = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file)
    {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      let finalImageUrl = "";

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);

        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        if (!uploadPreset || !cloudName) {
          throw new Error("Missing Cloudinary config");
        }

        formDataUpload.append("upload_preset", uploadPreset);
        formDataUpload.append("folder", "Missing People Pictures");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error?.message || "Failed to upload image");
        }

        const cloudinaryData = await res.json();
        finalImageUrl = cloudinaryData.secure_url;
      } else {
        finalImageUrl = "https://picsum.photos/200/300";
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      const response = await fetch("http://localhost:3002/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("✅ Report submitted successfully:", data);

      if(onSubmitSuccess){
        onSubmitSuccess(data)
      }
      
      onClose();
    } catch (error) {
      console.error("🚨 Error submitting report:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="modal-title">{t("Report Missing Person")}</h2>

        {/* Form */}
        <div className="modal-body">
          <div className="form-section">
            <div className="photo-and-inputs">
              <div className="image-upload-container">
                <label htmlFor="imageUpload" className="upload-box">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <span className="upload-placeholder">{t("Click to upload photo")}</span>
                  )}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                {/* Only visible on mobile */}
                <div className="time-mobile-wrapper">
                  <input
                    name="timeSinceMissing"
                    value={formData.timeSinceMissing}
                    onChange={handleChange}
                    placeholder="Time Missing (e.g. 24)"
                    className="form-input time-mobile"
                    type="number"
                  />
                </div>
              </div>

              <div className="input-column">
                <input
                  name="missingPersonName"
                  value={formData.missingPersonName}
                  onChange={handleChange}
                  placeholder={t("Missing Person's Name")}
                  className="form-input"
                />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t("Contact Number")}
                  className="form-input"
                />
                <input
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  placeholder={t("Reported By")}
                  className="form-input"
                />
                <input
                  name="relationshipToReporter"
                  value={formData.relationshipToReporter}
                  onChange={handleChange}
                  placeholder={t("Relation to Reporter")}
                  className="form-input"
                />
                {/* Only visible on desktop */}
                <input
                  name="timeSinceMissing"
                  value={formData.timeSinceMissing}
                  onChange={handleChange}
                  placeholder={t("Time Since Missing (e.g. 24)")}
                  className="form-input time-desktop"
                  type="number"
                />
              </div>
            </div>

            <input
              name="locationOfMissingPerson"
              value={formData.locationOfMissingPerson}
              onChange={handleChange}
              placeholder={t("Last Known Location")}
              className="form-input"
            />

            <textarea
              name="missingPersonDescription"
              value={formData.missingPersonDescription}
              onChange={handleChange}
              placeholder={t("Description")}
              rows="4"
              className="form-input"
            />
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button onClick={handleSubmit} className="action-button">
              {t("Submit")}
            </button>
            <button onClick={onClose} className="action-button">
              {t("Close")}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        z-index: 1000;
      }

      .modal-content {
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        background: rgba(20, 20, 20, 0.85);
        border-radius: 16px;
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
      }

      .close-button:hover {
        color: white;
      }

      .modal-title {
        text-align: center;
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        background: linear-gradient(90deg,rgb(247, 247, 247),rgb(246, 246, 250));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .modal-body {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .photo-and-inputs {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .image-upload-container {
        flex: 1;
        min-width: 160px;
        margin-bottom: 1rem;
      }

      .upload-box {
        height: 240px;
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: border 0.3s ease;
      }

      .upload-box:hover {
        border-color: #646cff;
      }

      .upload-placeholder {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.9rem;
        text-align: center;
        padding: 0 0.5rem;
      }

      .image-preview {
        height: 100%;
        width: auto;
        object-fit: contain;
        border-radius: 8px;
      }

      .input-column {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 0.05rem;
        min-width: 200px;
      }

      .form-input {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 0.75rem;
        color: white;
        font-size: 0.95rem;
        width: 100%;
      }

      .input-column .form-input{
        padding: 0.5rem;
      }

      .form-input.textarea {
        min-height: 1000px;
      }

      input.form-input {
        margin-bottom: 0.5rem;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }

      .action-button {
        background: red;
        color: white;
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
      }

      .time-mobile-wrapper {
        display: none;
      }

      .time-desktop {
        display: block;
      }

      @media (max-width: 767px) {
      .modal-content {
        max-height: 95vh;
        padding: 1rem;
      }
          
      .modal-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
          
      .photo-and-inputs {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        flex-wrap: nowrap;
      }
          
      .image-upload-container {
        width: 40%;
        min-width: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
          
      .upload-box {
        height: 140px;
      }
          
      .input-column {
        width: 55%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
          
      .form-input {
        font-size: 0.9rem;
        padding: 0.6rem;
      }
          
      .form-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
          
      input.form-input,
      textarea.form-input {
        margin-bottom: 0.5rem;
      }
          
      .modal-body {
        gap: 1.2rem;
      }
          
      .modal-footer {
        flex-direction: row;
        justify-content: space-between;
      }
          
      .action-button {
        flex: 1;
        padding: 0.6rem;
        font-size: 0.9rem;
      }
      
      .time-desktop {
        display: none;
      }
          
      .time-mobile-wrapper {
        display: block;
        margin-top: 1.70rem;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .time-mobile-wrapper input::placeholder {
        font-size: 0.65rem; /* or whatever size you want */
      }
          
      .time-mobile {
        width: 100%;
        max-width: 160px;
        height: 40px;
        font-size: 0.75rem;
        padding: 0.2rem 0.2rem;
      }
    }
    @media (max-width: 424px) {
      .photo-and-inputs {
        flex-wrap: nowrap;
      }

      .image-upload-container {
        width: 38%; /* stays compact */
      }

      .upload-box {
        height: 140px; /* reduce image height a bit more */
      }

      .input-column {
        width: 58%;
        min-width: 0; /* override the 200px */
        gap: 0.4rem;
      }

      .form-input {
        font-size: 0.85rem;
        padding: 0.5rem;
      }

      .modal-title {
        font-size: 1.35rem;
      }

      .action-button {
        font-size: 0.85rem;
        padding: 0.5rem;
      }
      
      .time-mobile-wrapper input::placeholder {
        font-size: 0.58rem; /* or whatever size you want */
      }
      
      .time-mobile-wrapper {
        margin-top: 1.1rem;
      }

    }
      
    @media (max-width: 320px) {
      .modal-title {
        font-size: 1.2rem; /* or try 1.1rem if needed */
        line-height: 1.4;
      }
      .time-mobile-wrapper input::placeholder {
        font-size: 0.58rem; /* or whatever size you want */
      }
      
      .time-mobile-wrapper {
        margin-top: 1.05rem;
      }
    }
    `}</style>

    </div>
  );
}
