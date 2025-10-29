import  { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

export default function App() {
  const [activated, setActivated] = useState(false);
  const [code, setCode] = useState("");

  const mockActivationCode = "BTECH123";

  const handleActivate = () => {
    if (code.trim() === mockActivationCode) {
      Swal.fire({
        icon: "success",
        title: "Activation Successful 🎉",
        text: "Your payment of 2,055 USDT has been confirmed.",
        confirmButtonColor: "#16a34a",
      }).then(() => setActivated(true));
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Code",
        text: "❌ The activation code you entered is incorrect.",
      });
    }
  };

  if (activated) {
    return (
      <div className="flashfunds-screen">
        <div className="flash-box">
          <h2 className="flash-title">Flash Funds 💳</h2>
          <p className="flash-message">
            Your payment of <strong>2,055&nbsp;USDT</strong> <br />
            has been successful.
          </p>
          <p className="flash-subtext">
            In the next 24 hours your software will be sent to the email provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">BTECH</h1>
      <div className="card">
        <h2 className="subtitle">Enter Activation Code</h2>
        <input
          className="input"
          placeholder="Activation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="button" onClick={handleActivate} className="btn primary full">
          Activate
        </button>
      </div>
    </div>
  );
}
