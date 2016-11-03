export interface SvgStrategy {
    draw(): void;
}

export class SvgContext {
    private strategy: SvgStrategy;
    
    constructor(strategy: SvgStrategy) {
        this.strategy = strategy;
    }

    public draw(): void {
        this.strategy.draw();
    }
}