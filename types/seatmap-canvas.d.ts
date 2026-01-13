declare module '@alisaitteke/seatmap-canvas' {
  export class SeatMapCanvas {
    constructor(container: string | HTMLElement, config?: any);
    setData(data: any): void;
    addEventListener(event: string, callback: (data: any) => void): void;
    seatSelect(seat: any): void;
    seatUnselect(seat: any): void;
    getSelectedSeats(): any[];
    data?: {
      replaceData(blocks: any[]): void;
    };
    destroy?(): void;
  }
  export default SeatMapCanvas;
}

declare module '@alisaitteke/seatmap-canvas/dist/esm/seatmap.canvas.css' {
  const content: string;
  export default content;
}

