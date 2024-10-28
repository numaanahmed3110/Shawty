import React, { useState, useEffect } from "react";
import { auth, provider } from "../firebase/config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkIfUserExists = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const userExists = await checkIfUserExists(result.user.email);

      if (!userExists) {
        // Handle new user
        alert("You don't have an account. Please register first.");
        await signOut(auth);
        setUser(null);
      } else {
        // Existing user
        setUser(result.user);
      }
    } catch (error) {
      switch (error.code) {
        case "auth/cancelled-popup-request":
          console.log("Popup closed by user");
          break;
        case "auth/popup-blocked":
          alert("Please allow popups for this website");
          break;
        case "auth/popup-closed-by-user":
          console.log("Popup closed by user");
          break;
        default:
          alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const userExists = await checkIfUserExists(result.user.email);

      if (userExists) {
        alert("You already have an account. Please login instead.");
        await signOut(auth);
        setUser(null);
      } else {
        // Here you can add additional registration logic
        // like storing extra user data in your database
        setUser(result.user);
        alert("Registration successful!");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/cancelled-popup-request":
          console.log("Popup closed by user");
          break;
        case "auth/popup-blocked":
          alert("Please allow popups for this website");
          break;
        case "auth/popup-closed-by-user":
          console.log("Popup closed by user");
          break;
        default:
          alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-5xl font-bold text-pink-500">Shawty</h1>
        <div>
          {!user ? (
            <>
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`mr-4 text-gray-300 hover:text-white ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Login"}
              </button>
              <button
                onClick={handleRegister}
                disabled={loading}
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Register Now"}
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {user.displayName || user.email}
              </span>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={handleLogout}
                disabled={loading}
                className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Loading..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
