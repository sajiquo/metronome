import { useState } from "react";
import "./App.css";
import { createBeepScheduler } from "./sound/beepScheduler";
import { Button } from "./ui/button/Button";

const scheduler = createBeepScheduler({
  bpm: 120,
  beat: [4, 4],
});
function App() {
  const [isActive, setIsActive] = useState(false);
  const onClick = () => {
    isActive ? scheduler.cancel() : scheduler.exec();
    setIsActive(!isActive);
  };

  return (
    <div className="App">
      <Button mode={isActive ? "active" : "normal"} onClick={onClick}></Button>
    </div>
  );
}

export default App;
