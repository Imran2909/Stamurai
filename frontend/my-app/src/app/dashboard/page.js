"use client";

import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import Table from "../components/table/page";
import styles from "../styles/dashboard.module.css";

export default function DashboardPage() { 
    const user = useSelector((state) => state.user);
    console.log(user)
  return ( 
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.tableSection}>
            <Table />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
