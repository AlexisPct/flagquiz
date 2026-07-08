// 1. L'ASTUCE MAGIQUE : On simule un environnement CommonJS pour satisfaire la lib
if (typeof window !== 'undefined' && !(window as any).require) {
  (window as any).require = (moduleName: string) => {
    if (moduleName === 'prop-types') {
      // On renvoie un faux objet prop-types vide pour éviter que ça plante
      return {
        array: () => {}, bool: () => {}, func: () => {}, number: () => {},
        object: () => {}, string: () => {}, symbol: () => {}, any: () => {},
        arrayOf: () => {}, element: () => {}, elementType: () => {}, instanceOf: () => {},
        node: () => {}, objectOf: () => {}, oneOf: () => {}, oneOfType: () => {},
        shape: () => {}, exact: () => {}, checkPropTypes: () => {},
      };
    }
    throw new Error(`Cannot require module ${moduleName} in browser context`);
  };
}

// 2. Le reste de tes imports habituels
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);