import { writable } from 'svelte/store';

export const components = writable([
  {name: 'circleGreen', dragOn: false, r: "30", cx: 0, cy: 0, fill: "green" , editableAttributes: [
    {name: 'Nome:', key: 'name'},
    {name: 'Tamanho', key: 'r'},
    {name: 'Coordenada x', key: 'cx'},
    {name: 'Coordenada y', key: 'cy'},
    {name: 'Cor', key: 'fill'}
  ]}
]);

export const menuComponents = writable([
  {name: 'circleGreen', dragOn: false, r: "30", cx: 0, cy: 0, fill: "green" , editableAttributes: [
    {name: 'Nome:', key: 'name'},
    {name: 'Tamanho', key: 'r'},
    {name: 'Coordenada x', key: 'cx'},
    {name: 'Coordenada y', key: 'cy'},
    {name: 'Cor', key: 'fill'}
  ]},
  {name: 'circleWhite', dragOn: false, r: "30", cx: 0, cy: 150, fill: "#FFf", editableAttributes: [
    {name: 'Nome:', key: 'name'},
    {name: 'Tamanho', key: 'r'},
    {name: 'Coordenada x', key: 'cx'},
    {name: 'Coordenada y', key: 'cy'},
    {name: 'Cor', key: 'fill'}
  ]},
  {name: 'circleRed', dragOn: false, r: "30", cx: 50, cy: 100, fill: "red", editableAttributes: [
    {name: 'Nome:', key: 'name'},
    {name: 'Tamanho', key: 'r'},
    {name: 'Coordenada x', key: 'cx'},
    {name: 'Coordenada y', key: 'cy'},
    {name: 'Cor', key: 'fill'}
  ]},
  {name: 'circleYellow', dragOn: false, r: "30", cx: 100, cy: 50, fill: "yellow", editableAttributes: [
    {name: 'Nome:', key: 'name'},
    {name: 'Tamanho', key: 'r'},
    {name: 'Coordenada x', key: 'cx'},
    {name: 'Coordenada y', key: 'cy'},
    {name: 'Cor', key: 'fill'}
  ]},
  {name: 'circleBlue', dragOn: false, r: "30", cx: 150, cy: 0, fill: "blue", editableAttributes: [
    {name: 'Nome:', key: 'name'},
    {name: 'Tamanho', key: 'r'},
    {name: 'Coordenada x', key: 'cx'},
    {name: 'Coordenada y', key: 'cy'},
    {name: 'Cor', key: 'fill'}
  ]},
]);

