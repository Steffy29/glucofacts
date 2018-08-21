let HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
};

let client = new HttpClient();

// Initialize graph variables for all graphes

// Set the dimensions of the canvas / graph
let margin = {top: 50, right: 10, bottom: 100, left: 50};
let width = 1100 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

// set the ranges
let x = d3.scaleTime().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

/* 1st DEMO */
let year1 = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemie/2012', function (response) {
        let data = JSON.parse(response);

        // format the data
        data.forEach(function (d) {
            d.date_glycemie = parseDate(d.date_glycemie);
            d.glycemie = +d.glycemie;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.glycemie;
        })]);

        drawGraph1(data);
    });
};
year1();

/* 1st DEMO bis */
let year1Bis = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemy/2012', function (response) {
        let data = parseData(response);

        // Scale the range of the data
        x.domain(d3.extent(data[0].values, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data[0].values, function (d) {
            return d.glycemie;
        })]);

        graph1Bis(data);
    });
};
year1Bis();

/* 1st DEMO - graph display */
function drawGraph1(data) {
    // define the line
    let valueline = d3.line()
        .x(function (d) {
            return x(d.date_glycemie);
        })
        .y(function (d) {
            return y(d.glycemie);
        });

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select("#graph1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    drawAxis(svg);

    labelGraph(svg, "Relevés Glycémie de l'année 2012", "Date du relevé", "Glycémie (mg/dl)");
}

// Draw simple graph
function drawAxis(svg) {
    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("fill", "#fff")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-75)");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#fff");
}

function labelGraph(svg, title_graph, x_label_axis, y_label_axis) {
    // Add Title for the graph
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .style("fill", "#fff")
        .text(title_graph);

    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#fff")
        .text(x_label_axis);

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#fff")
        .text(y_label_axis);
}

function parseData(results) {
    let res = JSON.parse(results);
    let glycemie = JSON.parse(res[0].query);
    let max = JSON.parse(res[1].max);
    let min = JSON.parse(res[2].min);

    // Parse the date / time
    let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

    // format the data
    glycemie.forEach(function (d) {
        d.date_glycemie = parseDate(d.date_glycemie);
        d.glycemie = +d.glycemie;
    });
    max.forEach(function (d) {
        d.date_glycemie = parseDate(d.date_glycemie);
        d.glycemie = +d.glycemie;
    });
    min.forEach(function (d) {
        d.date_glycemie = parseDate(d.date_glycemie);
        d.glycemie = +d.glycemie;
    });

    let data = [];
    data.push({name: 'glycemie', values: glycemie});
    data.push({name: 'max', values: max});
    data.push({name: 'min', values: min});

    return data;
}

/* 1st DEMO Bis - graph display */
function graph1Bis(data) {
    // define the line
    let line = d3.line()
        .x(d => {
            return x(d.date_glycemie);
        })
        .y(d => {
            return y(d.glycemie);
        });

    let color = ['#fff', '#7f1111', '#7f1111'];

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select("#graph1Bis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let lines = svg.append('g')
        .attr('class', 'lines');

    lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')
        .append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => color[i]);

    drawAxis(svg);

    labelGraph(svg, "Relevés Glycémie de l'année 2012", "Date du relevé", "Glycémie (mg/dl)");
}

/* 2nd DEMO */
// gridlines in x axis function
function make_x_gridlines(x) {
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines(y) {
    return d3.axisLeft(y)
        .ticks(5)
}

let plasmaRef = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemie/meth_ref/plasma', function (response) {
        let data = JSON.parse(response);

        // format the data
        data.forEach(function (d) {
            d.date_glycemie = parseDate(d.date_glycemie);
            d.glycemie = +d.glycemie;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.glycemie;
        })]);

        // define the line
        let valueline = d3.line()
            .x(function (d) {
                return x(d.date_glycemie);
            })
            .y(function (d) {
                return y(d.glycemie);
            });

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("#graph2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines(x)
                .tickSize(-height)
                .tickFormat("")
            );

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines(y)
                .tickSize(-width)
                .tickFormat("")
            );

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        drawAxis(svg);

        labelGraph(svg, "Relevés Glycémie - méthode de référence : plasma", "Date du relevé", "Glycémie (mg/dl)");
    });
};
plasmaRef();

let plasmaRefBis = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemy/meth_ref/plasma', function (response) {
        let data = parseData(response);

        // Scale the range of the data
        x.domain(d3.extent(data[0].values, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data[0].values, function (d) {
            return d.glycemie;
        })]);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("#graph2Bis").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines(x)
                .tickSize(-height)
                .tickFormat("")
            );

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines(y)
                .tickSize(-width)
                .tickFormat("")
            );

        // define the line
        let line = d3.line()
            .x(d => {
                return x(d.date_glycemie);
            })
            .y(d => {
                return y(d.glycemie);
            });

        let color = ['#fff', '#7f1111', '#7f1111'];

        let lines = svg.append('g')
            .attr('class', 'lines');

        lines.selectAll('.line-group')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')
            .append('path')
            .attr('class', 'line')
            .attr('d', d => line(d.values))
            .style('stroke', (d, i) => color[i]);

        drawAxis(svg);

        labelGraph(svg, "Relevés Glycémie - méthode de référence : plasma", "Date du relevé", "Glycémie (mg/dl)");
    });
};
plasmaRefBis();

/* 3rd DEMO */
let plotGlycemie = function () {
    client.get('http://localhost:8282/api/glucofacts/bad_glycemie', function (response) {
        let data = JSON.parse(response);

        // format the data
        data.forEach(function (d) {
            d.date_glycemie = parseDate(d.date_glycemie);
            d.glycemie = +d.glycemie;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.glycemie;
        })]);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("#graph3").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines(x)
                .tickSize(-height)
                .tickFormat("")
            );

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines(y)
                .tickSize(-width)
                .tickFormat("")
            );

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x(d.date_glycemie);
            })
            .attr("cy", function (d) {
                return y(d.glycemie);
            });

        drawAxis(svg);

        labelGraph(svg,"Relevés Glycémie - valeurs basses et hautes (< 70 et > 120 mg/dl)", "Date du relevé", "Glycémie (mg/dl)");
    });
};
plotGlycemie();
