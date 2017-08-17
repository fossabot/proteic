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
        let buttonPosition = this.config.get('buttonPosition') || 'bottom',
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

        switch (buttonPosition) {
            case 'right':
                this.drawRightPauseButton(pause, width, height);
                break;
            case 'bottom':
                this.drawBottomPauseButton(pause, width, height);
                break;
        }

        select(selector)
            .on('mouseover', function() { pause.select('.pause-button').style('opacity', 1); })
            .on('mouseout', function() { pause.select('.pause-button').style('opacity', 0); });

    }

    public update(data: any) {}

    public clear() {}

    public transition() {}

    private drawRightPauseButton(pauseElement: any, width: number, height: number) {
        pauseElement.select('.pause-button')
            .attr('x', width + 20)
            .on('click.mine', function() {
                let pause = (select(this).attr('pause') == 'false') ? false : true;

                if (!pause) {
                    select(this)
                        .attr('xlink:href', '../../../images/play-button.svg')
                        .attr('pause', true);
                } else {
                    select(this)
                        .attr('xlink:href', '../../../images/pause-button.svg')
                        .attr('pause', false);
                }
            });
    }

    private drawBottomPauseButton(pauseElement: any, width: number, height: number) {
        pauseElement.select('.pause-button')
            .attr('x', -50)
            .attr('y', height + 65)
            .on('click', function() {
                let pause = (select(this).attr('pause') == 'false') ? false : true;

                if (!pause) {
                    select(this)
                        .attr('xlink:href', '../../../images/play-button.svg')
                        .attr('pause', true);
                } else {
                    select(this)
                        .attr('xlink:href', '../../../images/pause-button.svg')
                        .attr('pause', false);
                }
            });
    }
}

export default PauseSet;
