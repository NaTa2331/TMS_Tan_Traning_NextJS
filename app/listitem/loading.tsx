// loading.tsx

export default function LoadingPage() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        flexDirection: 'column', 
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div className="spinner" style={spinnerStyle}></div>
      <p 
        style={{ 
          marginTop: '20px', 
          fontSize: '18px', 
          color: '#555',
          fontWeight: 'bold'
        }}
      >
        Loading...
      </p>
    </div>
  );
}

// Optional spinner styling
const spinnerStyle: React.CSSProperties = {
  border: '8px solid #f3f3f3', 
  borderTop: '8px solid #3498db', 
  borderRadius: '50%', 
  width: '50px', 
  height: '50px', 
  animation: 'spin 2s linear infinite'
};

// Add this global CSS to define the spinning animation
if (typeof window !== "undefined") {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
}
