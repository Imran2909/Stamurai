"use client";
import Link from "next/link";
import styles from "../../styles/sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import { useState } from "react";
import { logoutUser } from "../../redux/action";
import { usePathname, useRouter } from "next/navigation";

// List of nav items to show on sidebar
const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Assign Task", path: "/assign-task" },
  { label: "Organisation", path: "/organisation" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const token = useSelector((store) => store.user.token); // Get auth token from Redux
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control for logout confirm
  const pathname = usePathname(); // Get current path for active link highlighting
  const router = useRouter(); // For redirecting on logout
  const [messageApi, contextHolder] = message.useMessage(); // AntD message control

  // Trigger logout modal
  const handleLogout = () => setIsModalOpen(true);

  // Confirm logout -> dispatch action, redirect, show toast
  const handleOk = async () => {
    const success = await dispatch(logoutUser());
    setIsModalOpen(false);

    if (success) {
      messageApi.open({
        type: "success",
        content: "Logout Successful",
      });
      setTimeout(() => {
        router.push("/login"); // Redirect to login after 2s
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "Logout failed. Please try again.",
      });
    }
  };

  // Cancel logout
  const handleCancel = () => setIsModalOpen(false);

  return (
    <div className={styles.sidebarContainer}>
      {contextHolder}
      <div className={styles.sidebarContent}>
        {/* Sidebar Title */}
        <div className={styles.sidebarHeader}>
          <h1 className={styles.appTitle}>Task Manager</h1>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={styles.navLink}>
              <span
                className={
                  pathname === item.path
                    ? `${styles.navItem} ${styles.activeItem}` // Highlight active link
                    : styles.navItem
                }
              >
                {item.label}
              </span>
            </Link>
          ))}

          {/* Show logout if user is logged in, otherwise show login */}
          {token ? (
            <span
              className={styles.navLink}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <span className={styles.navItem}>Logout</span>
            </span>
          ) : (
            <Link href="/login" className={styles.navLink}>
              <span
                className={
                  pathname === "/login"
                    ? `${styles.navItem} ${styles.activeItem}`
                    : styles.navItem
                }
              >
                Login
              </span>
            </Link>
          )}
        </nav>

        {/* Logout confirmation modal */}
        <Modal
          title="Confirm Logout"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      </div>
    </div>
  );
}
