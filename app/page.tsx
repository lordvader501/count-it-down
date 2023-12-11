"use client";

import { useRef, useState } from "react";
import classNames from "classnames";
import { FaCirclePlay, FaCircleStop, FaCirclePause } from "react-icons/fa6";
interface Timer {
  time: number;
  isRunning: boolean;
}
export default function Home() {
  const countDown = useRef<NodeJS.Timeout | null>(null); // use ref to store the interval
  const inputRef = useRef<HTMLInputElement | null>({
    value: "",
  } as HTMLInputElement | null); // use ref to store the input
  const [timer, setTimer] = useState<Timer>({ time: 0, isRunning: false }); // use state to store the timer

  // handle the start
  const handleStartTimmer = () => {
    // check if the input is empty so timmer doesnt start
    if (inputRef.current && inputRef.current.value === "") return;
    if (timer.time === 0 && countDown.current && inputRef.current) {
      if (inputRef.current.value === "") return;
      clearInterval(countDown.current);
      setTimer({
        time: +inputRef.current.value * 60 || 0,
        isRunning: +inputRef.current.value > 0 ? true : false,
      });
    }
    // clear previous interval so it doesnt overlap
    if (countDown.current) clearInterval(countDown.current);
    countDown.current = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev.time - 1;
        if (newTime === 0) {
          if (countDown.current) clearInterval(countDown.current);
          return { time: 0, isRunning: false };
        }
        return { time: newTime, isRunning: true };
      });
    }, 1000);
  };

  // handle the pause
  const handlePauseTimmer = () => {
    if (countDown.current) clearInterval(countDown.current);
    setTimer((prev) => ({ ...prev, isRunning: false }));
  };

  // handle the reset
  const handleResetTimmer = () => {
    if (countDown.current) clearInterval(countDown.current);
    setTimer({ time: 0, isRunning: false });
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (countDown.current) clearInterval(countDown.current);
    if (e.target.value === "") {
      setTimer({ time: 0, isRunning: false });
    }
    setTimer({ time: +e.target.value * 60, isRunning: false });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center sm:px-10 px-4 lg:px-24">
      <div className="w-full max-w-2xl flex flex-col items-start justify-center">
        <label className="text-[#07accd] text-xl">Enter Minutes</label>
        <input
          ref={inputRef}
          type="text"
          className="border-2 border-[#363d52] bg-transparent rounded-md max-w-2xl w-full text-white font-semibold text-xl p-2"
          onChange={handleInputChange}
        />
      </div>
      <div className="mt-10 flex gap-3 items-center">
        <FaCirclePlay
          className={classNames("text-[#07accd] sm:w-14 sm:h-14 w-12 h-12", {
            hidden: timer.isRunning,
          })}
          onClick={handleStartTimmer}
        />
        <div className="flex gap-3">
          <FaCirclePause
            className={classNames("text-[#07accd] sm:w-14 sm:h-14 w-12 h-12", {
              hidden: !timer.isRunning,
            })}
            onClick={handlePauseTimmer}
          />
          <FaCircleStop
            className={classNames("text-[#07accd] sm:w-14 sm:h-14 w-12 h-12", {
              hidden: !timer.isRunning,
            })}
            onClick={handleResetTimmer}
          />
        </div>
        {timer.time >= 0 && (
          <div className="text-[#07accd] text-4xl sm:text-6xl font-bold">
            {/* hours */}
            {timer.time >= 3600
              ? Math.floor(timer.time / 3600) >= 10
                ? Math.floor(timer.time / 3600)
                : "0" + Math.floor(timer.time / 3600)
              : "00"}{" "}
            : {/* minutes */}
            {timer.time >= 60
              ? Math.floor((timer.time / 60) % 60) >= 10
                ? Math.floor((timer.time / 60) % 60)
                : "0" + Math.floor((timer.time / 60) % 60)
              : "00"}{" "}
            : {/* seconds */}
            {timer.time > 0
              ? timer.time % 60 >= 10
                ? timer.time % 60
                : "0" + (timer.time % 60)
              : "00"}
          </div>
        )}
      </div>
    </main>
  );
}
