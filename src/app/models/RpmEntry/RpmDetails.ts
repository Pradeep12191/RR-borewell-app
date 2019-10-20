export interface RpmDetails {
    start: number;
    end: number;
    manual: number;
    running: number;
    point_diesel: number;
    total?: number;
    prev_diesel_rpm?: number;
}