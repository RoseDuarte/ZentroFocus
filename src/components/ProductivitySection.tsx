import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

type Session = {
    date: string;
    duration: number;
};

type Props = {
    history: Session[];
}

function ProductivitySection({ history }: Props) {
    const today  = new Date().toDateString();

    const todaySession = history.filter(
        (s) => new Date(s.date).toDateString() === today
    );

    const totalTime = todaySession.reduce(
        (acc, session) => acc + session.duration,
        0
    );

    const uniqueDays = [
        ...new Set(history.map((s) => new Date(s.date).toDateString())),
    ];

    const sortedDays = uniqueDays.sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;

    for (let i=0; i < sortedDays.length; i++) {
        const current = new Date(sortedDays[i]);
        const next = new Date(sortedDays[i+1]);

        if(i === 0) {
           const today = new Date().toDateString();
           
           if(sortedDays[i] !== today) break;
           streak =1;
        } else {
            const diff = 
            (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

            if(diff === 1) {
                streak++;
            } else {
                break;
            }
        }
    }

    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const dayString = date.toDateString();

        const total = history
            .filter((s) => new Date(s.date).toDateString() === dayString)
            .reduce((acc, session) => acc + session.duration, 0);

        return {
            day: date.toLocaleDateString("pt-BR", {weekday: "short"}),
            minutes: Math.floor(total / 60),
        };
    }).reverse();

    return (
        <section className="productivity-section">
            <h3>PRODUTIVIDADE DE HOJE</h3>  

            <div className="cards">
                <article className="card">
                    <p>Ciclos</p>
                    <strong>{todaySession.length}</strong>
                </article>

                <article className="card">
                    <p>Tempo Focado</p>
                    <strong>{Math.floor(totalTime / 60)} min</strong>
                </article>

                <article className="card">
                    <p>Sequência</p>
                    <strong>{streak}</strong>
                </article>
            </div>

            {todaySession.length === 0 && (
                <p className="empty-message">
                    Nenhuma sessão concluída hoje. Comece a focar! 🎯   
                </p>
            )}

            <div className="chart-container" style={{width: "70%", height: 200}}>
                <ResponsiveContainer>
                    <LineChart data={last7Days}>
                        <XAxis dataKey="day"/>
                        <YAxis />
                        <Tooltip/>
                        <Line type="monotone" dataKey="minutes" stroke="#8b5cf6"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default ProductivitySection;