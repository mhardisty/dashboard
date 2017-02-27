var active_list = [];

for (i = 0; i < pieChartData.length; i++){
	active_list.push({category:pieChartData[i].category, active:false});
}

// switches the state of a category
function switchActive(category){
	for (i = 0; i < active_list.length; i++){
		if (active_list[i].category === category){
			active_list[i].active = !active_list[i].active;
			return;
		}
	}
}	

// check if a category is active
function isActive(category){
	for (i = 0; i < active_list.length; i++){
		if (active_list[i].category === category){
			return active_list[i].active;
		}
	}
}	

