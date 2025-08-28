import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { useState } from "react";
import { updateProfile, deleteUser } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName });
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { displayName });
      setUser({ ...user, displayName }); // Update context
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? `Failed to update profile: ${err.message}` : "Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        const userDoc = doc(db, "users", user.uid);
        await deleteDoc(userDoc);
        await deleteUser(user);
        navigate("/");
      } catch (err) {
        setError(err instanceof Error ? `Failed to delete account: ${err.message}` : "Failed to delete account. You may need to re-login.");
      }
    }
  };

  return (
    <div className="app-container">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      {!editing ? (
        <>
          <p>Email: {user.email}</p>
          <p>Name: {user.displayName || "N/A"}</p>
          <button className="product-button" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
          <button className="product-button" onClick={handleDelete} style={{ backgroundColor: "red" }}>
            Delete Account
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Name"
          />
          <button type="submit" className="product-button">
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)} className="product-button">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;