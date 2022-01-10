import { useBeat, useBpm, useIsRunning, useVolume } from "~/store/store";
import { MIN_AVAILABLE_BPM, MAX_AVAILABLE_BPM } from "~/constants.json";
import { Slider } from "~/ui/slider/Slider";
import { SquareList } from "~/ui/squareList/SquareList";
import { useMetronome } from "~/hooks/useMetronome";
import { useEffect } from "react";

function MetronomeApp() {
  const [isRunning, setIsRunning] = useIsRunning();
  const [bpm, setBpm] = useBpm();
  const [beat, setBeat] = useBeat();
  const [volume, setVolume] = useVolume();
  const onClick = () => setIsRunning(!isRunning);

  useMetronome();

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      switch (ev.code) {
        case "Space":
          setIsRunning(!isRunning);
          break;
        case "ArrowUp":
          ev.shiftKey
            ? setBpm(bpm + 10)
            : ev.ctrlKey
            ? setBpm(bpm + 5)
            : setBpm(bpm + 1);
          break;
        case "ArrowDown":
          ev.shiftKey
            ? setBpm(bpm - 10)
            : ev.ctrlKey
            ? setBpm(bpm - 5)
            : setBpm(bpm - 1);
          break;
        case "ArrowRight":
          ev.shiftKey
            ? setVolume(volume + 10)
            : ev.ctrlKey
            ? setVolume(volume + 5)
            : setVolume(volume + 1);
          break;
        case "ArrowLeft":
          ev.shiftKey
            ? setVolume(volume - 10)
            : ev.ctrlKey
            ? setVolume(volume - 5)
            : setVolume(volume - 1);
          break;
        default:
          return;
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  });

  return (
    <>
      <div>
        <p>BPM: {bpm}</p>
        <p>
          Beat: {beat[0]} / {beat[1]}
        </p>
        <p>Volume: {volume}</p>
      </div>
      <Slider
        min={MIN_AVAILABLE_BPM}
        max={MAX_AVAILABLE_BPM}
        step={1}
        onUpdate={(val: number) => {
          setBpm(val);
        }}
        onClick={onClick}
        value={bpm}
        mode={isRunning ? "active" : "normal"}
      />
      <SquareList
        list={[2, 3, 4, 5, 6, 7, 8, 9]}
        initIdx={1}
        onChange={(val) => {
          const newBeat = [Number(val), beat[1]] as const;
          setBeat(newBeat);
        }}
      ></SquareList>
      <SquareList
        list={[2, 4, 8, 16]}
        initIdx={1}
        onChange={(val) => {
          const newBeat = [beat[0], Number(val)] as const;
          setBeat(newBeat);
        }}
      ></SquareList>
      <input
        type="range"
        name="volume"
        id="volume"
        min={0}
        max={100}
        step={1}
        value={volume}
        onChange={(ev) => setVolume(Number(ev.currentTarget.value))}
      />
    </>
  );
}

export default MetronomeApp;
