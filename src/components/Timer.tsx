import {useEffect} from "react"

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
};

function Timer({ time, isRunning, setTime, mode, setMode, cycle, setCycle, setHistory }: TimerProps) {
    useEffect(() => {
        if(!isRunning) return;

        const interval = setInterval(() => {
            setTime((prev) => {
                if(prev <=1) {
                    clearInterval(interval);

                    if(mode === "focus") {
                        setHistory((prevHistory) => [
                            ...prevHistory,
                            {
                                date: new Date().toISOString(),
                                duration: 1500,
                            },
                        ]);
                    }

                    if(mode === "focus") {
                        if(cycle === 4) {
                            setMode("longBreak");
                            setTime(900);
                            setCycle(1);
                        } else {
                            setMode("shortBreak");
                            setTime(300);
                            setCycle((prevCycle) => prevCycle + 1);
                        }
                    } else {
                        setMode("focus");
                        setTime(1500);
                    }
                    return 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, mode, cycle, setTime, setMode, setCycle, setHistory])

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
        mode === "focus" ? 1500 :
        mode === "shortBreak" ? 300 :
        900;

    const progress = time / totalTime;

    const strokeDashoffset = circumference * (1 - progress);

    return (
        <section className="timer-section">
            <span className="mode-badge">{getModeLabel()}</span>

            <div className="timer-circle">
                <svg width="240" height="240">

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

                <h2 className="time">{formatTime(time)}</h2>
            </div>

            <div className="cycle-info">
                <div className="dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>

                <p>Ciclo {cycle} de 4</p>
            </div>
        </section>
    );
}

export default Timer;