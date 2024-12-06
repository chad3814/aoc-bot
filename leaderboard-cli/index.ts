import { AocLeaderboard, AocMember } from "../src/aoc";
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

    // star number -> member list that completed the star
    const starIndexes = new Map<number, AocMember[]>()
    for (const member of members) {
        for (const d of Object.keys(member.completion_day_level)) {
            const day = parseInt(d, 10);
            const star1 = day * 2 - 1;
            const star2 = day * 2;
            const star1Members = starIndexes.get(star1) ?? [];
            const star2Members = starIndexes.get(star2) ?? [];
            if (member.completion_day_level[d][1].get_star_ts) {
                star1Members.push(member);
            }
            if (member.completion_day_level[d][2]?.get_star_ts) {
                star2Members.push(member);
            }
            starIndexes.set(star1, star1Members);
            starIndexes.set(star2, star2Members);
        }
    }

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

    console.log();
    console.log('Each Star Ranking');
    for (const star of [...starIndexes.keys()].sort((a,b) => b-a)) {
        const day = Math.ceil((star) / 2).toString(10);
        const part = (((star+1) % 2) + 1).toString(10) as '1' | '2';

        const starMembers = starIndexes.get(star)!;
        starMembers.sort(
            (a, b) => {
                if(!a.completion_day_level[day][part]) {
                    if (b.completion_day_level[day][part]) {
                        return 1;
                    }
                    return 0;
                }
                if (!b.completion_day_level[day][part]) {
                    if (a.completion_day_level[day][part]) {
                        return -1;
                    }
                    return 0;
                }

                return a.completion_day_level[day][part].get_star_ts - b.completion_day_level[day][part].get_star_ts;
            }
        )
        console.log('  Star', star);
        i = 1;
        for (const member of starMembers) {
            if (!member.completion_day_level[day][part]) {
                break;
            }
            const name = member.name ?? `(anonymous userid #${member.id})`;
            const line: string[] = [];
            line.push(`${i.toString(10).padStart(rankSize, ' ')}.`);
            line.push(name);
            console.log(' ', line.join(' '));
            i++;
        }
    }
}

main();
