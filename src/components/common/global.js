import { createGlobalStyle } from 'styled-components';


export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  html{
    overflow-y: scroll;
     /*永遠保留給卷軸的寬度  */
  }
  
  html ,body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    width:100%;
    height:100%;
    margin: 0;   
    padding: 0;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
  
    color: inherit;
    text-decoration: none; 
  }


  /* 必填欄位加上星號 */
  label:has(+input:required , +textarea:required)::before{
  content: '* ';
  color: #F4473B;
  }

  `
