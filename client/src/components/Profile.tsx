import { useProfile } from "../features/user/hooks/useProfile.ts";
import { useState } from "react";

export function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [nameInput, setNameInput] = useState("");

  if (isLoading) return <div>Loading account profiles...</div>;

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    try {
      await updateProfile({ name: nameInput });
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to modify details.");
    }
  };

  return (
    <div className="page active">
      <div className="section-title">👤 Profile Dashboard</div>

      <div className="profile-header">
        <div className="profile-avatar">{profile?.name?.[0].toUpperCase()}</div>
        <div className="profile-info">
          <div className="profile-name">{profile?.name}</div>
          <div className="profile-email">{profile?.email}</div>
          <div className="profile-role">{profile?.role}</div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Edit Information</h3>
          <form onSubmit={handleUpdateInfo}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder={profile?.name}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isUpdating} className="btn-save">
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
