import { Observable } from 'rxjs';

export interface IWebSocket<T> {
    task_id: string;
    status: string;
    result: T;
    error: boolean;
    error_msg: string;
}

export interface IWebSocketService {
	status: Observable<boolean>;

	on<T>(type: string): Observable<T>;
	send(type: string, data: any): void;
}

export interface IWebSocketConfig {
	url: string;
	reconnectInterval?: number;
	reconnectAttempts?: number;
}

export interface IWebSocketMessage<T> {
	type: string;
	data: T;
}
