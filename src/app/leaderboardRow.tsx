import type { AocMember } from "@/aoc";
import { State } from "@/aoc";
import { ReactNode } from "react";
import Star from "./star";

type Props = {
    member: AocMember;
    place: number;
}
export default function LeaderboardRow({ member, place }: Props) {
    const stars: ReactNode[] = [];
    for (let day = 1; day <= 25; day++) {
        const d = member.completion_day_level[day.toString(10)];
        if (!d) {
            stars.push(<Star key={`day${d}`} state={State.EMPTY}/>)
        } else {
            if (d["2"] && d["2"].get_star_ts) {
                stars.push(<Star key={`day${d}`} state={State.FULL}/>)
            } else if (d["1"].get_star_ts) {
                stars.push(<Star key={`day${d}`} state={State.HALF}/>)
            } else {
                stars.push(<Star key={`day${d}`} state={State.EMPTY}/>)
            }
        }
    }
    return <tr>
        <td>{place}</td>
        <td>{member.name ?? `(anonymous user #${member.id})`}</td>
        <td>{member.local_score}</td>
        <td>{member.stars} {stars}</td>
    </tr>
}