"use client";

function DetailRow({ 
  label, 
  value, 
  isEditing, 
  onChange, 
  placeholder = "", 
  isTextarea = false,
  rows = 3
}) {
  return (
    <div className={`detail-row ${isEditing ? 'editing' : ''}`}>
      <h3 className="model-label">{label}</h3>
      {isEditing ? (
        isTextarea ? (
          <textarea 
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="edit-input"
            rows={rows}
            placeholder={placeholder || label}
          />
        ) : (
          <input 
            type="text"
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)}
            className="edit-input"
            placeholder={placeholder || label}
          />
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