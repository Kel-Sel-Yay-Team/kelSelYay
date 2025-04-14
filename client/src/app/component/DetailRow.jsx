"use client";
import { useEffect, useState } from "react";

function DetailRow({ 
  label, 
  value, 
  isEditing, 
  onChange, 
  placeholder = "", 
  isTextarea = false,
  rows = 3
}) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };
  return (
    <div className={`detail-row ${isEditing ? 'editing' : ''}`}>
      <h3 className="model-label">{label}</h3>
      {isEditing ? (
        isTextarea ? (
          // <textarea 
          //   value={value || ""}
          //   onChange={(e) => onChange(e.target.value)}
          //   className="edit-input"
          //   rows={rows}
          //   placeholder={placeholder || label}
          // />
          <textarea
          value={localValue}
          onChange={handleChange}
          className="edit-input"
          rows={rows}
          placeholder={placeholder || label}
        />
        ) : (
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            className="edit-input"
            placeholder={placeholder || label}
          />
          // <input 
          //   type="text"
          //   value={value || ""} 
          //   onChange={(e) => onChange(e.target.value)}
          //   className="edit-input"
          //   placeholder={placeholder || label}
          // />
        )
      ) : (
        <p>{value || (label === "Description" ? "No description provided" : "Unknown")}</p>
      )}

      <style jsx>
        {`
          .model-label{
            font-weight: 700; /* Bold text */
            margin-bottom: 6px;
          }
          .detail-row.editing .model-label{
            margin-bottom: 1px;
          }
        `}
      </style>
    </div>
  );
}

export default DetailRow;