import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import App from './App';
import { RecoilRoot } from 'recoil';
import { darkTheme, lightTheme } from './theme';

const GlobalStyle = createGlobalStyle`
body{
  background-color: ${({ theme }) => theme.bgColor};
}
*{margin: 0; padding: 0; box-sizing:border-box; color:${({ theme }) =>
  theme.textColor};
font-family  :${({ theme }) => theme.fontFamilly} ;
}
li{list-style: none;}
a{color:inherit; text-decoration: none;}

`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RecoilRoot>
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
