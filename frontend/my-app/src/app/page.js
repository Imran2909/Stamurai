"use client";
import Form from "./components/form/page";
import Table from "./components/table/page";
import styles from "./styles/home.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {/* <div className={styles.formSection}>
          <Form />
        </div>
        <div className={styles.divider}></div> */}
        <div className={styles.tableSection}>
          <Table />
        </div>
      </div>
    </div>
  );
}