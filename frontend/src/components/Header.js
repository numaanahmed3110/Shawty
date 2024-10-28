import React, { useState, useEffect } from "react";
import { auth, provider } from "../firebase/config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
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
                className="mr-4 text-gray-300 hover:text-white"
              >
                Login
              </button>
              <button 
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register Now
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
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;