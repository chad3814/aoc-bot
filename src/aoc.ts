export enum State {
    EMPTY,
    HALF,
    FULL
}

export type StarData = {
    star_index: number;
    get_star_ts: number;
};

export type CompletionDayLevel = {
    [day: string]: {
        "1": StarData;
        "2"?: StarData;
    }
};

export type AocMember = {
    name: string;
    completion_day_level: CompletionDayLevel;
    stars: number;
    global_score: number;
    id: number;
    last_star_ts: number;
    local_score: number;
};

export type AocLeaderboard = {
    owner_id: number;
    event: string;
    members: {
        [memberId: string]: AocMember;
    };
};

export const star = '\ueb59';
export const missing = '\uf4aa';

