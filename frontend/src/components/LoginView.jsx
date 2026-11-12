import { useState } from "react";

function LoginView({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
  }
  return (

<main className="login-page">
    <h1>Welcome! Please, log in.</h1>
    <form className="card login-form" onSubmit={handleSubmit}>
      <input
        id="login-input"
        type="text"
        placeholder="Login"
        aria-label="Login"
        autoComplete="username"
        value={login}
        onChange={(event) => setLogin(event.target.value)}
      />

      <input
        id="password-input"
        type="password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">Log in</button>
    </form>
</main>
  );
}

export default LoginView;