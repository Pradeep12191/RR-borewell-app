import { RpmValue } from './RpmValue';

export interface RpmTableData {
    previousStockFeet?: RpmValue[],
    rrIncome?: RpmValue[],
    mmIncome?: RpmValue[],
    availableStockFeet?: RpmValue[],
    pointExpenseFeet?: RpmValue[],
    balanceStockFeet?: RpmValue[],
    vehicleExIn? : RpmValue[],
    vehicleExOut?: RpmValue[],
    damageFeet?: RpmValue[],
}