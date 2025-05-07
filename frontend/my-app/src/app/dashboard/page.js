// "use client";
// import { useSelector } from "react-redux";
// import AppLayout from "../components/AppLayout";
// import Table from "../components/table/page";
// import styles from "../styles/dashboard.module.css";

// export default function DashboardPage() { 
//   const user = useSelector((state) => state.user);
  
//   return ( 
//     <AppLayout>
//       <div className={styles.container}>
//         <div className={styles.box}>
//           <div className={styles.tablesContainer}>
//             <div className={styles.tableSection}>
//               <h2 className={styles.sectionTitle}>My Tasks | Overdue Task </h2>
//               <Table filter="all" />
//             </div>
            
//             <div className={styles.tableSection}>
//               <h2 className={styles.sectionTitle}>Overdue Tasks</h2>
//               <Table filter="overdue" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }








"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import Table from "../components/table/page";
import styles from "../styles/dashboard.module.css";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("myTasks");
  
  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "myTasks" ? styles.active : ""}`}
              onClick={() => setActiveTab("myTasks")}
            >
              My Tasks
            </button>
            <button
              className={`${styles.tab} ${activeTab === "overdue" ? styles.active : ""}`}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue Tasks
            </button>
          </div>

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