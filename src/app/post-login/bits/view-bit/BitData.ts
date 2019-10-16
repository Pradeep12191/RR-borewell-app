import { AssignBit } from './AssignBit';

export interface BitData {
    bit_id: number,
    bit_size: number,
    bit_type: string,
    company_id: number,
    company_name: string,
    date: string,
    id: number,
    k_assign_bits: AssignBit[],
    quantity: number,
    remarks: string,
}