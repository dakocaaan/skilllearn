
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import MaterialCard from "../components/MaterialCard";
import api from "../services/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      try {
        const response = await api.get("/favorites");
        setFavorites(response.data.favorites);
      } catch (err) {
        setError("Unable to load your favorites.");
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  return (
    <DashboardLayout>
      <header className="dashboard-header">
        <div>
          <p className="dashboard-overline">YOUR SAVED RESOURCES</p>
          <h1>My Favorites</h1>
        </div>
      </header>

      <p className="page-description">
        Keep your favorite learning materials in one place.
      </p>

      {loading ? (
        <div className="dashboard-status">Loading favorites...</div>
      ) : error ? (
        <div className="dashboard-status">{error}</div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={42} />
          <h2>No favorites yet</h2>
          <p>Explore courses and save materials you want to revisit.</p>
        </div>
      ) : (
        <div className="materials-grid">
          {favorites.filter(item => item.material).map((item) => (
            <MaterialCard
              key={item._id}
              material={item.material}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Favorites;
