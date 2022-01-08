import { useState } from "react";
import { INITIAL_BPM, INITIAL_BEAT } from "~/constants.json";
import { Metronome } from "./sound/Metronome";
import { Slider } from "./ui/slider/Slider";
import { SquareList } from "./ui/squareList/SquareList";

type Beat = readonly [number, number];
const metronome = new Metronome();
function App() {
  const [isRunning, setIsRunning] = useState(metronome.isRunning());
  const [bpm, setBpm] = useState(INITIAL_BPM);
  const [beat, setBeat] = useState<Beat>(INITIAL_BEAT as unknown as Beat);
  const onClick = () => {
    metronome.isRunning() ? metronome.stop() : metronome.start();
    setIsRunning(metronome.isRunning());
  };

  return (
    <div className="App">
      <div>
        <p>BPM: {bpm}</p>
        <p>
          Beat: {beat[0]} / {beat[1]}
        </p>
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
      <SquareList
        list={[2, 3, 4, 5, 6, 7, 8, 9]}
        initIdx={2}
        onChange={(val) => {
          const newBeat = [Number(val), beat[1]] as const;
          setBeat(newBeat);
          metronome.changeBeat(newBeat);
        }}
      ></SquareList>
      <SquareList
        list={[2, 4, 8, 16]}
        initIdx={1}
        onChange={(val) => {
          const newBeat = [beat[0], Number(val)] as const;
          setBeat(newBeat);
          metronome.changeBeat(newBeat);
        }}
      ></SquareList>
    </div>
  );
}

export default App;
