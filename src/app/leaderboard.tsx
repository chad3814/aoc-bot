import { AocLeaderboard } from "@/aoc";
import { ReactNode } from "react";
import LeaderboardRow from "./leaderboardRow";

type Props = {
    leaderboard: AocLeaderboard;
};

export default function Leaderboard({ leaderboard }: Props): ReactNode {
    const members = Object.values(leaderboard.members).sort(
        (a, b) => b.local_score - a.local_score
    );

    return <table>
        <thead>
            <tr>
                <td></td>
                <td>Name</td>
                <td>Score</td>
                <td>Stars</td>
            </tr>
        </thead>
        <tbody>
            {members.map(
                (member, idx) => <LeaderboardRow member={member} place={idx + 1} key={member.id}/>
            )}
        </tbody>
    </table>
}
