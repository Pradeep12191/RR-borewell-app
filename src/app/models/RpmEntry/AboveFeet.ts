import { ServiceLimit } from '../Limit';

export interface AboveFeet {
    feet: ServiceLimit;
    extra_feet?: number;
    hrs: number;
    min: number;
}