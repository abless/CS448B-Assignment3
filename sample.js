var mortality = [
  {"year":2000,"age":0,"sex":1, "stats": [{"cause": "Heart", "people":12}, {"cause": "Cancer", "people":14}, {"cause": "Other", "people": 10}]},
  {"year":2000,"age":5,"sex":1, "stats": [{"cause": "Heart", "people":155}, {"cause": "Cancer", "people":240}]},
  {"year":2000,"age":0,"sex":2, "stats": [{"cause": "Heart", "people":13}, {"cause": "Cancer", "people":143}, {"cause": "Other", "people": 10}]},
  {"year":2000,"age":5,"sex":2, "stats": [{"cause": "Heart", "people":135}, {"cause": "Cancer", "people":240}]}
];

{"year:" 2000, "age": 0, "sex": 1, "cause": "Heart", "people": 12}

d3.nest()
	.key(function(d) { return d.age})
	.key(function(d) { return d.year})
	.key(function(d) { return d.sex})
	.entries(mortality)
	
[{key: 2000, values: [
		{key: 0, values: [
			{key: 1, values: [
				{"year:" 2000, "age": 0, "sex": 1, "cause": "Heart", "people": 12},
				{"year:" 2000, "age": 0, "sex": 1, "cause": "Cancer", "people": 5}
				]},
			{key: 2, values: [
				{"year:" 2000, "age": 0, "sex": 2, "cause": "Heart", "people": 12},
				]}
			]}
	]}]