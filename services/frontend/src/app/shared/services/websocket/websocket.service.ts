import { Injectable, OnDestroy, Inject } from '@angular/core';

import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import { filter, map, share, distinctUntilChanged, takeWhile } from 'rxjs/operators';

import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import { IWebSocketConfig, IWebSocketMessage, IWebSocketService } from '../../interfaces/websocket.interfaces';
import { webSocketConfig } from './websocket.config';

import { MaterializeService } from '../utils/materialize.service';

@Injectable({
	providedIn: 'root'
})
export class WebSocketService implements IWebSocketService, OnDestroy {
	private config: WebSocketSubjectConfig<IWebSocketMessage<any>>;

	private webSocket$: WebSocketSubject<IWebSocketMessage<any>>;
	private webSocketMessages$: Subject<IWebSocketMessage<any>>;

	private webSocketSub: SubscriptionLike;
	private statusSub: SubscriptionLike;

	private connection$: Observer<boolean>;

	private reconnection$: Observable<number>;
	private reconnectInterval: number;
	private reconnectAttempts: number;
	private isConnected: boolean;

	public status: Observable<boolean>;

	constructor(@Inject(webSocketConfig) private webSocketConfig: IWebSocketConfig) {
		this.webSocketMessages$ = new Subject<IWebSocketMessage<any>>();

		this.reconnectInterval = webSocketConfig.reconnectInterval || 5000;
		this.reconnectAttempts = webSocketConfig.reconnectAttempts || 10;

		this.config = {
			url: webSocketConfig.url,
			closeObserver: {
				next: (event: CloseEvent) => {
					this.webSocket$ = null;
					this.connection$.next(false);
				}
			},
			openObserver: {
				next: (event: Event) => {
					// MaterializeService.toast({'Success': 'WebSocket connected!'});
					this.connection$.next(true);
				}
			}
		};

		this.status = new Observable<boolean>((observer) => {
			this.connection$ = observer;
		}).pipe(share(), distinctUntilChanged());

		this.statusSub = this.status
			.subscribe((isConnected) => {
				this.isConnected = isConnected;

				if (! this.reconnection$ && typeof(isConnected) === 'boolean' && !isConnected) {
					this.reconnect();
				}
			});

		this.webSocketSub = this.webSocketMessages$
			.subscribe(null, (error: ErrorEvent) => {
				MaterializeService.toast(error.error);
			});

		this.connect();
	}

	ngOnDestroy() {
		this.webSocketSub.unsubscribe();
		this.statusSub.unsubscribe();
	}

	private connect(): void {
		this.webSocket$ = new WebSocketSubject(this.config);
		this.webSocket$
			.subscribe(
				(message) => {
					this.webSocketMessages$.next(message);
				},
				(error: Event) => {
					if (!this.webSocket$) {
						this.reconnect();
					}
				}
			);
	}

	private reconnect(): void {
		this.reconnection$ = interval(this.reconnectInterval)
			.pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.webSocket$));

		this.reconnection$
			.subscribe(
				() => {
					this.connect();
				},
				null,
				() => {
					this.reconnection$ = null;

					if (!this.webSocket$) {
						this.webSocketMessages$.complete();
						this.connection$.complete();
					}
				}
			);
	}

	public on<T>(type: string): Observable<T> {
		if (type) {
			return this.webSocketMessages$
				.pipe(
					filter((message: IWebSocketMessage<T>) => message.type === type),
					map((message: IWebSocketMessage<T>) => message.data)
			);
		}
	}

	public send(method: string, body: any={}): void {
		if (method && this.isConnected) {
			this.webSocket$.next(<any>{
                'method': method,
                'body': body,
            });
		} else {
			MaterializeService.toast({'error': 'Send error'});
		}
	}
}
