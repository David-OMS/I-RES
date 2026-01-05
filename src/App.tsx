import { useState } from 'react';
import ResumeEditor from './components/ResumeEditor';
import ResumeTemplate from './components/ResumeTemplate';
import SettingsPanel from './components/SettingsPanel';
import UploadCV from './components/UploadCV';
import { exportToPDF } from './utils/pdfExport';
import { Download, Eye, Edit2, Settings, Upload } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleExportPDF = async () => {
    try {
      // Switch to preview mode for better layout
      setViewMode('preview');
      // Small delay to ensure preview renders
      setTimeout(async () => {
        await exportToPDF('resume-container', 'resume.pdf');
      }, 300);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">I-RES</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit2 size={18} />
                Edit
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye size={18} />
                Preview
              </button>
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Upload size={18} />
              Upload CV
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'edit' ? (
          <>
            {/* Editor Panel */}
            <div className="w-1/2 border-r border-gray-200 overflow-hidden">
              <ResumeEditor />
            </div>
            {/* Preview Panel */}
            <div className="w-1/2 overflow-y-auto bg-gray-100 p-8">
              <div className="max-w-4xl mx-auto">
                <div id="resume-container" className="no-print">
                  <ResumeTemplate />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Full Preview Mode */
          <div className="w-full overflow-y-auto bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
              <div id="resume-container" className="no-print">
                <ResumeTemplate />
              </div>
            </div>
          </div>
        )}
      </div>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <UploadCV isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

export default App;

