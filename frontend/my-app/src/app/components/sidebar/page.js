"use client";
import Link from "next/link";
import styles from "../../styles/sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import { useState } from "react";
import { logoutUser } from "../../redux/action";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Assign Task", path: "/assign-task" },
  { label: "Organisation", path: "/organisation" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const token = useSelector((store) => store.user.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // ✅ useRouter hook
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogout = () => setIsModalOpen(true);

  const handleOk = async () => {
   
    
    const success = await dispatch(logoutUser());
    setIsModalOpen(false);

    if (success) {
      messageApi.open({
        type: "success",
        content: "Logout Successful",
      });
      router.push('/login'); // ✅ Proper redirect
    } else {
      messageApi.open({
        type: "error",
        content: message,
      });
    }
  };
  const handleCancel = () => setIsModalOpen(false);

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.appTitle}>Task Manager</h1>
        </div>
        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={styles.navLink}>
              <span
                className={
                  pathname === item.path
                    ? `${styles.navItem} ${styles.activeItem}`
                    : styles.navItem
                }
              >
                {item.label}
              </span>
            </Link>
          ))}

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
