import { AboveFeet } from './AboveFeet';
import { Air } from '../Air';

export interface Depth {
    average: number;
    bore: number;
    rebore_hrs: number;
    rebore_mins: number;
    pipe_erection: number;
    bore_type: string;
    bore_id: number;
    above: AboveFeet;
    air: Air
}