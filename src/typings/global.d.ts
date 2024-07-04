declare module '*.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module 'markdown-it-katex'


interface Window {
  ethereum: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
}
