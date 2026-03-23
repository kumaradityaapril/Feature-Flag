import { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [flags, setFlags] = useState([]);

  // Fetch flags
  const getFlags = async () => {
    try {
      const res = await API.get("/flags");
      setFlags(res.data.data); // because of APIResponse format
    } catch (err) {
      console.error(err);
    }
  };

  // Run on page load
  useEffect(() => {
    getFlags();
  }, []);

  return (
    <div>
      <h1>Feature Flag Dashboard</h1>

      <h2>All Flags</h2>

      {flags.length === 0 ? (
        <p>No flags found</p>
      ) : (
        <ul>
          {flags.map((flag) => (
            <li key={flag.id}>
              <strong>{flag.name}</strong> -{" "}
              {flag.enabled ? "Enabled" : "Disabled"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;