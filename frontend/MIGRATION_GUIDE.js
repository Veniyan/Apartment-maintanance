/* eslint-disable */
/**
 * INSTRUCTIONS FOR UPDATING YOUR DASHBOARD COMPONENTS
 * =====================================================
 * 
 * Replace all fetch() calls in UserDashboard.jsx and AdminDashboard.jsx
 * with the api utility functions shown below.
 */

// 1. Add this import at the top of your dashboard files:
import { api, logout, isAuthenticated } from '../utils/api';

// 2. Update the authentication check in useEffect:
useEffect(() => {
    if (!isAuthenticated()) {
        navigate('/');
        return;
    }
    
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    if (storedRole !== 'USER') { // or 'ADMIN' for AdminDashboard
        navigate('/');
    } else {
        setUser(storedUser);
        fetchRequests(storedUser);
    }
}, [navigate]);

// 3. Update handleLogout:
const handleLogout = () => {
    logout(); // This will clear storage and redirect
};

// 4. Replace fetch calls with api utility:

// OLD:
const fetchRequests = async (username) => {
    try {
        const response = await fetch(`http://localhost:8081/api/maintenance/user/${username}`);
        if (response.ok) {
            const data = await response.json();
            setRequests(data);
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
    }
};

// NEW:
const fetchRequests = async (username) => {
    try {
        const response = await api.get(`/maintenance/user/${username}`);
        if (response.ok) {
            const data = await response.json();
            setRequests(data);
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        // Error handling for 401/403 is automatic in api utility
    }
};

// 5. For POST requests:

// OLD:
const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:8081/api/maintenance?username=${user}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRequest),
        });
        if (response.ok) {
            // ...
        }
    } catch (error) {
        // ...
    }
};

// NEW:
const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post(`/maintenance?username=${user}`, newRequest);
        if (response.ok) {
            // ...
        }
    } catch (error) {
        // ...
    }
};

// 6. For file uploads:

// OLD:
const formData = new FormData();
formData.append('file', selectedFile);
const uploadResponse = await fetch('http://localhost:8081/api/files/upload', {
    method: 'POST',
    body: formData,
});

// NEW:
const formData = new FormData();
formData.append('file', selectedFile);
const uploadResponse = await api.postFile('/files/upload', formData);

// 7. For PUT requests:

// OLD:
const response = await fetch(`http://localhost:8081/api/maintenance/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
});

// NEW:
const response = await api.put(`/maintenance/${id}`, updatedData);

// 8. For DELETE requests:

// OLD:
const response = await fetch(`http://localhost:8081/api/payments/${id}`, {
    method: 'DELETE',
});

// NEW:
const response = await api.delete(`/payments/${id}`);

/**
 * KEY CHANGES TO MAKE IN BOTH DASHBOARD FILES:
 * 
 * 1. Import the api utility at the top
 * 2. Replace all fetch() calls with api.get/post/put/delete
 * 3. Remove 'http://localhost:8081/api' from URLs (it's in the utility)
 * 4. Remove manual header construction (JWT is added automatically)
 * 5. Use logout() function instead of manual localStorage clearing
 * 
 * The api utility automatically:
 * - Adds JWT token to all requests
 * - Handles 401 (redirects to login)
 * - Handles 403 (shows permission error)
 * - Sets proper headers
 */
