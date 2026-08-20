import {
  Shield,
  Send,
  // History,
  Inbox,
  // Settings,
  // Info,
  // Download,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Shield size={26} />
        </div>

        <div>
          <h1>StegoShield</h1>

          <p>
            Multimodality
            <br />
            Steganography
          </p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/sender/configure"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Send size={18} />
          <span>Sender</span>
        </NavLink>

        <NavLink
          to="/receiver"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Inbox size={18} />
          <span>Receiver</span>
        </NavLink>

        {/* <button className="nav-item">
          <History size={18} />
          <span>History</span>
        </button>

        <button className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button className="nav-item">
          <Info size={18} />
          <span>About</span>
        </button> */}
      </nav>

      <div className="sidebar-help">
        <span>?</span>
        <p>Need Help?</p>
      </div>
    </aside>
  );
};
