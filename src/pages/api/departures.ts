import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await fetch('https://www.wienerlinien.at/ogd_realtime/monitor?rbl=90');
        const data = await response.json();
        res.status(200).json(data);
    } catch (error: unknown) {
        console.error('Error fetching departures:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
} 