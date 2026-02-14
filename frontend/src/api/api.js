// api/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Your backend URL

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
);

export const communityApi = {
    // Get all profiles with pagination and search
    getProfiles: async (page = 1, pageSize = 50, searchString = "") => {
        try {
            const response = await api.post("/getAllProfile", {
                page,
                pageSize,
                searchString
            });
            return {
                data: response.data.data,
                total: response.data.Total
            };
        } catch (error) {
            console.error('Error fetching profiles:', error);
            throw error;
        }
    },

    // Create a new profile
    createProfile: async (profileData) => {
        try {
            // Map frontend field names to backend field names
            const backendData = {
                full_name: profileData.name,
                short_intro: profileData.whatTheyDo,
                community_help: profileData.description,
                instagram_url: profileData.instagram,
                linkedin_url: profileData.linkedin,
                website_url: profileData.website,
                phone_number: profileData.phone,
                profile_image_url: profileData.profileImage,
                domain: "" // You can add domain field if needed
            };

            const response = await api.post("/saveProfile", backendData);
            return response.data;
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    },

    // Get a single profile by GUID
    getProfileById: async (guid) => {
        try {
            const response = await api.get(`/getProfile/${guid}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    // Upload profile picture
    // api/api.js - Update uploadProfilePicture function

    uploadProfilePicture: async (userId, file) => {
        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await api.post(`/${userId}/upload-profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw error.response?.data || error;
        }
    }
};