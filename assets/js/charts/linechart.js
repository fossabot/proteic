var data =[
                {
                    key: 'serie1', 
                    values: [
                        {x:1, y:3},
                        {x:2, y:12},
                        {x:3, y:21},
                        {x:4,y:5},
                        {x:5,y:5},
                        {x:6,y:34},
                        {x:7,y:4},
                        {x:8,y:12},
                        {x:9,y:32},
                        {x:10,y:15},
                        {x:11,y:5},
                        {x:12,y:2}
                    ]
                },
                {
                    key: 'serie2', 
                    values: [
                        {x:1, y:1},
                        {x:2, y:4},
                        {x:3, y:12},
                        {x:4,y:11},
                        {x:5,y:11},
                        {x:6,y:12},
                        {x:7,y:13},
                        {x:8,y:1},
                        {x:9,y:0},
                        {x:10,y:1},
                    ]
                },
                {
                    key: 'serie3', 
                    values: [
                        {x:1, y:30},
                        {x:2, y:13},
                        {x:3, y:1},
                        {x:4,y:4},
                        {x:5,y:5},
                        {x:6,y:7},
                        {x:7,y:9},
                        {x:8,y:12},
                        {x:9,y:12},
                        {x:10,y:12},
                        {x:11,y:68},
                    ]
                }
            ];

//Default config uses #chart selector
linechart = new Linechart(data, {'selector': '#linechart', height: 250, area:true});
linechart.draw();