export interface RpmDetails {
    tractor_start_hour: number;
    tractor_end_hour: number;
    start: number;
    end: number;
    manual: number;
    running: number;
    point_diesel: number;
    total?: number;
    prev_diesel_rpm?: number;
}