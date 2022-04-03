import { IUserMe } from './auth.interfaces';

export interface IFourierTransformList {
    id: number;
    author: IUserMe;
    amplitudes: string;
    frequencies: string;
    task_id: string;
}

export interface IFourierTransform {
    id: number;
    author: IUserMe;
    amplitudes: string;
    frequencies: string;
    task_id: string;
}

export interface IFourierTransformResult {
    time: number[];
    result_values: number[];
    harmonics_values: number[][];
    fft_values: number[];
}
