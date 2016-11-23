import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category7(),
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //Width & height
    width: '100%', // %, auto, or numeric
    height: 250,
    //Node
    nodeRadius: 8.5,
    legend:true,
    //Events
    onDown(d: any) {
    },
    onHover(d: any) {
    },
    onLeave(d: any) {
    },
    onClick(d: any) {
    },
    onUp(d: any) {
    }
};