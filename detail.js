function detail(state, name) {
    d3.select('#detail_chart').selectAll("*").remove();
    let svg = d3.select("#detail_chart")
	.append("svg")
	.append("g");

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

let width = 500,
    height = 500,
	radius = Math.min(width, height) / 2;

radius = radius -120;
let pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

let arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

let outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    svg.append("text")
        .attr("x", (width-480) / 2)
        .attr("y", -200)
        .attr('font-weight', 'bold')
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .text("Distribution of education level in " + name);

let key = function(d){ return d.data.label; };

let color = d3.scale.ordinal()
	.domain(["Middle", "High", "College","Bachelor", "Primary"])
	.range(["#98abc5", "#8a89a6", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

function randomData (){
	let labels = color.domain();
	let values = mapdata[state].detail;
	return labels.map(function(label, i){
		return { label: label, value: values[i]}
	});
}

change(randomData());

function change(data) {
	let slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			let interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		});

	slice.exit()
		.remove();

	let text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label + ':' + d.data.value + '%';
		});

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			let interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				let d2 = interpolate(t);
				let pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			let interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				let d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	let polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			let interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				let d2 = interpolate(t);
				let pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
}
}
detail('AZ', 'Arizona');