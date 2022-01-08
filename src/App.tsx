import { useState } from "react";
import { INITIAL_BPM, INITIAL_BEAT } from "~/constants.json";
import "./App.css";
import { Metronome } from "./sound/Metronome";
import { Slider } from "./ui/slider/Slider";

const metronome = new Metronome();
function App() {
  const [isRunning, setIsRunning] = useState(metronome.isRunning());
  const [bpm, setBpm] = useState(INITIAL_BPM);
  const [beat, setBeat] = useState(INITIAL_BEAT[0]);
  const onClick = () => {
    metronome.isRunning() ? metronome.stop() : metronome.start();
    setIsRunning(metronome.isRunning());
  };

  return (
    <div className="App">
      <div>
        <p>BPM: {bpm}</p>
        <p>Beat: {beat} / 4</p>
      </div>
      <Slider
        min={40}
        max={240}
        step={1}
        onUpdate={(val: number) => {
          setBpm(val);
          metronome.changeBpm(val);
        }}
        onClick={onClick}
        mode={isRunning ? "active" : "normal"}
      />
      <div>
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
