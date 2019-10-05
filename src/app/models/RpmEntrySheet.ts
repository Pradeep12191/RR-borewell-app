import { RpmEntry } from './RpmEntry';

export interface RpmEntrySheet {
    book_id: number;
    end: number;
    rpm_sheet_no: number;
    f_rpm_table_data: RpmEntry[],
    start: number;
    vehicle_id: number;
}