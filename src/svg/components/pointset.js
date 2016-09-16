
class Pointset {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.lineGenerator = d3.line()
                .x((d) => xAxis.scale()(d.x))
    .y((d) => yAxis.scale()(d.y));
    }
}