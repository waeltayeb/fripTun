import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (token) {
                try {
                    const roleValue = JSON.parse(role);
                    setIsAuthenticated(true);
                    setIsClient(roleValue === "client");
                } catch (error) {
                    // Handle invalid role format
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    setIsAuthenticated(false);
                    setIsClient(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsClient(false);
            }
        };

        checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to unauthorized page if authenticated but not a client
    if (!isClient) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated and is a client, render the protected content
    return children;
};

export default ProtectedRoute;
