/*-------------------------------------------------------------------------

This is a test plugin wich create a linebar of nodes data in some div

-------------------------------------------------------------------------*/

//const d3 = require("./lib/d3/d3-3.5.6");


//Setup start

var D3BarLineData = function () {
    var BarDataObject,
        d3Container,
        margin,
        width,
        height,
        oneRowHeight,
        barHeight,
        SVGContainer,
        svgGroup,
        x;
    //Chart
    var _barLineData = function () {
        
        if (typeof d3 == 'undefined') {
            console.warn('Where is D3.js Jhonny?!');
            return;
        }

        //Variables and Options
        var 
            targetDiv = 'place_to_render_bars',
            barElement = document.getElementById(targetDiv),
            mtop = 0,
            mright = 20,
            mbottom = 30,
            mleft = 20;
        
        height = 50;
        oneRowHeight = 90;
        barHeight = 40;

        //Init start
        if (barElement) {
            //d3 container and size
            d3Container = d3.select(barElement);
            margin = { top: mtop, right: mright, bottom: mbottom, left: mleft };
            width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;

            SVGContainer = d3Container.append("svg");

            svgGroup = SVGContainer
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    
                    .attr("height", height)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            x = d3.scale.linear().range([0, width]);
        }
    }

    var SetBarDataObject = function (obj) {
        BarDataObject = obj;
		
		svgGroup.selectAll("g").remove();
		SVGContainer.attr("height", 0 + margin.top + margin.bottom);
		
        if (BarDataObject && BarDataObject.hasOwnProperty('PARAM_SETTINGS')){
            var GrouppedData = d3.nest()
                                .key(d => d.full_name.slice(5))
                                .entries(BarDataObject.PARAM_SETTINGS);
            GrouppedData.forEach(function (el) {
                el.values = el.values.filter(d => {return d.par != 0});
            });
            GrouppedData = GrouppedData.filter(d => {return d.values.length})
            
            height = oneRowHeight*GrouppedData.length;
            SVGContainer.attr("height", height  + margin.top + margin.bottom);
            svgGroup.attr("height", height  + margin.top + margin.bottom);
            
            GrouppedData.forEach(function (el,ind) {
                if (el.values) {
                    let tmpdata = el.values;
                   
                    x.domain([0,d3.max(tmpdata, d => d.par)]).range([0, width-margin.right]);
                    var XAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
                   /* var HorizontAxis = svgGroup.append("g")
                                    .attr("class","d3-axis d3-axis-horizontal")
                                    .attr("transform", "translate(0," + oneRowHeight*(ind+1) + ")")
                                    .attr("height",10)
                                   
                                    .call(XAxis);*/
                    var BarsGroup = svgGroup.selectAll(".d3-bar-group")
                                        .data(GrouppedData)
                                        .enter()
                                        .append("g")
                                            .attr("class", "d3-bar-group")
                                            
                                            .attr("height", oneRowHeight)
                                            
                                            ;
                                 
                    BarsGroup.each(function (d,i) {
                        
                        let tfactdata = d.values.filter(d => d.is_plan == 0);
                        let tplandata = d.values.filter(d => d.is_plan == 1);
                               
                        x.domain([0,d3.max(d.values, d => d.par)]).range([0, width-margin.right]);
                        if (tplandata.length>0) {
							d3.select(this)
										.append("rect")
										.attr("class", "bar-chart-filledrect-background")
										.attr("x", 0)
										.attr("y", oneRowHeight*(i+1) - barHeight)
										.attr("height", barHeight-5)
										.attr("rx", 10)
										.attr("ry", 10)
                                        //.attr("fill", "lightgray")
										.attr("width", x(tplandata[0].par)); 
						}
                        if (tfactdata.length>0) {
                            d3.select(this)
                            .append("rect")
                            .attr("class", "bar-chart-filledrect")
                            .attr("x", 0)
                            .attr("y", oneRowHeight*(i+1) - barHeight)
                            .attr("height", barHeight-5)
                            .attr("rx", 10)
                            .attr("ry", 10)
                            .attr("width", x(tfactdata[0].par))
                            .attr("fill", tfactdata[0].color); 
                        }
                        

                        if (tplandata.length>0) {

                            if ((tplandata[0].parpertime > 0) && (tplandata[0].parpertime < tplandata[0].par)) {
                                d3.select(this).append("g")
                                .attr("id","planpertimeid-"+i)
                                
                                .append("text")
                                    .attr("x", x(tplandata[0].parpertime))
                                    .attr("dx", "-.35em")
                                    .attr("y", oneRowHeight*(i))
                                    .attr("dy", "5.6em")
                                    .style("text-anchor","end")
									.attr("class","plan-text")
                                    .text("Ожидаемое: "+tplandata[0].parpertime+" "+tplandata[0].unit);

                                    d3.select(this).append("g")
                                    .attr("id","planpertimelineid-"+i)
                                    .append("line")
                                        .attr("x1", x(tplandata[0].parpertime))
                                        .attr("y1", oneRowHeight*(i+1))
                                        .attr("x2", x(tplandata[0].parpertime))
                                        .attr("y2", oneRowHeight*(i+1) - barHeight - 5)
                                        //.attr("stroke", "black")
                                        .attr("class","plan-line");

                                        d3.select(this).append("g")
                                        .attr("id","planpertimelineidml-"+i)
                                        .append("line")
                                            .attr("x1", x(tplandata[0].parpertime))
                                            .attr("y1", oneRowHeight*(i+1))
                                            .attr("x2", x(tplandata[0].parpertime)-5)
                                            .attr("y2", oneRowHeight*(i+1))
                                            //.attr("stroke", "black")
                                            .attr("class","plan-line");
                            }

                            d3.select(this).append("g")
                                .attr("id","planid-"+i)
                                
                                .append("text")
                                    .attr("x", x(tplandata[0].par))
                                    .attr("dx", "-.35em")
                                    .attr("y", oneRowHeight*(i))
                                    .attr("dy", "1.6em")
                                    .style("text-anchor","end")
									.attr("class","plan-text")
                                    .text("План: "+tplandata[0].par+" "+tplandata[0].unit);
                            d3.select(this).append("g")
                                .attr("id","planlineid-"+i)
                                .append("line")
                                    .attr("x1", x(tplandata[0].par))
                                    .attr("y1", oneRowHeight*(i+1))
                                    .attr("x2", x(tplandata[0].par))
                                    .attr("y2", oneRowHeight*(i+1) - barHeight - 5)
                                    //.attr("stroke", "black")
                                    .attr("class","plan-line");
                                    d3.select(this).append("g")
                                    .attr("id","planlineidml-"+i)
                                    .append("line")
                                        .attr("x1", x(tplandata[0].par))
                                        .attr("y1", oneRowHeight*(i+1) - barHeight - 5)
                                        .attr("x2", x(tplandata[0].par)-5)
                                        .attr("y2", oneRowHeight*(i+1) - barHeight - 5)
                                        //.attr("stroke", "black")
                                        .attr("class","plan-line");
                        }
                        
                        d3.select(this).attr("y", oneRowHeight*(i+1))
                                    .attr("id", "barid-"+i);
                        if (tfactdata.length>0) {
                            d3.select(this)         
                                            .append("foreignObject")
                                            .attr("x", 0)
                                            .attr("y", oneRowHeight*(i+1)-(barHeight))
                                            .attr("dy", ".15em")
                                            .attr("dx", ".35em")
                                            .attr("class","text-in-bar")
                                            .attr({
                                                'width': x(tfactdata[0].par),
                                                'height': barHeight
                                            })
                                            .append("xhtml:div")
                                            .attr("class","text-in-bar-div")
                                            .style({     
                                                "display": "table-cell",
                                                "vertical-align": "middle",
                                                'width': x(tfactdata[0].par) + "px",
                                                'height': "35px",
                                                'text-align':'left'						
                                            })
                                            .append("xhtml:p")
                                            .attr("class","text-in-bar-p")
                                            .style({
                                                "margin-left": "10px"
                                            })
                                            .text(d.key + ": " + tfactdata[0].par + " " + tfactdata[0].unit);
                        } else {
                            d3.select(this)         
                            .append("foreignObject")
                                .attr("x", 0)
                                .attr("y", oneRowHeight*(i+1)-(barHeight))
                                .attr("dy", ".15em")
                                .attr("dx", ".35em")
                                .attr("class","text-in-bar")
                                            .attr({
                                                'width': width-margin.right,
                                                'height': barHeight
                                                
                                            })
                                .append("xhtml:div")
                                .attr("class","text-in-bar-div")
                                .style({     
                                    "display": "table-cell",
                                    "vertical-align": "middle",
                                    'width': width-margin.right + "px",
                                    'height': "35px",
                                    'text-align':'left'						
                                })
                                .append("xhtml:p")
                                .style({
                                    "margin-left": "10px"
                                })
                                .attr("class","text-in-bar-p")
                                .text(d.key);
                        }
                    });

                     
                }
               
            });
            
            }
        
    }

    //window.addEventListener('resize',resize);

    //resize all when resize window
    function resize() {
        
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;
        d3Container.selectAll("svg").attr("width", width + margin.left + margin.right);

        x = d3.scale.linear().range([0, width]);
        SetBarDataObject(BarDataObject);
        
    }

    return {
        init: function () {
            _barLineData();
        },
        SetBarDataObject : function (obj) {
            SetBarDataObject(obj);
        },
        resize: function () {
            resize()
        }
    }
}();

//Start plugIN
document.addEventListener('DOMContentLoaded', function () {
    D3BarLineData.init();
})