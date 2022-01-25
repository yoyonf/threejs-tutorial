import * as React from "react";
import { GlobalStyle } from "../Global/Global.styles";
import styled from 'styled-components'
import Navbar from "../Navbar/Navbar";
export const Main = styled.section`
  /* overflow: hidden; */

`
const Layout = props => {

  return (
    <div>
      <Navbar />
      <GlobalStyle />
      <Main>{props.children}</Main>
    </div>
  );
};

export default Layout;
