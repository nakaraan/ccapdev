import { useEffect, useState } from "react";
import "./Overlay.css";

export function Overlay({ isOpen, onClose, children}) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      // Wait for fade-out before removing from DOM
      const timeout = setTimeout(() => setShow(false), 300); // match CSS duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  
  return (
    <>
      {isOpen ? (
        <div className="overlay">
          <div className="overlay_background" onClick={onClose}>
          <div className="overlay_container">
            <div className="overlay_controls">
              <button className="overlay_close" type="button" onClick={onClose}>
                &times;
              </button>
            </div>
            {children}
          </div>  
          </div>
        </div>
      ) : null}
    </>
  )
}