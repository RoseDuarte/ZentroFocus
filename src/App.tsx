import {useState, useEffect} from "react"
import Header from "./components/Header";
import Timer from "./components/Timer";
import Controls from "./components/Controls";
import ProductivitySection from "./components/ProductivitySection";

type Session = {
  date: string;
  duration: number;
}

function App() {
  const [time, setTime] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [cycle, setCycle] = useState(1);
  
  const [history, setHistory] = useState<Session[]>(() => {
    const saved = localStorage.getItem("pomodoro-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pomodoro-history", JSON.stringify(history));
  }, [history]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme])

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <main className="app">
      <div className="container">
        <Header theme={theme} setTheme={setTheme}/>

        <Timer 
          time={time} 
          isRunning={isRunning} 
          setTime={setTime}
          mode={mode}
          setMode={setMode}
          cycle={cycle}
          setCycle={setCycle}
          history={history}
          setHistory={setHistory}
        />

        <Controls
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          setTime={setTime}
        />

        <ProductivitySection history={history} />
      </div>
    </main>
  )
}

export default App;