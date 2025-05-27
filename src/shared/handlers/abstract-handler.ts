export abstract class ChainHandler {
	nextHandler: ChainHandler | null = null;

	setNext(handler: ChainHandler): ChainHandler {
		this.nextHandler = handler;
		return handler;
	}

	handle(request: any): any {
		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
	}
}
