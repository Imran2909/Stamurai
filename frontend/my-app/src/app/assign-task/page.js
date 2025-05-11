"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar/page";
import styles from "../styles/assignTask.module.css";
import AssignForm from "../components/assignForm/page";
import AssignTaskTable from "../components/assignTaskTable/page";
import { useSelector } from "react-redux";
import { store } from "../redux/store";
import AppWrapper from "../components/AppWrapper";

function AssignTask() {
  const [activeTab, setActiveTab] = useState("assignTask");
  const [unseenRequests, setUnseenRequests] = useState(3); // Example count

  return (
    <AppWrapper>
      <div className={styles.box}>
        <div className={styles.left}>
          <Sidebar />
        </div>
        <div className={styles.right}>
          <main className={styles.mainContent}>
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tab} ${
                  activeTab === "assignTask" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("assignTask")}
              >
                {" "}
                Assign Task to Others
              </button>

              <button
                className={`${styles.tab} ${
                  activeTab === "assignedTask" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("assignedTask")}
              >
                Assigned Tasks
              </button>

              <button
                className={`${styles.tab} ${
                  activeTab === "assignedToMe" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("assignedToMe")}
              >
                Assigned to Me
              </button>

              <button
                className={`${styles.tab} ${
                  activeTab === "taskRequests" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("taskRequests")}
              >
                Task Requests
                {unseenRequests > 0 && (
                  <span className={styles.badge}>{unseenRequests}</span>
                )}
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === "assignTask" && (
                <div className={styles.tabPanel}>
                  <AssignForm />
                </div>
              )}

              {activeTab === "assignedTask" && (
                <div className={styles.tabPanel}>
                  <AssignTaskTable
                    showOnly="sent"
                    title="Tasks You Have Assigned"
                  />
                </div>
              )}

              {activeTab === "assignedToMe" && (
                <div className={styles.tabPanel}>
                  <AssignTaskTable
                    showOnly="received"
                    title="Tasks Assigned to You"
                  />
                </div>
              )}

              {activeTab === "taskRequests" && (
                <div className={styles.tabPanel}>
                  {/* Task Requests Content */}
                  <p>Task Requests ({unseenRequests} new)</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AppWrapper>
  );
}

export default AssignTask;
