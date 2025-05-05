// "use client";
// import styles from "./styles/home.module.css";
// import Image from "next/image"; 
// import HomeBanner from "./Home banner.jpg"; // Adjust path as needed
// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <div className={styles.container}>
//       <div className={styles.box}>
//         {/* Text Content Div */}
//         <div className={styles.contentSection}>
//           <h1 className={styles.title}>Task Management</h1>
//           <p className={styles.description}>
//             Streamline your workflow with our powerful task management solution. 
//             Organize, prioritize, and track all your tasks in one place with 
//             intuitive features designed to boost your productivity.
//           </p>
//           <Link href="/dashboard" className={styles.dashboardButton}>
//             Go To Dashboard
//           </Link>
//         </div>

//         {/* Image Div */}
//         <div className={styles.imageSection}>
//           <Image
//             src={HomeBanner}
//             alt="Task Management App Preview"
//             className={styles.bannerImage}
//             priority
//             fill
//           />
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";
import AppLayout from "./components/AppLayout"; 
import styles from "./styles/home.module.css";
import Image from "next/image";
import HomeBanner from "./images/Home banner.jpg";
import Link from "next/link";

export default function HomePage() {
  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.box}>
          {/* Text Content Div */}
          <div className={styles.contentSection}>
            <h1 className={styles.title}>Task Management</h1>
            <p className={styles.description}>
              Streamline your workflow with our powerful task management solution. 
              Organize, prioritize, and track all your tasks in one place with 
              intuitive features designed to boost your productivity.
            </p>
            <Link href="/dashboard" className={styles.dashboardButton} >
              Go To Dashboard
            </Link>
          </div>

          {/* Image Div */}
          <div className={styles.imageSection}>
            <Image
              src={HomeBanner}
              alt="Task Management App Preview"
              className={styles.bannerImage}
              priority
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}