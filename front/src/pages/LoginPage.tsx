import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="wrapper">
      <h1>Login</h1>

      <div className="buttons">
        <button onClick={() => loginWithRedirect()}>Log In</button>
      </div>
    </div>
  );
}
