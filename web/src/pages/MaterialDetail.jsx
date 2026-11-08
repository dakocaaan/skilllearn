
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Globe,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle,
  Heart
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function MaterialDetail() {
  const { id } = useParams();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkFavorite() {
      try {
        const response = await api.get("/favorites");

        const saved = response.data.favorites.some(
          (item) => item.material?._id === id
        );

        if (!cancelled) setIsFavorite(saved);
      } catch (err) {
        console.error("Failed to check favorites", err);
      }
    }

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleFavorite = async () => {
    if (!material || favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${material._id}`);
        setIsFavorite(false);
      } else {
        await api.post("/favorites", {
          materialId: material._id
        });
        setIsFavorite(true);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update favorites."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const recordLearning = () => {
    if (!material) return;

    // The link opens normally even if recording fails.
    api.post("/history", {
      materialId: material._id
    }).catch((err) => {
      console.error("Unable to record learning activity", err);
    });
  };



  useEffect(() => {
    let cancelled = false;

    async function fetchMaterial() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/materials/${id}`);

        if (!cancelled) {
          setMaterial(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load this learning material."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMaterial();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="detail-state">
          Loading learning material...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !material) {
    return (
      <DashboardLayout>
        <div className="detail-state">
          <AlertCircle size={36} />
          <h2>Material not found</h2>
          <p>{error || "This material is unavailable."}</p>
          <Link to="/" className="detail-back-link">
            <ArrowLeft size={17} /> Back to courses
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isDutch = material.category === "Dutch";

  const fallbackImage = isDutch
    ? "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200"
    : "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200";

  return (
    <DashboardLayout>
      <div className="detail-page">
        <Link to="/" className="detail-back-link">
          <ArrowLeft size={18} />
          Back to courses
        </Link>

        <div className="detail-hero">
          <img
            src={material.thumbnail || fallbackImage}
            alt={material.title}
            className="detail-hero-image"
          />
          <div className="detail-hero-overlay">
            <span className="detail-hero-label">
              SKILLLEARN LEARNING LIBRARY
            </span>
          </div>
        </div>

        <div className="detail-tags">
          <span className="detail-tag primary">
            <Globe size={15} />
            {material.category}
          </span>

          <span className="detail-tag">
            <GraduationCap size={15} />
            {material.level}
          </span>

          <span className="detail-tag">
            <Layers size={15} />
            {material.type}
          </span>
        </div>

        <h1 className="detail-title">{material.title}</h1>

        <p className="detail-intro">
          {material.description}
        </p>

        <div className="detail-content-grid">
          <section className="detail-main-content">
            <div className="detail-section-card">
              <h2>
                <BookOpen size={22} />
                About this learning material
              </h2>

              <p>{material.description}</p>

              <p>
                This resource is part of the SkillLearn
                learning library. You can explore the
                material through its original learning
                provider.
              </p>
            </div>

            <div className="detail-section-card">
              <h2>
                <CheckCircle2 size={22} />
                How to get started
              </h2>

              <ol className="learning-steps">
                <li>Review the material information and difficulty level.</li>
                <li>Click the Start Learning button.</li>
                <li>Study the content on the original provider's website.</li>
                <li>Return to SkillLearn to explore more resources.</li>
              </ol>
            </div>
          </section>

          <aside className="detail-info-card">
            <h2>Course information</h2>

            <div className="detail-info-row">
              <span>Category</span>
              <strong>{material.category}</strong>
            </div>

            <div className="detail-info-row">
              <span>Level</span>
              <strong>{material.level}</strong>
            </div>

            <div className="detail-info-row">
              <span>Content type</span>
              <strong className="capitalize">{material.type}</strong>
            </div>

            <div className="detail-info-row">
              <span>Provider</span>
              <strong>{material.sourceName}</strong>
            </div>

            <div className="detail-info-row">
              <span>Access</span>
              <strong>
                {material.isFree ? "Free" : "Check provider"}
              </strong>
            </div>

            <button
              type="button"
              className={`favorite-button ${isFavorite ? "saved" : ""}`}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
            >
              <Heart
                size={18}
                fill={isFavorite ? "currentColor" : "none"}
              />
              {favoriteLoading
                ? "Saving..."
                : isFavorite
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
            </button>

            <a
              href={material.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="start-learning-button"
              onClick={recordLearning}
            >
              Start Learning
              <ExternalLink size={18} />
            </a>

            <p className="external-resource-note">
              Opens the learning provider's website in a new tab.
            </p>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MaterialDetail;
