import { IUserMe } from './auth.interfaces';

export interface IHarmonicSignalList {
    id: number;
    author: IUserMe;
    amplitude: number;
    frequency: number;
    initial_phase: number;
    task_id: string;
}

export interface IHarmonicSignal {
    id: number;
    author: IUserMe;
    amplitude: number;
    frequency: number;
    initial_phase: number;
    task_id: string;
}
