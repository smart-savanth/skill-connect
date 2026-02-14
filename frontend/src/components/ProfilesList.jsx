// components/ProfilesList.jsx
import React, { useState, useEffect } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaUser,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { communityApi } from "../api/api";
import "../styles/ProfilesList.css";

const ProfilesList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    // Client-side filtering as backup, but backend also handles search
    if (searchTerm.trim() === "") {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(
        (profile) =>
          profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.short_intro
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          profile.domain?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProfiles(filtered);
    }
  }, [searchTerm, profiles]);

  const fetchProfiles = async (search = "") => {
    try {
      setLoading(true);
      const response = await communityApi.getProfiles(1, 50, search);

      // Log the first few image URLs to see what's in the database
      if (response.data && response.data.length > 0) {
        console.log("Sample image URLs from DB:");
        response.data.slice(0, 3).forEach((p) => {
          console.log(`Profile ${p.full_name}:`, p.profile_image_url);
        });
      }

      setProfiles(response.data);
      setFilteredProfiles(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError("Failed to load profiles. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Optional: Debounce this to avoid too many API calls
    fetchProfiles(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchProfiles("");
  };

  const openModal = (profile) => {
    setSelectedProfile(profile);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProfile(null);
    document.body.style.overflow = "unset";
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.log("No image URL provided");
      return null;
    }

    console.log("Original image URL from DB:", imageUrl);

    let finalUrl = imageUrl;

    // If it's already a full HTTP URL
    if (imageUrl.startsWith("http")) {
      finalUrl = imageUrl;
    }
    // If it starts with undefined
    else if (imageUrl.startsWith("undefined")) {
      finalUrl = imageUrl.replace("undefined", "http://localhost:3000");
    }
    // If it starts with a slash
    else if (imageUrl.startsWith("/")) {
      finalUrl = `http://localhost:3000${imageUrl}`;
    }
    // Just the filename
    else {
      finalUrl = `http://localhost:3000/profilePictures/${imageUrl}`;
    }

    console.log("Final URL being used:", finalUrl);

    // Test if the image loads
    const img = new Image();
    img.onload = () => console.log("Image loaded successfully:", finalUrl);
    img.onerror = () => console.error("Image failed to load:", finalUrl);
    img.src = finalUrl;

    return finalUrl;
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profiles-container">
      <div className="profiles-header">
        <h1>Community Members</h1>
        <p className="total-count">{totalCount} members in community</p>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, role, or domain..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={clearSearch}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="no-profiles">
          <FaUser className="no-profiles-icon" />
          <h3>No profiles found</h3>
          <p>
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : "Be the first to join our community!"}
          </p>
          {searchTerm && (
            <button className="btn btn-secondary" onClick={clearSearch}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="profiles-grid">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.guid}
                className="profile-card"
                onClick={() => openModal(profile)}
              >
                <div className="profile-image-wrapper">
                  {profile.profile_image_url ? (
                    <img
                      src={getImageUrl(profile.profile_image_url)}
                      alt={profile.full_name}
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <FaUser />
                    </div>
                  )}
                </div>

                <div className="profile-content">
                  <h2 className="profile-name">{profile.full_name}</h2>
                  <p className="profile-role">{profile.short_intro}</p>
                  <p className="profile-help">{profile.community_help}</p>
                  {profile.domain && (
                    <span className="profile-domain">{profile.domain}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedProfile && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>

                <div className="modal-layout">
                  <div className="modal-image-wrapper">
                    {selectedProfile.profile_image_url ? (
                      <img
                        src={getImageUrl(selectedProfile.profile_image_url)}
                        alt={selectedProfile.full_name}
                        className="modal-image"
                      />
                    ) : (
                      <div className="modal-image-placeholder">
                        <FaUser />
                      </div>
                    )}
                  </div>

                  <div className="modal-info">
                    <h2 className="modal-name">{selectedProfile.full_name}</h2>
                    <p className="modal-role">{selectedProfile.short_intro}</p>

                    {selectedProfile.domain && (
                      <p className="modal-domain">
                        Domain: {selectedProfile.domain}
                      </p>
                    )}

                    <div className="modal-section">
                      <h3>About</h3>
                      <p className="modal-description">
                        {selectedProfile.community_help}
                      </p>
                    </div>

                    {(selectedProfile.instagram_url ||
                      selectedProfile.linkedin_url ||
                      selectedProfile.website_url ||
                      selectedProfile.phone_number) && (
                      <div className="modal-section">
                        <h3>Connect</h3>
                        <div className="modal-links">
                          {selectedProfile.instagram_url && (
                            <a
                              href={selectedProfile.instagram_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="modal-link instagram"
                            >
                              <FaInstagram /> Instagram
                            </a>
                          )}
                          {selectedProfile.linkedin_url && (
                            <a
                              href={selectedProfile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="modal-link linkedin"
                            >
                              <FaLinkedin /> LinkedIn
                            </a>
                          )}
                          {selectedProfile.website_url && (
                            <a
                              href={selectedProfile.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="modal-link website"
                            >
                              <FaGlobe /> Website
                            </a>
                          )}
                          {selectedProfile.phone_number && (
                            <a
                              href={`tel:${selectedProfile.phone_number}`}
                              className="modal-link phone"
                            >
                              <FaPhone /> {selectedProfile.phone_number}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilesList;
