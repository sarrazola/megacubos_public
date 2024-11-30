declare global {
    interface Window {
      L: any;
    }
  }
  
  export interface MapComponentProps {
    latitude: number;
    longitude: number;
  }