import { IUserMe } from './auth.interfaces';

export interface IImageCorrelationList {
    id: number;
    author: IUserMe;
    image_1: string;
    image_2: string;
    task_id: string;
}

export interface IImageCorrelation {
    id: number;
    author: IUserMe;
    image_1: string;
    image_2: string;
    task_id: string;
}

interface IAxes {
    x: number[][];
    y: number[][];
    z: number[][];
}

export interface IImageCorrelationResult {
    correlation_result: string;
    image_1_with_found_area: string;
    axes: IAxes;
}
