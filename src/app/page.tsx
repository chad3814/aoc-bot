import { get } from "@vercel/edge-config";
import Leaderboard from "./leaderboard";
import styles from "./page.module.css";
import Link from "next/link";
import { AocLeaderboard } from "@/aoc";

export default async function Home() {
  const leaderboard = await get('leaderboard') as AocLeaderboard;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Leaderboard leaderboard={leaderboard}/>
      </main>
      <footer className={styles.footer}>
        <Link href="/api/refresh">manually refresh</Link>
      </footer>
    </div>
  );
}
