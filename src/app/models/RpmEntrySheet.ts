import { RpmEntry } from './RpmEntry';
import { RpmTableData } from './RpmTableData';
import { RpmDetails } from './RpmEntry/RpmDetails';
import { VehicleServices } from './VehicleServices';
import { Diesel } from './RpmEntry/Diesel';
import { Depth } from './RpmEntry/Depth';
import { BitDetail } from './RpmEntry/BitDetail';

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
    bit?: BitDetail;
    rpm?: RpmDetails,
    service?: VehicleServices;
    diesel?: Diesel;
    depth?: Depth;
    vehicle_no?: string;
    remarks?: string;
    date?: string;
    rpmTableData?: RpmTableData
}