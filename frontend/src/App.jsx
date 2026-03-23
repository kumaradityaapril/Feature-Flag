import { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [flags, setFlags] = useState([]);
  const [form, setForm] = useState({
    name: "",
    enabled: true,
    environment: "",
    rollout_percentage: 0,
    rules: "",
    kill_switch: false,
  });

  const getFlags = async () => {
    try {
      const res = await API.get("/flags");
      setFlags(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFlags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const createFlag = async () => {
    try {
      const payload = {
        ...form,
        rules: JSON.parse(form.rules || "{}"),
        rollout_percentage: Number(form.rollout_percentage),
        enabled: form.enabled === "true" || form.enabled === true,
        kill_switch: form.kill_switch === "true" || form.kill_switch === true,
      };

      await API.post("/flags", payload);
      alert("Flag created successfully!");
      getFlags();
    } catch (err) {
      console.error(err);
      alert("Error creating flag");
    }
  };

  return (
    <div>
      <h1>Feature Flag Dashboard</h1>

      <h2>Create Feature Flag</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <br />
      <input name="environment" placeholder="Environment" onChange={handleChange} />
      <br />
      <input
        name="rollout_percentage"
        placeholder="Rollout %"
        type="number"
        onChange={handleChange}
      />
      <br />
      <input
        name="rules"
        placeholder='Rules JSON (e.g. {"users":["user123"]})'
        onChange={handleChange}
      />
      <br />
      <select name="enabled" onChange={handleChange}>
        <option value="true">Enabled</option>
        <option value="false">Disabled</option>
      </select>
      <br />
      <select name="kill_switch" onChange={handleChange}>
        <option value="false">Kill Switch OFF</option>
        <option value="true">Kill Switch ON</option>
      </select>
      <br />
      <br />
      <button onClick={createFlag}>Create Flag</button>

      <hr />

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
