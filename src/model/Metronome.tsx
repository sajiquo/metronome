import { Metronome as MetronomeInstance } from "~/sound/Metronome";
import { useBeat, useBpm, useIsRunning } from "~/store/store";
import { MIN_AVAILABLE_BPM, MAX_AVAILABLE_BPM } from "~/constants.json";
import { Slider } from "~/ui/slider/Slider";
import { SquareList } from "~/ui/squareList/SquareList";

const _metronome = new MetronomeInstance();
function Metronome() {
  const [isRunning, setIsRunning] = useIsRunning();
  const [bpm, setBpm] = useBpm();
  const [beat, setBeat] = useBeat();
  const onClick = () => {
    _metronome.isRunning() ? _metronome.stop() : _metronome.start();
    setIsRunning(_metronome.isRunning());
  };

  return (
    <>
      <div>
        <p>BPM: {bpm}</p>
        <p>
          Beat: {beat[0]} / {beat[1]}
        </p>
      </div>
      <Slider
        min={MIN_AVAILABLE_BPM}
        max={MAX_AVAILABLE_BPM}
        step={1}
        onUpdate={(val: number) => {
          setBpm(val);
          _metronome.changeBpm(val);
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
          _metronome.changeBeat(newBeat);
        }}
      ></SquareList>
      <SquareList
        list={[2, 4, 8, 16]}
        initIdx={1}
        onChange={(val) => {
          const newBeat = [beat[0], Number(val)] as const;
          setBeat(newBeat);
          _metronome.changeBeat(newBeat);
        }}
      ></SquareList>
    </>
  );
}

export default Metronome;
