import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore'; // Get user ID
import { userApi } from '@/services/api'; // Use user API service
import { UserDto } from '@/types'; // Import UserDto type
import { Loader, Mail, User, Phone, MapPin } from 'lucide-react'; // Import icons
import axios from 'axios'; // Import axios to use isAxiosError

function UserProfilePage() {
    // Get the authenticated user and auth state from the store
    const { user: loggedInUser, isAuthenticated } = useAuthStore();
    const [profile, setProfile] = useState<UserDto | null>(null); // State to hold fetched user profile
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Effect to fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            // If not authenticated or user ID is missing, show an error/message
            if (!isAuthenticated || !loggedInUser?.id) {
                setError('User not logged in.'); // Should be caught by ProtectedRoute, but good fallback
                setIsLoading(false);
                setProfile(null); // Clear profile state
                return;
            }

            setIsLoading(true);
            setError(null); // Clear previous errors
            try {
                // Use the user ID to fetch the full profile details
                const response = await userApi.getProfile(loggedInUser.id);
                setProfile(response.data); // Set the fetched profile data
            } catch (err: unknown) { // Type the catch variable as unknown
                console.error('Error fetching user profile:', err);
                // Check if it's an Axios error for more specific feedback
                if (axios.isAxiosError(err)) {
                    // Use backend error message if available, otherwise use generic message
                    const backendErrorMessage = err.response?.data?.message || err.message;
                    setError(`Failed to load profile: ${backendErrorMessage}`);
                } else {
                    // Handle non-Axios errors
                    setError('An unexpected error occurred while loading the profile.');
                }
                setProfile(null); // Clear profile state on error
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch profile only if user is authenticated and has an ID
        // The dependency array ensures this runs when loggedInUser?.id or isAuthenticated changes
        fetchProfile();
    }, [loggedInUser?.id, isAuthenticated]);


    // --- Render States ---

    // Show loading state
    if (isLoading) {
        return (
            // Use min-h-screen or similar with header height adjustment for better centering
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-700">Loading profile...</span>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            // Use min-h-screen or similar with header height adjustment for better centering
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    // Show profile data if successfully loaded
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-8">My Profile</h1>

            {/* Render profile details if profile data exists */}
            {profile ? (
                <div className="bg-white p-6 rounded-lg shadow space-y-6">
                    <div className="flex items-center space-x-4">
                        {/* Basic user icon placeholder */}
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                            <p className="text-gray-600">User ID: {profile.id}</p>
                        </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                        {/* Email */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2"><Mail className="h-5 w-5 text-gray-500" /> Email</h3>
                            <p className="text-gray-700 pl-7">{profile.email}</p> {/* Add padding to align with icon */}
                        </div>

                        {/* Contact Number */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2"><Phone className="h-5 w-5 text-gray-500" /> Contact Information</h3>
                            <p className="text-gray-700 pl-7">{profile.phoneNumber || 'N/A'}</p>
                        </div>

                        {/* Address */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-gray-500" /> Shipping Address</h3>
                            <p className="text-gray-700 pl-7">{profile.address || 'Address not provided'}</p>
                        </div>
                    </div>

                    {/* Optional: Add buttons for editing profile or viewing orders */}
                    {/* <div className="mt-6 flex space-x-4">
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Edit Profile</button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">View Orders</button>
                    </div> */}

                    {/* Display creation/update dates */}
                    <div className="border-t pt-4 text-sm text-gray-500 space-y-1">
                        <p>Account created: {new Date(profile.createdAt).toLocaleDateString()} at {new Date(profile.createdAt).toLocaleTimeString()}</p>
                        {profile.updatedAt && (
                            <p>Last updated: {new Date(profile.updatedAt).toLocaleDateString()} at {new Date(profile.updatedAt).toLocaleTimeString()}</p>
                        )}
                    </div>

                </div>
            ) : (
                // This case should primarily be handled by the error state, but as a final fallback
                <div className="text-center py-12">
                    <p className="text-gray-600">User profile data is not available.</p>
                </div>
            )}
        </div>
    );
}

export default UserProfilePage; // Export the component as default