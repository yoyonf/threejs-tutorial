
import React, { useRef } from "react";
import Layout from "../Layout/Layout";
import styled from "styled-components";

const HomeWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Bio = styled.p`
    width: 60%;
    text-align: center;
` 
const Home = () => {
  return (
    <Layout>
        <HomeWrapper>
            <h1> Thomas' favourite things </h1>
            <Bio>
            Adipisicing four dollar toast labore lomo pok pok, in craft beer kogi sriracha vice gentrify. Ut laborum voluptate nulla tempor ea consectetur before they sold out bushwick etsy hammock vegan blue bottle.
            </Bio>
        </HomeWrapper>
    </Layout>
  );
};

export default Home;
