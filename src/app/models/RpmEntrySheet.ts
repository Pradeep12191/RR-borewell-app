import { RpmEntry } from './RpmEntry';
import { RpmTableData } from './RpmTableData';

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
    vehicle_no?: string;
    remarks?: string;
    date?: string;
    rpmTableData?: RpmTableData
}