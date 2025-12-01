import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";
import logo from "../assets/logo.svg"; // 👈 Logo PubliMetro

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Error al iniciar sesión.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={logo} alt="PubliMetro" className="logo" />

        <h1 className="welcome-title">Bienvenido de nuevo</h1>
        <p className="welcome-text">
          Accede al sistema para gestionar tus clientes y
          toda tu operación desde un solo lugar.
        </p>
      </div>

      <div className="login-right">
        <div className="form-card">
          <h2 className="signin-title">Iniciar sesión</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember">
              <input type="checkbox" /> Recuérdame
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn-login">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
