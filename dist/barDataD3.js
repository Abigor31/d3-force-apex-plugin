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
            targetDiv = 'barData',
            barElement = document.getElementById(targetDiv),
            mtop = 20,
            mright = 20,
            mbottom = 20,
            mleft = 20;
        
        height = 50;
        oneRowHeight = 100;
        barHeight = 50;

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
            console.log(svgGroup);
            x = d3.scale.linear().range([0, width]);
        }
    }

    var SetBarDataObject = function (obj) {
        BarDataObject = obj;


        if (BarDataObject){
            var GrouppedData = d3.nest()
                                .key(d => d.full_name.slice(5))
                                .entries(BarDataObject.PARAM_SETTINGS);
            
            height = oneRowHeight*GrouppedData.length;
            SVGContainer.attr("height", height  + margin.top + margin.bottom);
            svgGroup.attr("height", height  + margin.top + margin.bottom);
            svgGroup.selectAll("g").remove();
            GrouppedData.forEach(function (el,ind) {
                if (el.values) {
                    let tmpdata = el.values;
                   
                    x.domain([0,d3.max(tmpdata, d => d.par)]).range([0, width-margin.right]);
                    var XAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
                    var HorizontAxis = svgGroup.append("g")
                                    .attr("class","d3-axis d3-axis-horizontal")
                                    .attr("transform", "translate(0," + oneRowHeight*(ind+1) + ")")
                                    .attr("height",10)
                                   
                                    .call(XAxis);
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
                        console.log(tfactdata);
                        console.log(ind);        
                        x.domain([0,d3.max(d.values, d => d.par)]).range([0, width-margin.right]);
                        d3.select(this)
                                    .append("rect")
                                    .attr("class", "bar-chart-filledrect")
                                    .attr("x", 0)
                                    .attr("y", oneRowHeight*(i+1) - barHeight)
                                    .attr("height", barHeight)
                                    .attr("width", x(tfactdata[0].par))
                                    .attr("fill", tfactdata[0].color); 

                        if (tplandata.length>0) {
                            d3.select(this).append("g")
                                .attr("id","planid-"+i)
                                
                                .append("text")
                                    .attr("x", x(tplandata[0].par))
                                    .attr("dx", "-.35em")
                                    .attr("y", oneRowHeight*(i)+50)
                                    .attr("dy", ".35em")
                                    .style("text-anchor","end")
                                    .text("План: "+tplandata[0].par+" "+tplandata[0].unit);
                            d3.select(this).append("g")
                                .attr("id","planlineid-"+i)
                                .append("line")
                                    .attr("x1", x(tplandata[0].par))
                                    .attr("y1", oneRowHeight*(i)+50)
                                    .attr("x2", x(tplandata[0].par))
                                    .attr("y2", oneRowHeight*(i+1))
                                    .attr("stroke", "black");
                        }
                        
                        d3.select(this).attr("y", oneRowHeight*(i+1))
                                    .attr("id", "barid-"+i)
                                    .append("text")
                                        .attr("x", 0)
                                        .attr("y", oneRowHeight*(i+1))
                                        .attr("dy", "-.35em")
                                        .attr("dx", ".35em")
                                        .text(d.key + " - " + tfactdata[0].par + " " + tfactdata[0].unit);
                    });

                     
                }
               
            });
            
            }
        
    }

    window.addEventListener('resize',resize);

    //resize all when resize window
    function resize() {
        console.log("fired resize");
    }

    return {
        init: function () {
            _barLineData();
        },
        SetBarDataObject : function (obj) {
            SetBarDataObject(obj);
        }
    }
}();

//Start plugIN
document.addEventListener('DOMContentLoaded', function () {
    D3BarLineData.init();
})