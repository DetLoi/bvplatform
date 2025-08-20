import { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';
import toast from 'react-hot-toast';
import CoverPhotoEditor from './CoverPhotoEditor';
import { createPortal } from 'react-dom';

export default function CoverPhotoSection({ isEditing, tempCoverPhoto, setTempCoverPhoto, setCoverPhoto }) {
  const { coverPhoto, uploadCoverImage } = useProfile();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorUrl, setEditorUrl] = useState('');
  const [objectUrl, setObjectUrl] = useState(null);
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [wrapperEl, setWrapperEl] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (!wrapperEl) return;
    const update = () => {
      const rect = wrapperEl.getBoundingClientRect();
      setFrameSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapperEl);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [wrapperEl]);

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Open the crop editor with a local object URL
    try {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      setEditorUrl(url);
      setIsEditorOpen(true);
    } catch (error) {
      console.error('Error preparing editor:', error);
      toast.error('Failed to open editor');
    }
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditorUrl('');
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
  };

  const handleEditorSubmit = async ({ blob /*, dataUrl, transform */ }) => {
    try {
      const file = new File([blob], 'cover.png', { type: 'image/png' });
      const previousUrl = tempCoverPhoto || coverPhoto || '';
      const imageUrl = await uploadCoverImage(file, previousUrl);
      setTempCoverPhoto(imageUrl);
      setCoverPhoto(imageUrl);
      toast.success('Cover photo updated!');
      closeEditor();
    } catch (error) {
      console.error('Error uploading cropped cover:', error);
      toast.error('Failed to upload cropped cover');
    }
  };

  return (
    <div
      className={`cover-photo-wrapper ${isEditing ? 'editable' : ''}`}
      ref={setWrapperEl}
      onClick={() => {
        if (isEditing && !isEditorOpen && fileInputRef.current) {
          fileInputRef.current.click();
        }
      }}
      role={isEditing ? 'button' : undefined}
      aria-label={isEditing ? 'Change cover photo' : undefined}
      tabIndex={isEditing ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isEditing) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (fileInputRef.current) fileInputRef.current.click();
        }
      }}
    >
      {tempCoverPhoto || coverPhoto ? (
        <img
          src={tempCoverPhoto || coverPhoto}
          alt="Cover"
          className="cover-photo"
          onError={(e) => {
            console.error('Failed to load cover photo:', tempCoverPhoto || coverPhoto);
            e.target.style.display = 'none';
          }}
          onLoad={() => console.log('Cover photo loaded successfully:', tempCoverPhoto || coverPhoto)}
        />
      ) : (
        <div className="cover-photo-placeholder">
          <span>Upload Cover</span>
        </div>
      )}
      {isEditing && (
        <div className="cover-hover">
          Upload new cover
        </div>
      )}
      {isEditing && (
        <div className="cover-edit-controls">
          <label className="edit-icon-cover" tabIndex={0} aria-label="Edit cover photo">
            <FaEdit />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              hidden
            />
          </label>
          {/* Hidden global input for mobile/full-cover click */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {isEditorOpen && createPortal(
        (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px',
           
            }}
          >
            <div
              style={{
                background: '#111',
                borderRadius: '16px',
                padding: '16px',
                color: '#fff',
                maxWidth: '94vw',
                height: '100vh',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Adjust cover</h3>
                <button onClick={closeEditor} style={{ background: 'transparent', color: '#fff', border: '1px solid #444', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}>Close</button>
              </div>
              <CoverPhotoEditor
                frameWidth={frameSize.w || 800}
                frameHeight={frameSize.h || 300}
                initialImageUrl={editorUrl}
                onSubmit={handleEditorSubmit}
              />
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
} 