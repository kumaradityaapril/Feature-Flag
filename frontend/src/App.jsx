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

  const [evalData, setEvalData] = useState({
    flag_name: "",
    user_id: "",
    country: "",
    app_version: "",
    environment: "",
  });

  const [result, setResult] = useState(null);

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

  const handleEvalChange = (e) => {
    const { name, value } = e.target;
    setEvalData({ ...evalData, [name]: value });
  };

  const evaluateFlag = async () => {
    try {
      const res = await API.post("/evaluate", evalData);
      setResult(res.data.data.enabled);
    } catch (err) {
      console.error(err);
      alert("Error evaluating flag");
    }
  };

  const deleteFlag = async (id) => {
    try {
      await API.delete(`/flags/${id}`);
      alert("Flag deleted");
      getFlags();
    } catch (err) {
      console.error(err);
      alert("Error deleting flag");
    }
  };

  const toggleFlag = async (flag) => {
    try {
      await API.put(`/flags/${flag.id}`, { ...flag, enabled: !flag.enabled });
      getFlags();
    } catch (err) {
      console.error(err);
    }
  };

  const updateRollout = async (flag, value) => {
    try {
      await API.put(`/flags/${flag.id}`, { ...flag, rollout_percentage: Number(value) });
      getFlags();
    } catch (err) {
      console.error(err);
    }
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

              <br />

              <button onClick={() => toggleFlag(flag)}>Toggle</button>
              <button onClick={() => deleteFlag(flag.id)}>Delete</button>

              <br />

              <input
                type="number"
                placeholder="New rollout %"
                onBlur={(e) => updateRollout(flag, e.target.value)}
              />

              <hr />
            </li>
          ))}
        </ul>
      )}
      <hr />

      <h2>Evaluate Feature Flag</h2>

      <input name="flag_name" placeholder="Flag Name" onChange={handleEvalChange} />
      <br />
      <input name="user_id" placeholder="User ID" onChange={handleEvalChange} />
      <br />
      <input name="country" placeholder="Country" onChange={handleEvalChange} />
      <br />
      <input name="app_version" placeholder="App Version" onChange={handleEvalChange} />
      <br />
      <input name="environment" placeholder="Environment" onChange={handleEvalChange} />
      <br /><br />

      <button onClick={evaluateFlag}>Evaluate</button>

      <br /><br />

      {result !== null && (
        <h3>Result: {result ? "Enabled ✅" : "Disabled ❌"}</h3>
      )}
    </div>
  );
}

export default App;
