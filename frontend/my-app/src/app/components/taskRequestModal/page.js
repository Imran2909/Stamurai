// "use client";
// import React from "react";
// import { Modal, Button, message } from "antd";
// import styles from "../../styles/taskRequestModal.module.css";

// const TaskRequestModal = ({
//   visible,
//   from,
//   message: modalMessage,
//   onAccept,
//   onReject,
//   onClose,
// }) => {
//   return (
//     <Modal
//       title="Task Request"
//       visible={visible}
//       onCancel={onClose}
//       footer={[
//         <Button key="reject" danger onClick={onReject}>
//           Reject
//         </Button>,
//         <Button key="accept" type="primary" onClick={onAccept}>
//           Accept
//         </Button>,
//       ]}
//       className={styles.modal}
//     >
//       <div className={styles.modalContent}>
//         <p>{modalMessage}</p>
//         <p className={styles.fromUser}>From: {from}</p>
//       </div>
//     </Modal>
//   );
// };

// export default TaskRequestModal;