// components/ProfileSubmission.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaUpload,
} from "react-icons/fa";
import { communityApi } from "../api/api";
import "../styles/ProfileSubmission.css";

const ProfileSubmission = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    whatTheyDo: "",
    description: "",
    domain: "",
    instagram: "",
    linkedin: "",
    website: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.whatTheyDo.trim()) {
      newErrors.whatTheyDo = "This field is required";
    } else if (formData.whatTheyDo.split("\n").length > 2) {
      newErrors.whatTheyDo = "Maximum 2 lines allowed";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // URL validations
    if (formData.instagram && !isValidUrl(formData.instagram)) {
      newErrors.instagram = "Please enter a valid URL";
    }

    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid URL";
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    return newErrors;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size too large. Maximum 50MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // components/ProfileSubmission.jsx - Update handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create profile data WITHOUT the image
      const profileData = {
        name: formData.name,
        whatTheyDo: formData.whatTheyDo,
        description: formData.description,
        domain: formData.domain,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        website: formData.website,
        phone: formData.phone,
        // DO NOT include profileImage here
      };

      // First create the profile (without image)
      const response = await communityApi.createProfile(profileData);
      console.log("Profile created:", response);

      // Check if we got a valid response with data
      if (response?.data && response.data[0]?.guid) {
        const profileGuid = response.data[0].guid;

        // If there's a file, upload it separately
        if (selectedFile) {
          try {
            const uploadResponse = await communityApi.uploadProfilePicture(
              profileGuid,
              selectedFile,
            );
            console.log("Upload response:", uploadResponse);
            toast.success("Profile and image uploaded successfully!");
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.warning(
              "Profile created but image upload failed. You can upload later.",
            );
          }
        } else {
          toast.success("Profile submitted successfully!");
        }

        // Navigate after a short delay
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.msg || "Failed to submit profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submission-container">
      <div className="submission-header">
        <h1>Join Our Community</h1>
        <p>Share your profile and connect with community members</p>
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="whatTheyDo">
            What they are / what they do <span className="required">*</span>
            <span className="char-hint">(max 2 lines)</span>
          </label>
          <textarea
            id="whatTheyDo"
            name="whatTheyDo"
            value={formData.whatTheyDo}
            onChange={handleChange}
            className={errors.whatTheyDo ? "error" : ""}
            placeholder="e.g., Current role or professional focus"
            rows="2"
          />
          {errors.whatTheyDo && (
            <span className="error-text">{errors.whatTheyDo}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="domain">Domain / Specialization</label>
          <input
            type="text"
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="e.g., Primary domain or area of expertise"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            How they can help the community <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "error" : ""}
            placeholder="Brief description of how you can contribute or support others"
            rows="4"
          />
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image (Max 50MB)</label>
          <div className="image-upload">
            <input
              type="file"
              id="profileImage"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleImageUpload}
              className="file-input"
            />
            <label htmlFor="profileImage" className="file-label">
              <FaUpload />
              Choose Image
            </label>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Social Links (Optional)</h3>

          <div className="form-group">
            <label htmlFor="instagram">
              <FaInstagram className="input-icon" />
              Instagram URL
            </label>
            <input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className={errors.instagram ? "error" : ""}
              placeholder="https://instagram.com/username"
            />
            {errors.instagram && (
              <span className="error-text">{errors.instagram}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">
              <FaLinkedin className="input-icon" />
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className={errors.linkedin ? "error" : ""}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedin && (
              <span className="error-text">{errors.linkedin}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="website">
              <FaGlobe className="input-icon" />
              Website / Other URL
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={errors.website ? "error" : ""}
              placeholder="https://example.com"
            />
            {errors.website && (
              <span className="error-text">{errors.website}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone className="input-icon" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSubmission;
