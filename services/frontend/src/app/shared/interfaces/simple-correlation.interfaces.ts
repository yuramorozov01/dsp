import { IUserMe } from './auth.interfaces';

export interface ISimpleCorrelationList {
    id: number;
    author: IUserMe;
    amplitudes_signal_1: string;
    frequencies_signal_1: string;
    amount_of_points_signal_1: number;
    amplitudes_signal_2: string;
    frequencies_signal_2: string;
    amount_of_points_signal_2: number;
    task_id: string;
}

export interface ISimpleCorrelation {
    id: number;
    author: IUserMe;
    amplitudes_signal_1: string;
    frequencies_signal_1: string;
    amount_of_points_signal_1: number;
    amplitudes_signal_2: string;
    frequencies_signal_2: string;
    amount_of_points_signal_2: number;
    task_id: string;
}

interface ISignalResult {
    time: number[];
    result_values: number[];
}

export interface ISimpleCorrelationResult {
    signal_1: ISignalResult;
    signal_2: ISignalResult;
    correlation: [];
}
