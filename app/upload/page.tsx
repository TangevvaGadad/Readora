'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setStatus(data.message);
    e.target.reset();
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📤 Upload a Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Book Title" required className="w-full p-2 border rounded" />
        <input name="author" placeholder="Author Name" required className="w-full p-2 border rounded" />
        <input name="pdf" type="file" accept=".pdf" required className="w-full p-2" />
        <input name="cover" type="file" accept="image/*" required className="w-full p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
