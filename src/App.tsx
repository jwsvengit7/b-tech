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

interface Transaction {
  label: string;
  amount: number;
  name?: string;
  bank?: string;
  status?: string;
}


const mockHistory: Transaction[] = [
  {
    label: "Transfer to D & G",
    amount: 200_000_000.0,
    name: "Aisah Bello",
    bank: "D & G Steal Company Limited",
    status: "Failed",
  },
  { label: "Fund Wallet", amount: 100_000.0, bank: "BTECH MFB", status: "Pending" },
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
        <button className="back-btn" type="button" onClick={onBack}>
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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBalance((b) => +(b - amt).toFixed(2));
      setAmount("");
      Swal.fire({
        icon: "success",
        title: "Transfer Pending 💸",
        text: `₦${amt.toLocaleString()} has been transferred!`,
        confirmButtonColor: "#16a34a",
      });
    }, 120000);
  };

  return (
    <div className="app">
      <h1 className="title">BTECH</h1>

      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
          <p className="loading-text">Processing transfer... Please wait ⏳</p>
        </div>
      )}

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
        <div className="dashboard-layout">
          {/* Receipt on the left */}
      


          {/* Dashboard Card */}
          <Card title="Sagiru Lawan Dashboard" onBack={() => setPage("activation")}>
            <div className="balance-display">
              <h3>Current Balance</h3>
              <p>₦349,000.00</p>
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
            
  {mockHistory.map((selectedTransactions, i) => (
    selectedTransactions &&(
      <>
     <div key={i} className="receipt-content">
      <p><strong>Type:</strong> {selectedTransactions?.label}</p>
      <p><strong>Name:</strong> {selectedTransactions?.name || "—"}</p>
      <p><strong>Recipt:</strong> {selectedTransactions?.bank || "—"}</p>
      <p><strong>Amount:</strong> ₦{selectedTransactions?.amount.toLocaleString()}</p>
      <p>
        <strong>Status:</strong>{" "}
        {selectedTransactions?.status === "Successful" ? "✅ Successful" : `⌛ ${selectedTransactions?.status}`}
      </p>
      <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
    </div>
    <hr />
    </>
    )
  ))}
</div>

          </Card>
        </div>
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

          <div className="balance">Balance: ₦349,000.00</div>

          <Input
            placeholder="Enter Amount"
            type="text"
            value={amount}
            onChange={(eOrVal) => {
              const v =
                typeof eOrVal === "string"
                  ? eOrVal
                  : eOrVal.target?.value ?? "";
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
