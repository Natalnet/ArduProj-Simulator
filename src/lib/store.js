import { writable } from 'svelte/store';
import dataComponents from './dataComponents';

export const components = writable([]);

export const menuComponents = writable(dataComponents);

