import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const defaultData = {
  family: [
    {
      name: "Member 1",
      medicines: [
        "Pan 40",
        "Sitaxa DM",
        "Ramistar",
        "Deplatt",
        "Ecosprin",
        "Tonact",
        "Ezedoc",
      ],
    },
  ],
};

export default function MedicineTracker() {
  const [data, setData] = useState(defaultData);
  const [selectedMember, setSelectedMember] = useState(0);
  const [log, setLog] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("medicineData");
    const savedLog = localStorage.getItem("medicineLog");
    if (saved) setData(JSON.parse(saved));
    if (savedLog) setLog(JSON.parse(savedLog));
  }, []);

  useEffect(() => {
    localStorage.setItem("medicineData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("medicineLog", JSON.stringify(log));
  }, [log]);

  const today = new Date().toISOString().split("T")[0];

  const toggleMedicine = (medicine) => {
    const key = `${selectedMember}-${today}`;
    const current = log[key] || [];
    const updated = current.includes(medicine)
      ? current.filter((m) => m !== medicine)
      : [...current, medicine];
    setLog({ ...log, [key]: updated });
  };

  const addMember = () => {
    const name = prompt("Enter family member name:");
    if (!name) return;
    setData({
      ...data,
      family: [...data.family, { name, medicines: [] }],
    });
  };

  const addMedicine = () => {
    const name = prompt("Enter medicine name:");
    if (!name) return;
    const updated = [...data.family];
    updated[selectedMember].medicines.push(name);
    setData({ ...data, family: updated });
  };

  const exportLog = () => {
    const blob = new Blob([JSON.stringify(log, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medicine-log.json";
    a.click();
  };

  const member = data.family[selectedMember];
  const key = `${selectedMember}-${today}`;
  const takenToday = log[key] || [];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Family Medicine Tracker</h1>

      <div style={styles.card}>
        <div style={styles.rowWrap}>
          {data.family.map((f, index) => (
            <button
              key={index}
              onClick={() => setSelectedMember(index)}
              style={{
                ...styles.button,
                background:
                  index === selectedMember ? "#2563eb" : "#e5e7eb",
                color: index === selectedMember ? "white" : "black",
              }}
            >
              {f.name}
            </button>
          ))}
          <button style={styles.button} onClick={addMember}>
            + Add Member
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2>
          {member.name} — {today}
        </h2>
        <div style={styles.grid}>
          {member.medicines.map((med, idx) => (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.97 }}
              style={styles.medicineItem}
            >
              <span>{med}</span>
              <input
                type="checkbox"
                checked={takenToday.includes(med)}
                onChange={() => toggleMedicine(med)}
              />
            </motion.div>
          ))}
        </div>
        <button style={styles.button} onClick={addMedicine}>
          + Add Medicine
        </button>
      </div>

      <div style={styles.card}>
        <h2>Data Management</h2>
        <button style={styles.button} onClick={exportLog}>
          Export History JSON
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  rowWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    padding: "8px 14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginTop: "10px",
  },
  medicineItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "12px",
    background: "#f9fafb",
  },
};