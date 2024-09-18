// / <reference types="vite/client" />

interface Window {
  ethereum: any;
}

declare module './TransactionHistoryChecking.js' {
  export function fetchAssetTransfers(address: string): Promise<number>;
}