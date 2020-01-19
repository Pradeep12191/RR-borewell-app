import { RpmEntry } from './RpmEntry';
import { RpmTableData } from './RpmTableData';
import { RpmDetails } from './RpmEntry/RpmDetails';
import { VehicleServices } from './VehicleServices';
import { Diesel } from './RpmEntry/Diesel';
import { Depth } from './RpmEntry/Depth';
import { BitDetail } from './RpmEntry/BitDetail';
import { RpmVehicleExchage } from './RpmVehicleExchange';
import { UserDetails } from './UserDetails';
import { MonthDetails } from './MonthDetails';
import { Air } from './Air';
import { HammerDetail } from './RpmEntry/HammerDetail';
import { VehicleExOut } from './VehicleExOut';

export interface RpmEntrySheet {
    book_id: number;
    end: number;
    start: number;
    rpm_sheet_no: number;
    f_rpm_table_data: RpmEntry[],
    month_data?: MonthDetails,
    vehicle_id: number;
    rpm_vehicle_exchange? : RpmVehicleExchage;
    bit?: BitDetail;
    hammer?: HammerDetail
    rpm?: RpmDetails,
    service?: VehicleServices;
    diesel?: Diesel;
    depth?: Depth;
    vehicle_no?: string;
    remarks?: string;
    date?: string;
    book_page_over?: boolean;
    rpmTableData?: RpmTableData,
    user_address: UserDetails,
    vehicle_ex_out: VehicleExOut[]
}