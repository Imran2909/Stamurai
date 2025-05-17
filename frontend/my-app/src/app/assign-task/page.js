"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/page";
import styles from "../styles/assignTask.module.css";
import AssignForm from "../components/assignForm/page";
import AssignTaskTable from "../components/assignTaskTable/page";
import { useDispatch, useSelector } from "react-redux";
import AppWrapper from "../components/AppWrapper";
import TaskRequests from "../components/taskRequests/page";
import { getAssignedTasks } from "../redux/action";
import { message } from "antd";
import { useRouter } from "next/navigation";

function AssignTask() {
  const [activeTab, setActiveTab] = useState("assignTask");
  const token = useSelector((store) => store.user.token);
  const dispatch = useDispatch();
  const router = useRouter();

  // Select requests count from Redux store for the badge
  const requests = useSelector(
    (state) => state.assignTask.assignedTasks.requests || []
  );

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) {
      messageApi.error("Please login first");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      dispatch(getAssignedTasks()); // Fetch assigned tasks if user is authenticated
    }
  }, [token, dispatch, messageApi, router]);

  return (
    <AppWrapper>
      {contextHolder}

      <div className={styles.box}>
        <div className={styles.left}>
          <Sidebar />
        </div>

        <div className={styles.right}>
          <main className={styles.mainContent}>
            {/* Tabs Navigation */}
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tab} ${
                  activeTab === "assignTask" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("assignTask")}
              >
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
                {/* Show badge if there are any pending requests */}
                {requests.length > 0 && (
                  <span className={styles.badge}>{requests.length}</span>
                )}
              </button>
            </div>

            {/* Tab Contents */}
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
                  <TaskRequests />
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
