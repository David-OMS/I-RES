import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { parsePDF, parseTextFile, parseCV } from '../utils/cvParser';
import { ResumeData } from '../types/resume';

const UploadCV: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setResumeData } = useResumeStore();

  if (!isOpen) return null;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      let text = '';

      if (file.type === 'application/pdf') {
        text = await parsePDF(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await parseTextFile(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }

      if (!text || text.trim().length === 0) {
        throw new Error('Could not extract text from the file. The file might be empty or corrupted.');
      }

      const parsedData = parseCV(text);
      
      console.log('Parsed data:', parsedData);
      
      // Merge with existing data - only update fields that were found
      const currentData = useResumeStore.getState().resumeData;
      const mergedData: ResumeData = {
        personalInfo: {
          ...currentData.personalInfo,
          ...(parsedData.personalInfo || {}),
        },
        summary: parsedData.summary !== undefined ? parsedData.summary : currentData.summary,
        workExperience: parsedData.workExperience || currentData.workExperience,
        education: parsedData.education || currentData.education,
        skills: parsedData.skills || currentData.skills,
        projects: parsedData.projects || currentData.projects || [],
        certifications: parsedData.certifications || currentData.certifications || [],
        languages: parsedData.languages || currentData.languages || [],
      };
      
      console.log('Merged data:', mergedData);
      setResumeData(mergedData);
      
      alert('CV uploaded successfully! Your resume has been populated. Please review and make any necessary adjustments.');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse CV. Please try again or manually enter your information.');
      console.error('CV parsing error:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload CV</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload your CV (PDF or TXT) and we'll automatically extract and populate your resume information.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="cv-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="cv-upload"
              className={`cursor-pointer flex flex-col items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload size={32} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {isProcessing ? 'Processing...' : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500">PDF or TXT files only</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Note:</strong> The parser works best with well-structured CVs.</p>
            <p>After uploading, please review all sections and make adjustments as needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCV;

