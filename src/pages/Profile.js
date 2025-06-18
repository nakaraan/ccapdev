import { useUser } from "./UserContext";
import { useState } from 'react';
import { Overlay } from '../components/Overlay';

export function Profile() {
  const { user } = useUser();
  if (!user) return <h1>Please log in.</h1>;
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hello, {user.name} ({user.role})</h1>
      <p>User ID: {user.id}</p>
    </div>
  );
}

export default function ShowProfile() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
        Open Overlay
      </button>

      <Overlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(!isOverlayOpen)}
      >
        <Profile />
      </Overlay>
    </>
  );
}