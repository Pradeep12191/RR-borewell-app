import { RpmValue } from './RpmValue';

export interface RpmTableData {
    previousStockFT?: RpmValue[],
    rrIncome?: RpmValue[],
    mmIncome?: RpmValue[],
    availableStock?: RpmValue[],
    pointExpenseFeet?: RpmValue[],
    balanceStockFeet?: RpmValue[],
    vehicleInOut?: RpmValue[],
    damageFeet?: RpmValue[]
}