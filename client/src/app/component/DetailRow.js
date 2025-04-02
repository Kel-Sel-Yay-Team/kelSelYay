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
      <h3>{label}</h3>
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
    </div>
  );
}

export default DetailRow;