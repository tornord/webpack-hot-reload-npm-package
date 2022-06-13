import React from "react";
import ReactDOM from "react-dom/client";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

const GlobalStyles = css`
  body {
    margin: 0;
    overflow-x: hidden;
    font-family: sans-serif;
  }

  input,
  textarea,
  button {
    font-family: inherit;
  }
`;

import { Header } from "common";

function App() {
  const StyledApp = styled.div``;
  console.log(GlobalStyles);
  return (
    <>
      <Global styles={GlobalStyles} />
      <StyledApp>
        <Header name={"meow"} />
      </StyledApp>
    </>
  );
}

var rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
