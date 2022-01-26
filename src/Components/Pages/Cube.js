import React, { useRef } from "react";
import Layout from "../Layout/Layout";
import styled from "styled-components";
import TestEnvironment from "../../Environment/TestEnvironment";
import CubeEnvironment from "../../Environment/CubeEnvironment";


const Cube = () => {
  return (
    <Layout>
        <CubeEnvironment />
    </Layout>
  );
};

export default Cube;
