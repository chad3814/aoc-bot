import { AocLeaderboard } from "@/aoc";
import { get } from "@vercel/edge-config";
import { /*NextRequest,*/ NextResponse } from "next/server";

export type RefreshResponse = {
    status: "ok" | "error";
    message?: string;
}

type TextElement = {
    type: 'plain_text' | 'mrkdwn';
    text: string;
    emoji?: boolean;
}

type EmojiElement = {
    type: 'emoji';
    name: string;
}

type Element = TextElement | EmojiElement;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ListElement = {
    type: 'rich_text_section';
    elements: Element[];
};

type Section = {
    type: 'section';
    fields: TextElement[];
};

export async function GET(/*req: NextRequest*/): Promise<NextResponse<RefreshResponse>> {
    const leaderboard = await get('leaderboard') as AocLeaderboard;
    const members = Object.values(leaderboard.members).sort(
        (a, b) => b.local_score - a.local_score
    );

    const sections: Section[] = [];

    let place = 1;
    for (const member of members) {
        const stars: TextElement = {
            type: 'plain_text',
            text: '',
            emoji: true,
        };
        const last_ts = member.last_star_ts;
        for (let i = 1; i <= 25; i++) {
            const day = member.completion_day_level[i];
            if (!day?.[1].get_star_ts) {
                stars.text += ':circle:';
                continue;
            }
            stars.text += ':star:';
            if (day[1].get_star_ts === last_ts) {
                break;
            }
            if (day[2]?.get_star_ts) {
                stars.text += ':star:';
            }
            if (day[2]?.get_star_ts === last_ts) {
                break;
            }
        }
        const textElement: TextElement = {
                type: 'mrkdwn',
                text: `${place}. `
        };
        if (member.name) {
            textElement.text += `*${member.name}*`;
        } else {
            textElement.text += `(anon user id #${member.id}) `;
        }
        textElement.text += `- ${member.local_score}`;
        place++;
        sections.push({
            type: 'section',
            fields: [textElement, stars],
        });
    }

    const message = {
        blocks: [{
            type: "header",
            text: {
                type: "plain_text",
                text: "Current Leaderboard:",
                emoji: true,
            },
        }, ...sections],
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    };

    const res = await fetch(process.env.SLACK_WEBHOOK_URL!, options);
    if (!res.ok) {
        console.error('faield to post to slack', res.status, res.statusText);
        console.error(JSON.stringify(message, null, 4));
        return NextResponse.json({status: 'error', message: await res.text()});
    }
    return NextResponse.json({status: 'ok'});
}
