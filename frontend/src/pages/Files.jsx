import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Files() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Fetch all uploaded files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/files');
      setFilesList(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch files');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // file type validation
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload PDF, JPG, PNG, or MP4 files.');
        setFile(null);
        e.target.value = ''; 
        return;
      }
      
      // file size - 50MB max (Here, can adjust the size)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File too large. Maximum size is 50MB.');
        setFile(null);
        e.target.value = ''; 
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  // Upload file
  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      console.log('Upload successful:', response.data);
      
      // Add the new file to the list
      setFilesList(prev => [response.data, ...prev]);
      
      // Reset form
      setFile(null);
      setProgress(0);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Download file
  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/download/${id}`, {
        responseType: 'blob',
      });
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  //Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    return '📁';
  };

  // Handle back
  const handleBack=()=>{
    navigate('/');
  }


  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-400 to-indigo-300">
      <h1 className="text-3xl font-bold mb-6 text-center">Course Content Upload System</h1>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Upload Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Click below to upload your content</h2>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={uploading}
              accept=".pdf,.jpg,.jpeg,.png,.mp4"
            />
            
            <button
              onClick={uploadFile}
              disabled={!file || uploading}
              className={`px-6 py-2 rounded text-white font-medium bg-purple-500 ${
                !file || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'hover:bg-purple-600'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          
          {/* Selected file info */}
          {file && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                Selected: {file.name} ({formatFileSize(file.size)})
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Files List Section */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading files...</p>
          </div>
        ) : filesList.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {filesList.map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{getFileIcon(file.fileType)}</span>
                    
                    <div>
                      <h3 className="font-medium text-gray-800">{file.fileName}</h3>
                      <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                        <span>Type: {file.fileType}</span>
                        <span>Size: {formatFileSize(file.fileSize)}</span>
                        <span>Uploaded: {formatDate(file.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadFile(file.id, file.fileName)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Refresh Button */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchFiles}
          className="bg-purple-800 hover:bg-purple-600 text-white text-sm"
        >
          Refresh List
        </button>
        <button
          onClick={handleBack}
          className="bg-purple-800 hover:bg-purple-600 text-white text-sm ml-4"
        >
          Back
        </button>
      </div>
    </div>
  );
}