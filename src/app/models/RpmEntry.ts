import { RpmVehicleExchage } from './RpmVehicleExchange';

export interface RpmEntry {
    balance_stock_feet: number;
    damage_feet: number;
    mm_income: number;
    pipe_id: number;
    pipe_size: number;
    pipe_type: string;
    point_expenses_feet: number;
    previous_stock_feet: number;
    rr_income: number;
    vehicle_ex_in: number;
    vehicle_ex_out: any;
    rr_income_feet?: number;
    mm_income_feet?: number;
    available_stock_feet?: number;
}