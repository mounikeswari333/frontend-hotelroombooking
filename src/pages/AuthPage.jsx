import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AlertMessage from "../components/AlertMessage";

function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const url = mode === "login" ? "/login" : "/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const { data } = await api.post(url, payload);
      login(data);
      setMessage({
        type: "success",
        text: `${mode === "login" ? "Logged in" : "Registered"} successfully`,
      });
      navigate("/");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Request failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <h1>{mode === "login" ? "Login" : "Register"}</h1>
        <p className="subtle">Use your account to manage bookings.</p>

        <form onSubmit={submit} className="booking-form">
          {mode === "register" && (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button disabled={loading} type="submit">
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <AlertMessage type={message.type} message={message.text} />

        <button
          type="button"
          className="ghost-btn"
          onClick={() =>
            setMode((prev) => (prev === "login" ? "register" : "login"))
          }
        >
          {mode === "login"
            ? "New user? Register"
            : "Already have account? Login"}
        </button>
      </section>
    </main>
  );
}

export default AuthPage;
