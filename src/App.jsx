import { useState } from "react";
import StatefulButton from "./components/StatefulButtons";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [shouldFail, setShouldFail] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const fakeRequest = async () => {
    await wait(1500);
    if (shouldFail) throw new Error("Request failed");
  };

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 520, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Stateful button</h1>
      <p>Click to run a fake 1.5s request. Use the toggles to force each outcome.</p>

      <div style={{ display: "flex", gap: "1.5rem", margin: "1rem 0" }}>
        <label>
          <input type="checkbox" checked={shouldFail} onChange={(e) => setShouldFail(e.target.checked)} />{" "}
          Make request fail
        </label>
        <label>
          <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />{" "}
          Disabled
        </label>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", padding: "1rem 0" }}>
        <StatefulButton onClick={fakeRequest} disabled={disabled} />

        <StatefulButton
          onClick={fakeRequest}
          disabled={disabled}
          labels={{
            idle: "Add to cart",
            loading: "Adding…",
            success: "Added",
            error: "Out of stock",
          }}
        />
      </div>
    </main>
  );
}