declare module 'usetiful-sdk' {
  export function loadUsetifulScript(token: string): void;
  export function setUsetifulTags(tags: {
    userId: string;
    name: string;
    role: string;
    company_id: string;
    company_name: string;
    [key: string]: string;
  }): void;
} 