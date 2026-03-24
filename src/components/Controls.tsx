import {FiPlay, FiPause, FiRefreshCcw} from "react-icons/fi"

type ControlsProps = {
    isRunning: boolean;
    setIsRunning: (value: boolean) => void;
    setTime: (value: number) => void;
};

function Controls({ isRunning, setIsRunning, setTime }: ControlsProps) {
    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(1500);
    }
    return (
        <section className="controls">
            <button className="play-button" onClick={handlePlayPause} aria-label="Iniciar timer">
                {isRunning ? <FiPause /> : <FiPlay />}
            </button>

            <button className="reset-button" onClick={handleReset} aria-label="Resetar timer">
                <FiRefreshCcw />
            </button>
        </section>
    );
}

export default Controls;