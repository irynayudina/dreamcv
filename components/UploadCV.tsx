"use client";

import { useState } from "react";
import { useCVStore } from "@/store/cv-store";
import { parseCVAction } from "@/app/actions/parse-cv";

export default function UploadCV() {
  const { setCVData, setLoading, setError, isLoading, error, cvData } = useCVStore();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await parseCVAction(formData);
      if (result.success && result.data) {
        setCVData(result.data);
      } else {
        setError(result.error || "Failed to parse CV");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-500 transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-1 text-sm text-gray-600">
            {isLoading ? "Parsing..." : fileName ? `Selected: ${fileName}` : "Click to upload or drag and drop CV (PDF)"}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {cvData.personalInfo.name && !isLoading && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800">Successfully Parsed!</h3>
          <p className="text-sm text-green-700">Name: {cvData.personalInfo.name}</p>
          <p className="text-sm text-green-700">Email: {cvData.personalInfo.email}</p>
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Sections Found:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {cvData.experience.length > 0 && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Experience ({cvData.experience.length})</span>}
              {cvData.education.length > 0 && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Education ({cvData.education.length})</span>}
              {cvData.skills.length > 0 && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Skills ({cvData.skills.length})</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
