// import { StyleSheet } from 'react-native-unistyles';

// const sharedColors = {
//     barbie: '#ff9ff3',
//     oak: '#1dd1a1',
//     sky: '#48dbfb',
//     fog: '#c8d6e5',
//     aloes: '#00d2d3',
//     blood: '#ff6b6b',
//     mango: '#ffb142',
//     navy: '#34495e',
//     coral: '#ff7f50',
//     mint: '#98ff98',
//     lavender: '#8e44ad',
//     gold: '#f39c12',
//     turquoise: '#1abc9c',
//     salmon: '#ff6a6a',
//     plum: '#9b59b6',
//     charcoal: '#2d3436',
//     teal: '#16a085',
//     peach: '#ff914d',
//     indigo: '#4b0082',
//     mustard: '#e67e22',
// };

// const lightTheme = {
//     colors: {
//         ...sharedColors,
//         backgroundColor: '#ffffff',
//         typography: '#000000',
//         accent: sharedColors.blood,
//     },
//     canvas: {
//         colour: '#ffffff',
//     },
//     button: {
//         primaryBackgroundColor: sharedColors.oak,
//         secondaryBackgroundColor: sharedColors.sky,
//         textColor: '#ffffff',
//         borderColor: '#000000',
//         pressedBackgroundColor: sharedColors.aloes,
//         disabledBackgroundColor: sharedColors.fog,
//     },
//     gap: (v: number) => v * 8
// };

// const darkTheme = {
//     colors: {
//         ...sharedColors,
//         backgroundColor: '#000000',
//         typography: '#ffffff',
//         accent: sharedColors.barbie,
//     },
//     canvas: {
//         colour: '#ffffff',
//     },
//     button: {
//         primaryBackgroundColor: sharedColors.sky,
//         secondaryBackgroundColor: sharedColors.barbie,
//         textColor: '#000000',
//         borderColor: '#ffffff',
//         pressedBackgroundColor: sharedColors.oak,
//         disabledBackgroundColor: sharedColors.fog,
//     },
//     gap: (v: number) => v * 8
// };

// const premiumTheme = {
//     colors: {
//         ...sharedColors,
//         backgroundColor: sharedColors.barbie,
//         typography: '#76278f',
//         accent: '#000000',
//     },
//     canvas: {
//         colour: '#ffffff',
//     },
//     button: {
//         primaryBackgroundColor: sharedColors.aloes,
//         secondaryBackgroundColor: sharedColors.sky,
//         textColor: '#ffffff',
//         borderColor: '#000000',
//         pressedBackgroundColor: sharedColors.oak,
//         disabledBackgroundColor: sharedColors.fog,
//     },
//     gap: (v: number) => v * 8
// };

// const themes = {
//     light:  lightTheme,
//     dark:  darkTheme,
//     premium:  premiumTheme
// }

// const settings = {
//     intialTheme: lightTheme,
//     adaptiveThemes: true,   
// };

// const breakpoints = {
//     xs: 0,
//     sm: 300,
//     md: 500,
//     lg: 800,
//     xl: 1200,
//  };

//  // No Type implementation as of yet?
// type AppBreakpoints = typeof breakpoints;
// type AppThemes = typeof themes;


// declare module 'react-native-unistyles' {
//     export interface UnistylesThemes extends AppThemes {}
//     export interface UnistylesBreakpoints extends AppBreakpoints {}
// }

// StyleSheet.configure({
//   settings,
//   breakpoints,
//   themes,
// });
