import { readFile } from 'fs/promises';
import type { AocLeaderboard } from '../src/aoc';

async function fetchLeaderBoard(): Promise<AocLeaderboard | null> {
    const leaderboardId = await readFile('/run/secrets/AOC_LEADERBOARD', 'utf-8');
    const sessionCookie = await readFile('/run/secrets/AOC_SESSION', 'utf-8');
    const url = `https://adventofcode.com/2024/leaderboard/private/view/${leaderboardId}.json`;

    const leaderboardRes = await fetch(
        url,
        {
            headers: {
                'Cookie': `session=${sessionCookie}`,
                'User-Agent': 'AoC Cron - chad@cwalker.dev',
            }
        }
    );

    if (!leaderboardRes.ok) {
        console.error(`failed to fetch leader board "${leaderboardId}" ${leaderboardRes.status} - ${leaderboardRes.statusText}`);
        return null;
    }

    console.log('fetched leaderboard', url);
    const text = await leaderboardRes.text();
    let leaderboard: AocLeaderboard;
    try {
        leaderboard = JSON.parse(text) as AocLeaderboard;
    } catch {
        console.error('failed to get leaderboard', leaderboardId, url);
        console.error(`session: "${sessionCookie}`);
        return null;
    }
    // const leaderboard = await leaderboardRes.json() as AocLeaderboard;
    return leaderboard;
}

async function updateVercel(leaderboard: AocLeaderboard): Promise<void> {
    const vercelToken = await readFile('/run/secrets/leaderboardToken', 'utf-8');
    const vercelEdgeConfigId = await readFile('/run/secrets/edgeConfigId', 'utf-8')
    const vercelRes = await fetch(
        `https://api.vercel.com/v1/edge-config/${vercelEdgeConfigId}/items`,
        {
            headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    operation: 'upsert',
                    key: `leaderboard`,
                    value: leaderboard,
                }],
            }),
            method: 'PATCH'
        }
    );
    console.log('fetch vercel');
    const response = (await vercelRes.json()) as {status: string};
    if (!vercelRes.ok) {
        console.error(`failed to update edge config ${vercelRes.status} - ${vercelRes.statusText}`);
        console.error(response);
        return;
    }

    if (response.status !== 'ok') {
        console.error('vercel returned an error:', JSON.stringify(response, null, 4));
        return;
    }
}

async function cycle() {
    const next = Date.now() + 15 * 60 * 1000; // 15 minutes
    const leaderboard = await fetchLeaderBoard();
    if (leaderboard) {
        await updateVercel(leaderboard);
    }

    setTimeout(cycle, next - Date.now());
}

cycle();

async function post() {
    const next = new Date();
    const hour = next.getUTCHours();
    next.setUTCHours((Math.floor(hour / 2) + 1) * 2);
    next.setUTCMinutes(0);
    next.setUTCSeconds(0);

    const res = await fetch('https://aoc.chadshost.xyz/api/refresh');
    if (!res.ok) {
        console.error(`faield to refresh ${res.status} - ${res.statusText}`);
    }
    setTimeout(post, next.getTime() - Date.now());
}

post();
