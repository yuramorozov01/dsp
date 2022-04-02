import { Observable } from 'rxjs';
import { JsonObject } from '@angular/compiler-cli/ngcc/src/packages/entry_point';

export declare type statusValues = 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'RETRY' | 'REVOKED';

export interface IWebSocketMessage<T> {
	type: string;
	data: T;
}

export interface IWebSocketError {
    errors: JsonObject;
}

export interface IWebSocketResult<T> {
    task_id: string;
    status: statusValues;
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
