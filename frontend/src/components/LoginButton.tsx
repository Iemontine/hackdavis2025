import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, getIdTokenClaims } =
    useAuth0();

  useEffect(() => {
    const saveUserToBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getIdTokenClaims();
          const response = await fetch("http://localhost:8000/users/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token?.__raw || ""}`,
            },
            body: JSON.stringify({
              auth0_id: user.sub,
              name: user.name,
              email: user.email,
              preferences: {}, // Add default or user-specific preferences here
            }),
          });

          if (!response.ok) {
            console.error("Failed to save user:", await response.json());
          }
        } catch (error) {
          console.error("Error saving user to backend:", error);
        }
      }
    };

    saveUserToBackend();
  }, [isAuthenticated, user]);

  return (
    <div className="flex items-center">
      {user && user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <span className="text-gray-800 font-medium">
        {user ? user.name : "Guest"}
      </span>
      {user ? (
        <button
          onClick={() => logout()}
          className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Log Out
        </button>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default LoginButton;
