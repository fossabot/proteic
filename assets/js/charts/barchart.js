 var bData = [
                {
                  key: '2005',
                  values: [
                    {x:"España", y:3},  
                    {x:"Francia", y:12},
                    {x:"UK", y:21},
                  ]
                },
                {
                  key: '2008',
                  values: [
                    {x:"España", y:9},  
                    {x:"Francia", y:20},
                    {x:"UK", y:20},
                  ]
                },
                {
                  key: '2011',
                  values: [
                    {x:"España", y:12},  
                    {x:"Francia", y:11},
                    {x:"UK", y:32},
                  ]
                },
                {
                  key: '2014',
                  values: [
                    {x:"España", y:11},  
                    {x:"Francia", y:8},
                    {x:"UK", y:21},
                  ]
                }
            ];
//Default config uses #chart selector
barchart = new Barchart(bData, {'selector': '#barchart', height: 250});
barchart.draw();