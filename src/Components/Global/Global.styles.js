import styled, { createGlobalStyle } from "styled-components";
export const size = {
    mobileS: "320px",
    mobileM: "420px",
    mobileL: "520px",
    mobileSL: "568px",
    mobileXL: "736px",
    tablet: "768px",
    tabletL: "1023px",
    laptop: "1024px",
    laptopM: "1124px",
    laptopL: "1400px",
    desktopS: "1600px",
    desktopM: "1900px",
    desktop: "2260px"
  };

  export const Colours = {
      dark_purple : 'rgb(54, 54, 82)',
      light_purple : 'rgb(240, 235, 255)',
  }

export const GlobalStyle = createGlobalStyle`
  ${'' /* @font-face {
    font-family: 'TypeWriterRegular';
    src: url(${TypeWriterRegular}) format('truetype');
    font-weight: normal;
    font-style: normal;
  } */}

  * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;

  }
    }

html, body {
  margin: 0;
  overflow: hidden;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}

.leaflet-container {
  width: 100%;
  height: 100vh;
}


h1,h2,h3,h4,h5,h6 {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    font-weight: 100;
    color: ${Colours.dark_purple};
    }
  a {
    text-decoration: underline;
    color: black;
    font-weight: 100 !important;
  }
  h1 {
  margin-bottom: 1.45rem;
  font-size: 2.5rem;
  line-height: 1.1;
}
h2 {
  margin-bottom: 1.45rem;
  font-size: 1.62671rem;
  line-height: 1.1;
}
h3 {
  margin-bottom: 1.45rem;
  font-size: 1.38316rem;
  line-height: 1.1;
}
h4 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  line-height: 1.1;
}
h5 {
  margin-bottom: 1.45rem;
  font-size: 0.85028rem;
  line-height: 1.1;
}
h6 {
  margin-bottom: 1.45rem;
  font-size: 0.78405rem;
}
img {
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
p, li, a, span{
    color: ${Colours.dark_purple};

  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  font-size: 1.9rem;
  letter-spacing: 0.03em;
  line-height: 1.05em;
}









`;