'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/sidebar.module.css';

const navItems = [
  { label: 'Home', path: '/' }, 
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Assign Task', path: '/assign-task' },
  { label: 'Organisation', path: '/organisation' },
  { label: 'Login', path: '/login' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return ( 
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.appTitle}>Task Manager</h1>
        </div>
        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={styles.navLink}>
              <span className={
                pathname === item.path
                  ? `${styles.navItem} ${styles.activeItem}`
                  : styles.navItem
              }>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}