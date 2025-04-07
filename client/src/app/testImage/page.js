"use client"

import { useState } from "react";

export default function ImageTest() {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [status, setStatus] = useState("");
  
    const submit = async (event) => {
      event.preventDefault();
      if (!file) {
        setStatus("Please select an image.");
        return;
      }
  
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
  
      try {
        const res = await fetch("http://localhost:3002/api/reports/testImage", {
          method: "POST",
          body: formData,
        });
  
        if (!res.ok) throw new Error("Upload failed");
  
        const data = await res.json();
        setStatus("Upload successful!");
        console.log(data); // Can contain URL or status
      } catch (err) {
        setStatus("Upload failed.");
        console.error(err);
      }
    };
  
    return (
      <form onSubmit={submit} className="flex flex-col gap-2 p-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          type="text"
          placeholder="Caption"
          className="border p-1"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
        {status && <p>{status}</p>}
      </form>
    );
  }