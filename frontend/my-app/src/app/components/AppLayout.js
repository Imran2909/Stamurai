'use client';
import Navbar from "./navbar/page";
import Sidebar from "./sidebar/page";
import styles from "../styles/layout.module.css";

export default function AppLayout({ children }) {
  return (
    <div className={styles.box}>
      <div className={styles.left}>
        <Sidebar />
      </div>
      <div className={styles.right}>
        <Navbar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}