
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  House,
  Heart,
  Clock3,
  UserRound,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  const navigation = [
    { to: "/", label: "Home", icon: House },
    { to: "/favorites", label: "Favorites", icon: Heart },
    { to: "/history", label: "History", icon: Clock3 },
    { to: "/profile", label: "Profile", icon: UserRound }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <BookOpen size={27} />
        <span>SkillLearn</span>
      </div>

      <p className="sidebar-label">YOUR LEARNING SPACE</p>

      <nav className="sidebar-nav">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <LogOut size={19} />
        <span>Log out</span>
      </button>
    </aside>
  );
}

export default Sidebar;
