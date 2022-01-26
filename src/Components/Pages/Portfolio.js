import React, { useRef } from "react";
import Layout from "../Layout/Layout";
import styled from "styled-components";
import TestEnvironment from "../../Environment/TestEnvironment";
import CubeEnvironment from "../../Environment/CubeEnvironment";
import PortfolioEnvironment from "../../Environment/PortfolioEnvironment";

const PortfolioWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const Portfolio = () => {
  return (
    <Layout>
        <PortfolioEnvironment />
    </Layout>
  );
};

export default Portfolio;
