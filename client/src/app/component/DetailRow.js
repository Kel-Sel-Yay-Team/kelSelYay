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
    <div className="detail-row">
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
      
      <style jsx>{`
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
        
        .edit-input {
          width: 100%;
          background-color: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(100, 108, 255, 0.5);
          border-radius: 4px;
          color: white;
          padding: 8px 12px;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 8px rgba(100, 108, 255, 0.2);
        }
        
        .edit-input:focus {
          outline: none;
          border-color: #646cff;
          background-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 12px rgba(100, 108, 255, 0.4);
        }
        
        textarea.edit-input {
          resize: vertical;
          min-height: 80px;
        }
        .detail-row.editing {
          background: rgba(100, 108, 255, 0.1);
          border-left: 3px solid #646cff;
        }

      `}</style>
    </div>
  );
}

export default DetailRow;