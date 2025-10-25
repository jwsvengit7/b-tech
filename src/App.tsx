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

 const Input = ({
    placeholder,
    type = "text",
    value,
    onChange,
  }: {
    placeholder: string;
    type?: string;
    value: string | number | undefined;
    onChange: (eOrVal: React.ChangeEvent<HTMLInputElement> | string) => void;
  }) => {
    // internal handler converts native event to either event or value
    const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
    };

    return (
      <input
        className="input"
        placeholder={placeholder}
        type={type}
        value={value ?? ""}
        onChange={handle}
      />
    );
  };

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
          <button
            className="back-btn"
            type="button"
            onClick={onBack}
          >
            ← Back
          </button>
        )}
        <h2 className="subtitle">{title}</h2>
      </div>
      {children}
    </div>
  );


export default function App() {
  const [page, setPage] = useState<Page>("activation");
  const [code, setCode] = useState("");
  const [account, setAccount] = useState<Partial<AccountDetails>>({});
  const [balance, setBalance] = useState<number>(900_000_000_000.0);
  const [amount, setAmount] = useState<string>("");

  const handleActivate = () => {
    if (code.trim() === mockActivationCode) {
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
    // Remove commas and spaces before parse
    const cleaned = amount.replace(/[, ]+/g, "");
    const amt = parseFloat(cleaned);
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

    setBalance((b) => +(b - amt).toFixed(2));
    setAmount("");
    Swal.fire({
      icon: "success",
      title: "Transfer Pending 💸",
      text: `₦${amt.toLocaleString()} has been transferred!`,
      confirmButtonColor: "#16a34a",
    });
  };

  /**
   * Input component:
   * - Accepts either an event or a raw value in onChange (robust to wrappers).
   * - Always controlled via value prop.
   */
 

 
  return (
    <div className="app">
      <h1 className="title">BTECH</h1>

      {page === "activation" && (
        <Card title="Enter Activation Code">
          <Input
            placeholder="Activation Code"
            value={code}
            onChange={(eOrVal) => {
              const v =
                typeof eOrVal === "string"
                  ? eOrVal
                  : eOrVal.target?.value ?? "";
              setCode(v);
            }}
          />
          <button
            type="button"
            onClick={handleActivate}
            className="btn primary full"
          >
            Activate
          </button>
        </Card>
      )}

      {page === "dashboard" && (
        <Card title="sagiru lawan Dashboard" onBack={() => setPage("activation")}>
          <div className="balance-display">
            <h3>Current Balance</h3>
            <p>₦{balance.toLocaleString()}</p>
          </div>

          <div className="btn-row">
           

            <button
              type="button"
              onClick={() => setPage("account")}
              className="btn green"
            >
              Account
            </button>
          </div>

          <h3 className="section-title">Transaction History</h3>
          <div className="history">
            {mockHistory.map((item, i) => (
              <div key={i} className="history-item">
                <span>{item.label}</span>
                <span className="amount">
                  ₦{item.amount.toLocaleString(undefined)}
                </span>
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
              onChange={(eOrVal) => {
                const val =
                  typeof eOrVal === "string"
                    ? eOrVal
                    : eOrVal.target?.value ?? "";
                setAccount((prev) => ({
                  ...prev,
                  [key]: val,
                }));
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => setPage("transfer")}
            className="btn primary full"
          >
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

          <div className="balance">Balance: ₦{balance.toLocaleString()}</div>

          <Input
            placeholder="Enter Amount"
            type="text" // use text so user can paste formatted numbers like "1,000,000"
            value={amount}
            onChange={(eOrVal) => {
              const v =
                typeof eOrVal === "string"
                  ? eOrVal
                  : eOrVal.target?.value ?? "";
              // allow numbers, commas and spaces only
              const cleaned = v.replace(/[^\d,.\s]/g, "");
              setAmount(cleaned);
            }}
          />

          <button
            type="button"
            onClick={handleTransfer}
            className="btn green full"
          >
            Transfer
          </button>
        </Card>
      )}
    </div>
  );
}
