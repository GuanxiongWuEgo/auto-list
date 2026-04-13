export default function Loading() {
  return (
    <div
      style={{
        background: "#000000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      {/* Gold loading bar */}
      <div
        style={{
          width: "120px",
          height: "1px",
          background: "#202020",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "40%",
            background: "#FFC000",
            animation: "slide 1.2s ease-in-out infinite",
          }}
        />
      </div>
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#494949",
        }}
      >
        Loading
      </p>
      <style>{`
        @keyframes slide {
          0% { left: -40%; }
          100% { left: 140%; }
        }
      `}</style>
    </div>
  );
}
