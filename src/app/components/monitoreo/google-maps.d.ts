declare namespace google.maps {
    export class Map {
      constructor(element: HTMLElement, options: any);
    }
  
    export class Marker {
      constructor(options: any);
    }
  
    export interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
  