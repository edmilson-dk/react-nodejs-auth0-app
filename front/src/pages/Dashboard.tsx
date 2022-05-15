import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState } from "react";

export function Dashboard() {
  const { user, isLoading, logout, getAccessTokenSilently } = useAuth0();
  const [isUpdateMfaLoading, setIsUpdateMfaLoading] = useState(false);

  async function callBackendPublicRouteAuth0() {
    const { data } = await axios.get("http://localhost:5000/public");
    console.log(data);
  }

  async function updateIsUseMfa({ isUse }: { isUse: boolean }) {
    setIsUpdateMfaLoading(true);
    const token = await getAccessTokenSilently();

    const { data } = await axios.post(
      "http://localhost:5000/private",
      {
        use_mfa: isUse,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setIsUpdateMfaLoading(false);
    console.log(data);
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!user) {
    return <div>No user</div>;
  }

  return (
    <div className="wrapper">
      <div className="user-profile">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>

      <div className="buttons">
        <button onClick={() => logout()}>Log out</button>
        <button onClick={() => callBackendPublicRouteAuth0()}>
          Public Route
        </button>

        {isUpdateMfaLoading && <div>Upadting MFA use preferences...</div>}

        {!isUpdateMfaLoading && (
          <>
            <button
              className="enable"
              onClick={() => updateIsUseMfa({ isUse: true })}
            >
              Enable MFA
            </button>
            <button
              className="disable"
              onClick={() => updateIsUseMfa({ isUse: false })}
            >
              Disable MFA
            </button>
          </>
        )}
      </div>
    </div>
  );
}
