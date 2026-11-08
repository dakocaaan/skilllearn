
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, PlayCircle, Globe } from "lucide-react";

function MaterialCard({ material }) {
  const isDutch = material.category === "Dutch";

  const fallbackImage = isDutch
    ? "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800"
    : "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800";

  return (
    <Link to={`/material/${material._id}`} className="material-card">
      <div className="material-image-wrapper">
        <img
          src={material.thumbnail || fallbackImage}
          alt={material.title}
          className="material-image"
        />
        <span className="material-type">
          {material.type === "video" ? <PlayCircle size={14} /> : <BookOpen size={14} />}
          {material.type}
        </span>
      </div>

      <div className="material-content">
        <div className="material-tags">
          <span className="category-tag">
            <Globe size={13} />
            {material.category}
          </span>
          <span className="level-tag">{material.level}</span>
        </div>

        <h3>{material.title}</h3>
        <p className="material-description">{material.description}</p>

        <div className="material-bottom">
          <span>{material.sourceName}</span>
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}

export default MaterialCard;
