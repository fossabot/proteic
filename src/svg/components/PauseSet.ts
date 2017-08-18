import Component from './Component';
import Config from '../../Config';
import Globals from '../../Globals';

import {
    selection,
    select,
    nest,
    mouse
} from 'd3';


class PauseSet extends Component {

    constructor() {
        super();
    }

    public render() {
        let buttonPosition = this.config.get('buttonPosition'),
            height: number = this.config.get('height'),
            width: number = this.config.get('width'),
            selector = this.config.get('selector');

        let pause = this.svg.append('g').attr('class', 'pause');

        pause.append('image')
            .attr('class', 'pause-button')
            .attr('xlink:href', '../../../images/pause-button.svg')
            .attr('width', 30)
            .attr('height', 30)
            .attr('pause', false);

        let thisInstance = this; // Assign instance to call instance's method in click event
        
        switch (buttonPosition) {
            case 'right':
                this.drawRightPauseButton(thisInstance, width, height);
                break;
            case 'bottom':
                this.drawBottomPauseButton(thisInstance, width, height);
                break;
        }

        select(selector)
            .on('mouseover', function() { pause.select('.pause-button').style('opacity', 1); })
            .on('mouseout', function() { pause.select('.pause-button').style('opacity', 0); });

    }

    public update(data: any) {
        // TODO
    }

    public clear() {}

    public transition() {}

    translate(x: Number, y: Number) {
        this.svg.select('.pause-button')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(${x}, ${y})`);
    }

    private drawRightPauseButton(thisInstance: any, width: number, height: number) {
        this.svg.select('.pause-button')
            .attr('x', width + 10)
            .attr('y', height - 30)
            .on('click', function() { thisInstance.toggle(); });
    }

    private drawBottomPauseButton(thisInstance: any, width: number, height: number) {
        this.svg.select('.pause-button')
            .attr('x', -50)
            .attr('y', height + 65)
            .on('click', function() { thisInstance.toggle(); });
    }

    private toggle(): void {
        let pause: boolean = (this.svg.select('.pause-button').attr('pause') == 'false') ? false : true;

        if (!pause) {
            this.pauseStreaming();
        } else {
            this.playStreaming();
        }
    }

    private pauseStreaming(): void {
        this.svg.select('.pause-button')
                .attr('xlink:href', '../../../images/play-button.svg')
                .attr('pause', true);
    }

    private playStreaming(): void {
        this.svg.select('.pause-button')
                .attr('xlink:href', '../../../images/pause-button.svg')
                .attr('pause', false);
    }

}

export default PauseSet;
