import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// const config : ThemeConfig = {
//   initialColorMode: "dark",
//   useSystemColorMode: false,
// }

const theme = extendTheme({
  fonts: {
    body: "mono",
  },
  initialColorMode: "dark",
  useSystemColorMode: false,
  breakpoins: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
  colors: {
    pink: {
      500: '#93ffe9',
      20: '#dc6f75'
    },
  },
  styles: {
    global: (props) => ({
      body: {
        // overflow: 'hidden',
        fontFamily: 'body',
        bg: mode('white.200', 'gray.900')(props),
      },
    }),
  },
});

export default theme;
