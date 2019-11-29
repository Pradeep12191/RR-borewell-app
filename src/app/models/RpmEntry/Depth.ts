import { AboveFeet } from './AboveFeet';
import { Air } from '../Air';

export interface Depth {
    average: number;
    bore: number;
    pipe_erection: number;
    bore_type: string;
    above: AboveFeet;
    air: Air
}