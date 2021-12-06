import { writable } from 'svelte/store';

export const components = writable([]);

export const menuComponents = writable([
  {name: 'circleGreen', dragOn: false, r: "30", cx: 0, cy: 0, fill: "green"},
  {name: 'circleWhite', dragOn: false, r: "30", cx: 0, cy: 150, fill: "#FFf"},
  {name: 'circleRed', dragOn: false, r: "30", cx: 50, cy: 100, fill: "red"},
  {name: 'circleYellow', dragOn: false, r: "30", cx: 100, cy: 50, fill: "yellow"},
  {name: 'circleBlue', dragOn: false, r: "30", cx: 150, cy: 0, fill: "blue"},
]);

