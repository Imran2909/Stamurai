import React from "react";
import Sidebar from "../components/sidebar/page";
import { Flex } from "antd";

function Organisation() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "240px" }}>
        <Sidebar />
      </div>
      <div>
        <h1 style={{ margin: "180px 240px", textAlign: "center" }}>
          This page is yet to build
        </h1>
      </div>
    </div>
  );
}

export default Organisation;
