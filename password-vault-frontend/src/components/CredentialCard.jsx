import { useState } from "react";

function CredentialCard({ data }) {
  const [show, setShow] = useState(false);

  return (
    <div className="credential">

      <h3>{data.website}</h3>

      <p>
        <strong>Username:</strong> {data.username}
      </p>

      <p>
        <strong>Password:</strong>{" "}
        {show ? data.password : "********"}
      </p>

      <button onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>

      <button>Copy</button>

      <button>Edit</button>

      <button>Delete</button>

    </div>
  );
}

export default CredentialCard;