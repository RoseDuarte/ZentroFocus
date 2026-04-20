import {useEffect, useCallback, useRef} from "react";
import {FOCUS_TIME, SHORT_BREAK, LONG_BREAK} from "../constants/timer";
import {motion} from "framer-motion";

type Session = {
    date: string;
    duration: number;
};

type TimerProps = {
    time: number;
    isRunning: boolean;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    mode: "focus" | "shortBreak" | "longBreak";
    setMode: React.Dispatch<
        React.SetStateAction<"focus" | "shortBreak" | "longBreak">
    >
    cycle: number;
    setCycle: React.Dispatch<React.SetStateAction<number>>;
    history: Session[];
    setHistory: React.Dispatch<React.SetStateAction<Session[]>>
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
};

function Timer({ time, isRunning, setTime, mode, setMode, cycle, setCycle, setHistory, setIsRunning }: TimerProps) {
    const isEndingRef = useRef(false);

    const handleTimerEnd = useCallback(() => {
        setIsRunning(false);

        if(mode === "focus") {
            setHistory((prevHistory) => [
                ...prevHistory,
                {
                    date: new Date().toISOString(),
                    duration: FOCUS_TIME,
                },
            ]);

            if(cycle === 4) {
                setMode("longBreak");
                setTime(LONG_BREAK);
                setCycle(1);
            } else {
                setMode("shortBreak");
                setTime(SHORT_BREAK);
                setCycle((prev) => prev + 1);
            }
        } else {
            setMode("focus");
            setTime(FOCUS_TIME);
        }
    }, [mode, cycle, setHistory, setMode, setTime, setCycle, setIsRunning])

    useEffect(() => {
        if (!isRunning) return;
    
        isEndingRef.current = false;
    
        const interval = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if(time > 0) return;
        if(isEndingRef.current) return;

        isEndingRef.current = true;

        handleTimerEnd();
    }, [time, handleTimerEnd]);

   const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const getModeLabel = () => {
        if(mode === "focus") return "Foco";
        if(mode === "shortBreak") return "Pausa";
        return "Pausa Longa"
    };

    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    const totalTime = 
        mode === "focus" ? FOCUS_TIME :
        mode === "shortBreak" ? SHORT_BREAK :
        LONG_BREAK;

    const safeTime = Math.max(time, 0);
    const progress = totalTime > 0 ? safeTime / totalTime : 0;

    const strokeDashoffset = isNaN(progress)
        ? circumference
        : circumference * (1 - progress);

    return (
        <section className="timer-section">
            <span className="mode-badge">{getModeLabel()}</span>

            <motion.div
                className="timer-circle"
                animate={
                    isRunning
                        ? { scale: [1, 1.04, 1] }
                        : { scale: 1 }
                }
                transition={{
                    duration: 1.2,
                    repeat: isRunning ? Infinity : 0,
                    ease: "easeInOut"
                }}
            >
                <svg width="100%" height="100%" viewBox="0 0 240 240">

                    <circle
                        cx="120"
                        cy="120"
                        r={radius}
                        stroke="var(--border)"
                        strokeWidth="8"
                        fill="none"
                    />

                    <circle
                        cx="120"
                        cy="120"
                        r={radius}
                        stroke="var(--primary)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{transition: "stroke-dashoffset 1s linear"}}
                    />
                </svg>

                <motion.h2
                    key={time}
                    className="time"
                    initial={{ opacity: 0.5, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {formatTime(time)}
                </motion.h2>
            </motion.div>

            <div className="cycle-info">
                <div className="dots">
                    {[1, 2, 3, 4].map((c) => (
                        <span
                            key={c}
                            className={`dot ${cycle >= c ? "active" : ""}`}
                        ></span>
                    ))}
                </div>

                <p>Ciclo {cycle} de 4</p>
            </div>
        </section>
    );
}

export default Timer;