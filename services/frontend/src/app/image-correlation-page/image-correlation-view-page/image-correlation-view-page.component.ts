import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ImageCorrelationService } from '../../shared/services/image-correlation/image-correlation.service';
import { IImageCorrelation, IImageCorrelationResult } from '../../shared/interfaces/image-correlation.interfaces';

import { MaterializeService } from '../../shared/services/utils/materialize.service';
import { AuthService } from '../../shared/services/auth/auth.service';

import { WebSocketService } from '../../shared/services/websocket/websocket.service';
import { webSocketConfig } from '../../shared/services/websocket/websocket.config';
import { IWebSocketMessage, IWebSocketResult, IWebSocketError, statusValues } from '../../shared/interfaces/websocket.interfaces';
import { WS_EVENTS } from '../../shared/services/websocket/websocket.events';
import { WS_METHODS } from '../../shared/services/websocket/websocket.methods';

import { DOCUMENT } from '@angular/common';

type IWebSocketResultError = IWebSocketError;
type IWebSocketImageCorrelationResult = IWebSocketResult<IImageCorrelationResult>;

@Component({
    selector: 'app-image-correlation-view-page',
    templateUrl: './image-correlation-view-page.component.html',
    styleUrls: ['./image-correlation-view-page.component.css'],
    providers: [
        WebSocketService,
        {
            provide: webSocketConfig,
            useValue: {
                url: environment.ws_base + '/image_correlation_result/',
            },
        },
    ],
})
export class ImageCorrelationViewPageComponent implements OnInit, AfterViewInit {
    @ViewChild('materialboxImage1') materialboxImage1Ref: ElementRef;
    @ViewChild('materialboxImage2') materialboxImage2Ref: ElementRef;
    @ViewChild('materialboxImageCorrelationResult') materialboxImageCorrelationResultRef: ElementRef;
    @ViewChild('materialboxImageFoundImage') materialboxImageFoundImageRef: ElementRef;

    public hostBase = environment.hostBase;

    public loadStatus: statusValues = 'PENDING';
	public imageCorrelation: IImageCorrelation;
    public imageCorrelationResult: IImageCorrelationResult;
    public plotData = [];
    public plotLayout = {};
    public plotConfig = {};

    private imageCorrelationError$: Observable<IWebSocketResultError>;
    private imageCorrelationResult$: Observable<IWebSocketImageCorrelationResult>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private auth: AuthService,
                private imageCorrelationService: ImageCorrelationService,
                private webSocketService: WebSocketService,
                @Inject(DOCUMENT) private document: Document) {
    }

    public ngOnInit(): void {
        this.subscribeOnErrorMessages();
        this.subscribeOnResultMessages();
        this.subscribeOnConnectMessages();
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            MaterializeService.initializeMaterialbox(this.materialboxImage1Ref);
            MaterializeService.initializeMaterialbox(this.materialboxImage2Ref);
        }, 1000);
        setTimeout(() => {
            MaterializeService.initializeMaterialbox(this.materialboxImageCorrelationResultRef);
            MaterializeService.initializeMaterialbox(this.materialboxImageFoundImageRef);
        }, 2000);
    }

    private getImageCorrelation() {
        this.route.params
			.pipe(
				switchMap(
					(params: Params) => {
						if (params['id']) {
							return this.imageCorrelationService.getById(params['id']);
						}
						return of(null);
					}
				)
			)
			.subscribe(
				(imageCorrelation: IImageCorrelation) => {
					if (imageCorrelation) {
						this.imageCorrelation = imageCorrelation;
                        this.getImageCorrelationResultByWebsocket();
					}
				},
				error => MaterializeService.toast(error.error),
			);
    }

    private getImageCorrelationResultByWebsocket() {
        this.webSocketService.send(WS_METHODS.WS_GET, {
            'task_id': this.imageCorrelation.task_id,
        });
    }

    private subscribeOnErrorMessages() {
        this.imageCorrelationError$ = this.webSocketService.on<IWebSocketResultError>(WS_EVENTS.WS_ERROR_EVENT_KEY);
        this.imageCorrelationError$.subscribe((message: IWebSocketResultError) => {
            MaterializeService.toast(message.errors);
        });
    }

    private subscribeOnResultMessages() {
        this.imageCorrelationResult$ = this.webSocketService.on<IWebSocketImageCorrelationResult>(WS_EVENTS.WS_TASK_READY_EVENT_KEY);
        this.imageCorrelationResult$.subscribe((message: IWebSocketImageCorrelationResult) => {
            this.parseResult(message);
            if (['PENDING', 'STARTED'].includes(message.status)) {
                this.getImageCorrelationResultByWebsocket();
            }
        });
    }

    private subscribeOnConnectMessages() {
        this.webSocketService.on<IWebSocketImageCorrelationResult>(WS_EVENTS.WS_CONNECT_EVENT_KEY)
            .subscribe((message: IWebSocketImageCorrelationResult) => {
                this.getImageCorrelation()
            });
        }

    private parseResult(message: IWebSocketImageCorrelationResult) {
        this.loadStatus = message.status;

        if (this.loadStatus == 'SUCCESS') {
            // Parse correlation result
            this.imageCorrelationResult = message.result;
            this.plotData = [{
                z: this.imageCorrelationResult.axes.z,
                type: 'surface',
            }];
            this.plotLayout = {
                title: 'Correlation result surface',
                width: 1200,
            };
            this.plotConfig = {
                responsive: true,
            };
        }
    }

    public deleteImageCorrelation() {
		const decision = window.confirm('Are you sure you want to delete this image correlation?');
		if (decision) {
			this.imageCorrelationService.delete(this.imageCorrelation.id)
				.subscribe(
					response => MaterializeService.toast({'Success': 'Image correlation has been deleted successfully'}),
					error => MaterializeService.toast(error.error),
					() => this.router.navigate(['/image_correlation'])
				);
		}
	}
}
