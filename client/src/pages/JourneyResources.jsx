import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import ResourceUploadSection from '../sections/ResourceUploadSection';
import ResourceListSection from '../sections/ResourceListSection';
import AddLinkModal from '../components/AddLinkModal';
import { getJourney, addResource, deleteResource } from '../services/journeyService';

// Helper to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return null;
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to map backend resources to frontend format
const mapBackendResources = (backendResources) => {
  return (backendResources || []).map(res => {
    let type = res.type;
    if (type === 'document' && res.filename?.toLowerCase().endsWith('.pdf')) {
      type = 'pdf';
    } else if (type === 'document') {
      type = 'doc';
    }

    return {
      id: res._id,
      type: type,
      name: res.filename || 'Untitled',
      size: formatFileSize(res.size),
      uploadedAt: new Date(res.uploadedAt).toISOString().split('T')[0],
      url: res.url
    };
  }).reverse();
};

const JourneyResources = () => {
  const { id: journeyId } = useParams();
  
  // State management
  const [journey, setJourney] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch journey resources on mount
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getJourney(journeyId);
      if (response.success) {
        setJourney(response.data.journey);
        setResources(mapBackendResources(response.data.journey.resources));
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [journeyId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const processFiles = async (files) => {
    const toastId = toast.loading("Uploading files...");
    try {
      let updatedJourney = null;
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await addResource(journeyId, formData);
        if (response.success) {
          updatedJourney = response.data.journey || response.data;
        }
      }

      if (updatedJourney) {
        setJourney(updatedJourney);
        setResources(mapBackendResources(updatedJourney.resources));
        toast.update(toastId, { render: "Files uploaded successfully", type: "success", isLoading: false, autoClose: 3000 });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.update(toastId, { render: error.response?.data?.message || "Failed to upload files", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleLinkSubmit = async () => {
    if (!linkUrl.trim()) return;
    
    try {
      setLoading(true);
      const payload = {
        type: 'link',
        url: linkUrl.trim(),
        filename: linkName.trim() || linkUrl.trim()
      };
      
      const response = await addResource(journeyId, payload);
      if (response.success) {
        const updatedJourney = response.data.journey || response.data;
        setJourney(updatedJourney);
        setResources(mapBackendResources(updatedJourney.resources));
        
        setLinkUrl('');
        setLinkName('');
        setShowUploadModal(false);
        toast.success("Link added successfully");
      }
    } catch (error) {
      console.error('Add link error:', error);
      toast.error(error.response?.data?.message || "Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const response = await deleteResource(journeyId, id);
      if (response.success) {
        const updatedJourney = response.data.journey || response.data;
        setJourney(updatedJourney);
        setResources(mapBackendResources(updatedJourney.resources));
        toast.success("Resource deleted");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "Failed to delete resource");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      <Sidebar />
      <main className="lg:ml-80 p-6 min-h-screen relative bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <HiSparkles style={{ color: 'var(--primary)' }} className="w-6 h-6" />
              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                Learning Materials
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              {journey ? `${journey.title} Resources` : 'Resources'}
            </h1>
            <p className="text-lg opacity-60" style={{ color: 'var(--text)' }}>
              Upload and organize all your learning materials in one place
            </p>
          </motion.div>

          {/* Upload Section */}
          <ResourceUploadSection 
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleFileUpload={handleFileUpload}
            onAddLink={() => setShowUploadModal(true)}
          />

          {/* List Section */}
          <ResourceListSection 
            resources={resources}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        {/* Modals */}
        <AddLinkModal 
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          linkName={linkName}
          setLinkName={setLinkName}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          onSubmit={handleLinkSubmit}
        />
      </main>
    </div>
  );
};

export default JourneyResources;