import { Observable } from 'rxjs';

export interface IWebSocketMessage<T> {
	type: string;
	data: T;
}

export interface IWebSocketError {
    error_msg: string;
}

export interface IWebSocketResult<T> {
    task_id: string;
    status: string;
    result: T;
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
