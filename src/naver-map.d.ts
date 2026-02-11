/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  naver?: any;
}

declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement, options: any);
    setSize(size: Size): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Size {
    constructor(width: number, height: number);
  }

  enum Position {
    RIGHT_CENTER,
  }
}
