import { RpmEntry } from './RpmEntry';

export interface RpmEntrySheet {
    book_id: number;
    end: number;
    rpm_sheet_no: number;
    f_rpm_table_data: RpmEntry[],
    start: number;
    vehicle_id: number;
    vehicle_in_id: number;
    vehicle_in_rpm_sheet_no: number;
    vehicle_out_id: number;
    vehicle_out_rpm_sheet_no: number;
    remarks?: string;
    date?: string;
}