
import { useEffect, useState } from "react";
import { Search, Sparkles, BookOpen, UserRound } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import MaterialCard from "../components/MaterialCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const categories = ["All", "Dutch", "Japanese"];

function Home() {
  const { user } = useAuth();

  const [materials, setMaterials] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchMaterials() {
      setLoading(true);
      setError("");

      try {
        const params = {};

        if (category !== "All") {
          params.category = category;
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        const response = await api.get("/materials", { params });

        if (!cancelled) {
          setMaterials(response.data.materials || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load learning materials."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(fetchMaterials, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, search]);

  return (
    <DashboardLayout>
      <header className="dashboard-header">
        <div>
          <p className="dashboard-overline">YOUR LEARNING DASHBOARD</p>
          <h1>Explore Courses</h1>
        </div>

        <div className="dashboard-user">
          <UserRound size={19} />
          <span>{user?.name || "Student"}</span>
        </div>
      </header>

      <section className="welcome-banner">
        <div className="welcome-text">
          <span className="welcome-eyebrow">
            <Sparkles size={15} />
            WELCOME TO SKILLLEARN
          </span>
          <h2>What will you learn today?</h2>
          <p>
            Discover practical skills, explore languages, and
            grow your knowledge at your own pace.
          </p>
        </div>
        <div className="welcome-illustration">
          <BookOpen size={92} strokeWidth={1.2} />
        </div>
      </section>

      <section className="learning-section">
        <div className="section-heading">
          <div>
            <h2>Discover learning materials</h2>
            <p>Find something interesting to learn.</p>
          </div>
        </div>

        <div className="search-box">
          <Search size={20} />
          <input
            type="search"
            placeholder="Search courses, topics, or skills..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search learning materials"
          />
        </div>

        <div className="category-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={`category-button ${
                category === item ? "selected" : ""
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-status">Loading materials...</div>
        ) : error ? (
          <div className="dashboard-status error-message">{error}</div>
        ) : materials.length === 0 ? (
          <div className="dashboard-status">
            No learning materials found. Try another search.
          </div>
        ) : (
          <>
            <p className="results-count">
              {materials.length} learning materials found
            </p>
            <div className="materials-grid">
              {materials.map((material) => (
                <MaterialCard
                  key={material._id}
                  material={material}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}

export default Home;
