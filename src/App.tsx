import "./App.css";
import { beep } from "./sound/beep";
import { Button } from "./ui/button/Button";

const ctx = new AudioContext();
function App() {
  const onClick = () => {
    beep(ctx, {});
  }

  return (
    <div className="App">
      <Button mode={"active"} onClick={onClick}>
      </Button>
    </div>
  );
}

export default App;
