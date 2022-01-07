import { useState } from "react";
import { INITIAL_BPM, INITIAL_BEAT } from "~/constants.json";
import "./App.css";
import { Metronome } from "./sound/Metronome";
import { Button } from "./ui/button/Button";

const metronome = new Metronome();
function App() {
  const [isRunning, setIsRunning] = useState(metronome.isRunning());
  const [bpm, setBpm] = useState(INITIAL_BPM);
  const [beat, setBeat] = useState(INITIAL_BEAT[0]);
  const onClick = () => {
    isRunning ? metronome.stop() : metronome.start();
    setIsRunning(metronome.isRunning());
  };

  return (
    <div className="App">
      <div>
        <Button
          mode={isRunning ? "active" : "normal"}
          onClick={onClick}
        ></Button>
      </div>
      <div>
        <p>BPM: {bpm}</p>
        <p>Beat: {beat} / 4</p>
      </div>
      <div>
        <input
          type="range"
          name="bpm"
          id="bpm"
          min="40"
          max="240"
          step="1"
          value={bpm}
          onChange={(ev) => {
            const bpm = Number(ev.currentTarget.value);
            setBpm(bpm);
            metronome.changeBpm(bpm);
          }}
        />
        <input
          type="range"
          name="beat"
          id="beat"
          min="1"
          max="16"
          step="1"
          value={beat}
          onChange={(ev) => {
            const beat = Number(ev.currentTarget.value);
            setBeat(beat);
            metronome.changeBeat([beat, 4]);
          }}
        />
      </div>
    </div>
  );
}

export default App;
