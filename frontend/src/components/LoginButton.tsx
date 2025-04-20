import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, getIdTokenClaims } =
    useAuth0();

  useEffect(() => {
    const saveUserToBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getIdTokenClaims();
          const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/users/`, {
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
  }, [isAuthenticated, user, getIdTokenClaims]);

  return (
    <div className="flex items-center">
      {isAuthenticated && user ? (
        <div className="flex items-center">
          {user.picture && (
            <div className="relative">
              <img
                src={user.picture}
                alt={user.name || "User"}
                className="w-9 h-9 rounded-full border-2 border-blue-400/50"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-slate-800"></div>
            </div>
          )}
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-medium text-white/90">
              {user.name}
            </span>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="text-xs text-blue-300 hover:text-white text-left transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default LoginButton;
