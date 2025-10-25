import React, { useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

type Page = "activation" | "dashboard" | "account" | "transfer";

const mockActivationCode = "BTECH123";

interface AccountDetails {
  name: string;
  accountNumber: string;
  bvn: string;
  dob: string;
  customerId: string;
  username: string;
  password: string;
}

const mockHistory = [
  { label: "Fund Wallet", amount: 3_000_000.0 },
  { label: "Fund Wallet", amount: 100_000.0 },
  { label: "Fund Wallet", amount: 1_500_000.0 },
  { label: "Fund Wallet", amount: 2_000_000.0 },
];

export default function App() {
  const [page, setPage] = useState<Page>("activation");
  const [code, setCode] = useState("");
  const [account, setAccount] = useState<Partial<AccountDetails>>({});
  const [balance, setBalance] = useState<number>(900_000_000_000.0);
  const [amount, setAmount] = useState<string>("");

  const handleActivate = () => {
    if (code === mockActivationCode) {
      Swal.fire({
        icon: "success",
        title: "Activated!",
        text: "Welcome to your dashboard 🚀",
        confirmButtonColor: "#2563eb",
      }).then(() => setPage("dashboard"));
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Code",
        text: "❌ The activation code you entered is incorrect.",
      });
    }
  };

  const handleTransfer = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Please enter a valid transfer amount.",
      });
    }
    if (amt > balance) {
      return Swal.fire({
        icon: "error",
        title: "Insufficient Funds",
        text: "You don’t have enough balance for this transaction.",
      });
    }

    setBalance((b) => b - amt);
    setAmount("");
    Swal.fire({
      icon: "success",
      title: "Transfer Successful 💸",
      text: `₦${amt.toLocaleString()} has been transferred successfully!`,
      confirmButtonColor: "#16a34a",
    });
  };

  const Input = ({
    placeholder,
    type = "text",
    value,
    onChange,
  }: {
    placeholder: string;
    type?: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      className="input"
      placeholder={placeholder}
      type={type}
      value={value ?? ""}
      onChange={onChange}
    />
  );

  const Card = ({
    title,
    children,
    onBack,
  }: {
    title: string;
    children: React.ReactNode;
    onBack?: () => void;
  }) => (
    <div className="card">
      <div className="card-header">
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
        )}
        <h2 className="subtitle">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="app">
      <h1 className="title">BTECH</h1>

      {page === "activation" && (
        <Card title="Enter Activation Code">
          <Input
            placeholder="Activation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleActivate} className="btn primary full">
            Activate
          </button>
        </Card>
      )}

      {page === "dashboard" && (
        <Card title="Flash Fund Dashboard" onBack={() => setPage("activation")}>
          <div className="balance-display">
            <h3>Current Balance</h3>
            <p>₦{balance.toLocaleString()}</p>
          </div>

          <div className="btn-row">
            <button className="btn purple">BVN Pull</button>
            <button onClick={() => setPage("account")} className="btn green">
              Account
            </button>
          </div>

          <h3 className="section-title">Transaction History</h3>
          <div className="history">
            {mockHistory.map((item, i) => (
              <div key={i} className="history-item">
                <span>{item.label}</span>
                <span className="amount">₦{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}


      {page === "account" && (
  <Card title="Account Information" onBack={() => setPage("dashboard")}>
    {(
      [
        { key: "name", label: "Account Name" },
        { key: "accountNumber", label: "Account Number" },
        { key: "bvn", label: "BVN" },
        { key: "dob", label: "Date of Birth" },
        { key: "customerId", label: "Customer ID" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password", type: "password" },
      ] as { key: keyof AccountDetails; label: string; type?: string }[]
    ).map(({ key, label, type }) => (
      <Input
        key={key}
        placeholder={label}
        type={type || "text"}
        value={account[key] ?? ""}
        onChange={(e) =>
          setAccount((prev) => ({
            ...prev,
            [key]: e.target.value,
          }))
        }
      />
    ))}

    <button onClick={() => setPage("transfer")} className="btn primary full">
      Continue
    </button>
  </Card>
)}


      {page === "transfer" && (
        <Card title="Transfer Funds" onBack={() => setPage("account")}>
          <p>
            <strong>Account Name:</strong> {account.name || "—"}
          </p>
          <p>
            <strong>Account Number:</strong> {account.accountNumber || "—"}
          </p>

          <div className="balance">
            Balance: ₦{balance.toLocaleString()}
          </div>

          <Input
            placeholder="Enter Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={handleTransfer} className="btn green full">
            Transfer
          </button>
        </Card>
      )}
    </div>
  );
}
