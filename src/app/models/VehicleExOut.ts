import { Vehicle } from './Vehicle';
import { PipeFeet } from './PipeFeet';

export interface VehicleExOut {
    vehicle: Vehicle;
    pipes: PipeFeet[];
    rpmNo: string;
}