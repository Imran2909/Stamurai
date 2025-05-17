"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import Table from "../components/table/page";
import styles from "../styles/dashboard.module.css";
import Navbar from "../components/navbar/page";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("myTasks");

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Navbar at top */}
        <div>
          <Navbar />
        </div>

        <div className={styles.box}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "myTasks" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("myTasks")}
            >
              My Tasks
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "overdue" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue Tasks
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === "myTasks" ? (
              <Table filter="all" />
            ) : (
              <Table filter="overdue" />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
