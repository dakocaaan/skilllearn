
import { useEffect, useState } from "react";
import {
  UserRound,
  BookOpen,
  Heart,
  Clock3,
  Save,
  Mail,
  CalendarDays
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalFavorites: 0,
    totalStarted: 0
  });

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await api.get("/profile");

        if (!cancelled) {
          setProfile(response.data.user);
          setName(response.data.user.name);
          setStats(response.data.stats);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load your profile.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await api.put("/profile", {
        name: name.trim()
      });

      setProfile(response.data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Profile updated successfully!");

      // Refresh to synchronize the name across the app.
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-status">Loading profile...</div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="dashboard-status">
          {error || "Profile unavailable."}
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: "Available courses",
      value: stats.totalMaterials,
      icon: BookOpen
    },
    {
      label: "My Favorites",
      value: stats.totalFavorites,
      icon: Heart
    },
    {
      label: "Resources Started",
      value: stats.totalStarted,
      icon: Clock3
    }
  ];

  return (
    <DashboardLayout>
      <header className="dashboard-header">
        <div>
          <p className="dashboard-overline">ACCOUNT SETTINGS</p>
          <h1>My Profile</h1>
        </div>
      </header>

      <div className="profile-header-card">
        <div className="profile-avatar">
          <UserRound size={38} />
        </div>

        <div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <span className="profile-member-label">
            SkillLearn Student
          </span>
        </div>
      </div>

      <div className="profile-stats-grid">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div className="profile-stat-card" key={label}>
            <div className="profile-stat-icon">
              <Icon size={23} />
            </div>
            <div>
              <strong>{value}</strong>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="profile-settings-card">
        <h2>Account Information</h2>
        <p className="profile-settings-description">
          Update your personal information.
        </p>

        <form onSubmit={handleSave}>
          <label htmlFor="profile-name">Full name</label>

          <div className="profile-input-wrapper">
            <UserRound size={18} />
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <label htmlFor="profile-email">Email address</label>

          <div className="profile-input-wrapper disabled">
            <Mail size={18} />
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              disabled
            />
          </div>

          <p className="profile-help-text">
            Email changes are not supported in this version.
          </p>

          <div className="profile-joined">
            <CalendarDays size={17} />
            Member since{" "}
            {new Date(profile.createdAt).toLocaleDateString()}
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          {message && (
            <p className="profile-success-message">{message}</p>
          )}

          <button
            className="profile-save-button"
            type="submit"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default Profile;
