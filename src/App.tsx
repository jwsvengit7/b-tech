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
        title: "Successful 🎉",
        text: "Successfully activated your account.",
        confirmButtonColor: "#16a34a",
      }).then(() => {
        setBalance(4012340.00);
        setHistory([
          {
            id: 1,
            date: new Date().toLocaleDateString(),
            description: "Initial Deposit",
            amount: 4012340.00,
            currency: "NGN",
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

  const formatCurrency = (value: number) => {
    return "₦" + value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        text: `You cannot withdraw more than your current balance (${formatCurrency(balance)}).`,
      });
      return;
    }

    const newWithdraw: Withdrawal = {
      id: withdrawals.length + 1,
      date: new Date().toLocaleDateString(),
      amount: amt,
      currency: "NGN",
      status: "Pending",
    };
    setWithdrawals([...withdrawals, newWithdraw]);
    setBalance(balance - amt);
    setWithdrawAmount("");

    Swal.fire({
      icon: "info",
      title: "Withdrawal Requested",
      text: `Your request to withdraw ${formatCurrency(amt)} is now pending.`,
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
        <button className="back-btn" onClick={() => {/* optionally handle navigation/back */}}>← Back</button>
        <h2 className="subtitle">sagiru lawan Dashboard</h2>

        <div className="balance-display">
          <h3>Current Balance</h3>
          <p className="large-balance">{formatCurrency(balance)}</p>
        </div>

        <button className="btn green full account-btn">Account</button>

        <div className="section">
          <h3 className="section-title">Transaction History</h3>
          {history.length === 0 ? (
            <p>No history yet.</p>
          ) : (
            <ul className="history">
              {history.map((tx) => (
                <li key={tx.id} className="history-item">
                  <span>{tx.description}</span>
                  <span className="amount">{formatCurrency(tx.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="section withdraw-section">
          <h3 className="section-title">Send to BTC</h3>
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
          <h3 className="section-title">Your Withdrawal Requests</h3>
          {withdrawals.length === 0 ? (
            <p>No withdrawals requested yet.</p>
          ) : (
            <ul className="history">
              {withdrawals.map((wd) => (
                <li key={wd.id} className="history-item">
                  <span>{wd.date} — Withdraw {formatCurrency(wd.amount)}</span>
                  <span className="status">{wd.status}</span>
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
