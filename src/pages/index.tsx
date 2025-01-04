import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';

interface Departure {
    departureTime: {
        countdown: number;
        timeReal: string;
    };
    vehicle: {
        name: string;
        towards: string;
        barrierFree: boolean;
    };
}

interface ApiResponse {
    data: {
        monitors: Array<{
            locationStop: {
                properties: {
                    title: string;
                };
            };
            lines: Array<{
                departures: {
                    departure: Departure[];
                };
            }>;
        }>;
    };
}

export default function Home() {
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [stationName, setStationName] = useState<string>('');
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [currentTime, setCurrentTime] = useState<string>('');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/departures');
            const data: ApiResponse = await response.json();

            const station = data.data.monitors[0].locationStop.properties.title;
            const deps = data.data.monitors[0].lines[0].departures.departure;

            setStationName(station);
            setDepartures(deps);
            setLastUpdate(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update clock every second
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('de-AT', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }));
        };

        updateClock();
        const clockInterval = setInterval(updateClock, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.clock}>{currentTime}</div>
                    <h1 className={styles.title}>{stationName}</h1>
                </div>

                <div className={styles.departureBoard}>
                    <div className={styles.boardHeader}>
                        <span>Abfahrt</span>
                        <span>Linie</span>
                        <span>Ziel</span>
                    </div>
                    <div className={styles.departures}>
                        {departures.map((dep, index) => (
                            <div key={index} className={styles.departure}>
                                <div className={styles.time}>
                                    {dep.departureTime.countdown} min
                                </div>
                                <div className={styles.line}>
                                    {dep.vehicle.name}
                                    {dep.vehicle.barrierFree && (
                                        <span className={styles.accessible}>♿</span>
                                    )}
                                </div>
                                <div className={styles.destination}>
                                    {dep.vehicle.towards}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.update}>
                        Letzte Aktualisierung: {lastUpdate}
                    </div>
                </div>
            </div>
        </main>
    );
} 