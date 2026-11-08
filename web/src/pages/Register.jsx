
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="brand">
          <BookOpen size={28} />
          <span>SkillLearn</span>
        </div>
        <div className="brand-message">
          <span className="eyebrow">LEARN SOMETHING NEW</span>
          <h1>Your next skill starts here.</h1>
          <p>Explore practical learning resources, build your knowledge, and grow at your own pace.</p>
          <div className="brand-decoration">✦</div>
        </div>
        <p className="brand-footer">Learn beyond the classroom.</p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="form-subtitle">Join SkillLearn and start learning today.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
