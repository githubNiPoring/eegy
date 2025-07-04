const categories = [
  { key: "fruit", label: "Fruits 🍎" },
  { key: "things", label: "Things 🧸" },
  { key: "animals", label: "Animals 🐶" },
];

const CategorySelectModal = ({ show, onSelect, onClose }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "32px 28px 24px 28px",
          minWidth: 320,
          maxWidth: "90vw",
          boxShadow: "0 6px 32px rgba(0,0,0,0.18)",
        }}
      >
        <h4 className="mb-3" style={{ color: "#ffb300" }}>
          Choose a Category
        </h4>
        <div className="d-flex flex-column gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="btn btn-warning"
              style={{ fontWeight: "bold", fontSize: "1.1rem" }}
              onClick={() => onSelect(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-secondary mt-4" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectModal;
