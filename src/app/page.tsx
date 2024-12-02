import Leaderboard from "./leaderboard";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Leaderboard/>
      </main>
      <footer className={styles.footer}>
        <Link href="/api/refresh">manually refresh</Link>
      </footer>
    </div>
  );
}
