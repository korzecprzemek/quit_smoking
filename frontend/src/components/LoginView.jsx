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
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        id="login-input"
        type="text"
        value={login}
        onChange={(event) => setLogin(event.target.value)}
      />

      <input
        id="password-input"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">Log in</button>
    </form>
</main>
  );
}

export default LoginView;