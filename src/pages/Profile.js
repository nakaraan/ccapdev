import { useState } from 'react';
import { Overlay } from '../components/Overlay';

export function Profile() {
  return (
    <h1> hello world</h1>
  )
}

export default function ShowProfile() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  return (
  <>
    <button onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
      Open Overlay
    </button>

    <Overlay
      isOpen={isOverlayOpen}
      onClose={() => setIsOverlayOpen(!isOverlayOpen)}
    >
      <h1>Hello from overlay</h1>
      ashjiaehjiqeefnjijokfae
      \aanjkfnajk
    </Overlay>
  </>
  )
}