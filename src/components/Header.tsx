import type React from "react";
import {FiZap, FiSun, FiMoon} from "react-icons/fi"

type Props = {
    theme: "light" | "dark";
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
};

function Header({ theme, setTheme }: Props) {
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <header className="header">
            <div className="logo">
                <FiZap className="logo-icon" />
                <h1 className="name-logo">Zentro<span>Focus</span></h1>
            </div>

            <button className="theme-toggle" onClick={toggleTheme}>
                <FiSun className={`icon ${theme === "light" ? "active" : ""}`}/>

                <div className={`toggle ${theme === "dark" ? "active" : ""}`}>
                    <div className="circle"></div>
                </div>

                <FiMoon className={`icon ${theme === "dark" ? "active" : ""}`}/>
            </button>
        </header>
    );
}

export default Header;