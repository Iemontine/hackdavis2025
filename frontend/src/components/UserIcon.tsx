import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { user, loginWithRedirect } = useAuth0();

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
      <button
        onClick={() => loginWithRedirect()}
        className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {user ? "Log Out" : "Log In"}
      </button>
    </div>
  );
};

export default LoginButton;
