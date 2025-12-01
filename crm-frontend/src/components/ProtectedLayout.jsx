import Navbar from "./Navbar";
import "./ProtectedLayout.css";

function ProtectedLayout({ children }) {
  return (
    <div>
      <Navbar />
      
      <div className="layout-container">
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;
