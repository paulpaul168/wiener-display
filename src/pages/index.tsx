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
    message?: {
        value: string;
        messageCode: number;
        serverTime: string;
    };
}

export default function Home() {
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [stationName, setStationName] = useState<string>('Beethovengang');
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [currentTime, setCurrentTime] = useState<string>('');
    const [error, setError] = useState<string>('');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/departures');
            const data: ApiResponse = await response.json();

            setLastUpdate(new Date().toLocaleTimeString('de-AT', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }));

            if (!data.data.monitors || data.data.monitors.length === 0) {
                setDepartures([]);
                return;
            }

            const station = data.data.monitors[0].locationStop.properties.title;
            const deps = data.data.monitors[0].lines[0].departures.departure;

            setError('');
            setStationName(station);
            setDepartures(deps);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Fehler beim Laden der Daten');
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
                        {error ? (
                            <div className={styles.error}>{error}</div>
                        ) : departures.length === 0 ? (
                            <div className={styles.error}>Keine Abfahrten verfügbar</div>
                        ) : (
                            departures.map((dep, index) => (
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
                            ))
                        )}
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