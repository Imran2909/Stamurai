"use client";

import Table from "../components/table/page";
import styles from "../styles/dashboard.module.css";

export default function DashboardPage() {
  return ( 
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.tableSection}>
          <Table />
        </div>
      </div>
    </div>
  );
}
