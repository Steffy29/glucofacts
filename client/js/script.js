let HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
};

let client = new HttpClient();

function getData(year) {
    client.get('http://localhost:8282/api/glucofacts/glycemie/' + year, function (response) {
        //console.log(response);
        return response;
    });
}

/* 1st DEMO */
let year1 = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemie/2012', function (response) {

        let data = JSON.parse(response);

        // Set the dimensions of the canvas / graph
        let margin = {top: 50, right: 10, bottom: 100, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // Parse the date / time
        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

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
        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


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

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Relevés Glycémie de l'année 2012");

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-75)");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 30) + ")")
            .style("text-anchor", "middle")
            .text("Date du relevé");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Glycémie (mg/dl)");

    });
};
//year1();

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

/* 1st DEMO */
let year1Bis = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemy/2012', function (response) {

        let data = parseData(response);
        console.log("data", data);

        // Set the dimensions of the canvas / graph
        let margin = {top: 50, right: 10, bottom: 100, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data
        x.domain(d3.extent(data[0].values, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data[0].values, function (d) {
            return d.glycemie;
        })]);

        // define the line
        let line = d3.line()
            .x(d => {
                return x(d.date_glycemie);
            })
            .y(d => {
                return y(d.glycemie);
            });

        let color = ['#6f7ee7', '#d12338', '#d12338'];

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

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Relevés Glycémie de l'année 2012");

        // Add the X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-75)");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 30) + ")")
            .style("text-anchor", "middle")
            .text("Date du relevé");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Glycémie (mg/dl)");

    });
};
//year1Bis();

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

        // Set the dimensions of the canvas / graph
        let margin = {top: 50, right: 10, bottom: 100, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // Parse the date / time
        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

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
        let svg = d3.select("body").append("svg")
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

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Relevés Glycémie - méthode de référence : plasma");

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-75)");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 30) + ")")
            .style("text-anchor", "middle")
            .text("Date du relevé");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Glycémie (mg/dl)");

    });
};
//plasmaRef();

let plasmaRefBis = function () {
    client.get('http://localhost:8282/api/glucofacts/glycemy/meth_ref/plasma', function (response) {

        let data = parseData(response);

        // Set the dimensions of the canvas / graph
        let margin = {top: 50, right: 10, bottom: 100, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("body").append("svg")
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

        // Scale the range of the data
        x.domain(d3.extent(data[0].values, function (d) {
            return d.date_glycemie;
        }));
        y.domain([0, d3.max(data[0].values, function (d) {
            return d.glycemie;
        })]);

        // define the line
        let line = d3.line()
            .x(d => {
                return x(d.date_glycemie);
            })
            .y(d => {
                return y(d.glycemie);
            });

        let color = ['#6f7ee7', '#d12338', '#d12338'];

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

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Relevés Glycémie - méthode de référence : plasma");

        // Add the X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-75)");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 30) + ")")
            .style("text-anchor", "middle")
            .text("Date du relevé");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Glycémie (mg/dl)");

    });
};
//plasmaRefBis();

/* 3rd DEMO */
let plotGlycemie = function () {
    client.get('http://localhost:8282/api/glucofacts/bad_glycemie', function (response) {

        let data = JSON.parse(response);

        // Set the dimensions of the canvas / graph
        let margin = {top: 50, right: 10, bottom: 100, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // Parse the date / time
        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

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
        let svg = d3.select("body").append("svg")
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

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Relevés Glycémie - valeurs basses et hautes (< 70 et > 120 mg/dl)");

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function(d) { return x(d.date_glycemie); })
            .attr("cy", function(d) { return y(d.glycemie); });

        // Add the X Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-75)");

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 30) + ")")
            .style("text-anchor", "middle")
            .text("Date du relevé");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Glycémie (mg/dl)");

    });
};
plotGlycemie();
