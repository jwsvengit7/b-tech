// App.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
}

interface Withdrawal {
  id: number;
  date: string;
  amount: number;
  currency: string;
  status: string;
}

const mockActivationCode = "BTECH123";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const handleActivate = () => {
    if (code.trim() === mockActivationCode) {
      Swal.fire({
        icon: "success",
        title: "Activation Successful 🎉",
        text: "Your payment of 2,055 USDT has been confirmed.",
        confirmButtonColor: "#16a34a",
      }).then(() => {
        setBalance(2055);
        setHistory([
          {
            id: 1,
            date: new Date().toLocaleDateString(),
            description: "Activation payment",
            amount: 4012340.00,
            currency: "USDT",
            status: "Confirmed",
          },
        ]);
        setIsLoggedIn(true);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Code",
        text: "❌ The activation code you entered is incorrect.",
      });
    }
  };

  const handleRequestWithdrawal = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid amount",
        text: "Please enter a positive number.",
      });
      return;
    }
    if (amt > balance) {
      Swal.fire({
        icon: "error",
        title: "Insufficient balance",
        text: `You cannot withdraw more than your current balance (${balance} USDT).`,
      });
      return;
    }

    const newWithdraw: Withdrawal = {
      id: withdrawals.length + 1,
      date: new Date().toLocaleDateString(),
      amount: amt,
      currency: "USDT",
      status: "Pending",
    };
    setWithdrawals([...withdrawals, newWithdraw]);
    setBalance(balance - amt);
    setWithdrawAmount("");

    Swal.fire({
      icon: "info",
      title: "Withdrawal Requested",
      text: `Your request to withdraw ${amt} USDT is now pending.`,
      confirmButtonColor: "#16a34a",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <h1 className="title">Welcome to Flash Funds</h1>
        <div className="card">
          <h2 className="subtitle">Enter Activation Code</h2>
          <input
            className="input"
            placeholder="Activation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            onClick={handleActivate}
            className="btn primary full"
          >
            Activate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app dashboard-screen">
      <div className="card">
        <h2 className="subtitle">Dashboard</h2>

        <div className="balance-display">
          <h3>sagiru lawan</h3>
          <p>{balance} USDT</p>
        </div>

        <div className="section">
          <h3 className="section-title">Request Withdrawal</h3>
          <input
            className="input"
            placeholder="Amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button
            type="button"
            onClick={handleRequestWithdrawal}
            className="btn primary"
          >
            Submit Withdrawal
          </button>
        </div>

        <div className="section">
          <h3 className="section-title">Transaction History</h3>
          {history.length === 0 ? (
            <p>No history yet.</p>
          ) : (
            <ul className="history">
              {history.map((tx) => (
                <li key={tx.id} className="history-item">
                  <span>{tx.date}</span> — <span>{tx.description}</span> —{" "}
                  <span>{tx.amount} {tx.currency}</span> — <span>{tx.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="section">
          <h3 className="section-title">Your Withdrawal Requests</h3>
          {withdrawals.length === 0 ? (
            <p>No withdrawals requested yet.</p>
          ) : (
            <ul className="history">
              {withdrawals.map((wd) => (
                <li key={wd.id} className="history-item">
                  <span>{wd.date}</span> — Withdraw{" "}
                  <span>{wd.amount} {wd.currency}</span> —{" "}
                  <span>{wd.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
