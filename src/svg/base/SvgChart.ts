import Container from '../components/Container';
import Config from '../../Config';

class SvgChart {

    protected container: Container;

    constructor(config: Config) {
        this.container = new Container(config);

    }

}

export default SvgChart;