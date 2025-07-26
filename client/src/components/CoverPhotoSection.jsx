import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';
import toast from 'react-hot-toast';

export default function CoverPhotoSection({ isEditing, tempCoverPhoto, setTempCoverPhoto, setCoverPhoto }) {
  const { coverPhoto, uploadCoverImage } = useProfile();

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload the file to server
        const imageUrl = await uploadCoverImage(file);
        setTempCoverPhoto(imageUrl);
        setCoverPhoto(imageUrl); // Update the actual cover photo immediately
        toast.success('Cover photo uploaded!');
      } catch (error) {
        console.error('Error uploading cover photo:', error);
        toast.error('Failed to upload cover photo');
      }
    }
  };

  return (
    <div className="cover-photo-wrapper">
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
        </div>
      )}
    </div>
  );
} 