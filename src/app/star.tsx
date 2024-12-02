import { State, star, missing } from "@/aoc";

type Props = {
    state: State;
};

export default function Star({ state }: Props) {
    if (state === State.EMPTY) {
        return <span>{missing}{missing}</span>
    }
    if (state === State.HALF) {
        return <><span style={{color: 'gold'}}>{star}</span><span>{missing}</span></>
    }
    return <span style={{color: 'gold'}}>{star}{star}</span>
}