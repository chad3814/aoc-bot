import { AocLeaderboard } from "../src/aoc";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
    if (process.argv.length < 3) {
        console.error('specify the leagueId');
        return;
    }
    const session = await readFile(resolve(__dirname, '..', 'cron', '.secrets', 'AOC_SESSION'), 'utf-8');
    const leagueId = process.argv[2];
    const res = await fetch(`https://adventofcode.com/2024/leaderboard/private/view/${leagueId}.json`, {
        headers: {
            'Cookie': `session=${session}`,
        },
    });

    if (!res.ok) {
        console.error('failed to get league json');
        return;
    }

    const data = await res.json() as AocLeaderboard;
    const members = Object.values(data.members).slice();
    members.sort(
        (a, b) => b.local_score - a.local_score
    );

    const rankSize = members.length.toString(10).length;
    const scoreSize = members[0].local_score.toString(10).length;
    const namesSize = Math.max(...members.map(
        member => member.name ? member.name.length : (`(anonymous userid #${member.id})`).length
    ));
    console.log('Current Leaderboard:');
    let i = 1;
    for (const member of members) {
        if (member.stars === 0) {
            break;
        }
        const name = member.name ?? `(anonymous userid #${member.id})`;
        const line: string[] = [];
        line.push(`${i.toString(10).padStart(rankSize, ' ')}.`);
        line.push(member.local_score.toString(10).padStart(scoreSize, ' '));
        line.push('-');
        line.push(name.padEnd(namesSize));
        line.push(member.stars + ' stars');
        console.log(line.join(' '));
        i++;
    }
}

main();
