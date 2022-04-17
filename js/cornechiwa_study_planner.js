$(document).ready(function() {
	// 1、 1、 2、 3、 5、 8、 13、 21、 34、 55、 89、 144、 233、 377、 610、 987
	const fibonacci_list = [
	{"sessionText": "Session #1 - Day 1", "interval": 0, "daysLater": 0, "daysLaterText":"Today", "taskName": "S1"},
	{"sessionText": "Session #2 - Day 2", "interval": 1, "daysLater": 1, "daysLaterText":"1 day later", "taskName": "S2"},
	{"sessionText": "Session #3 - Day 4", "interval": 2, "daysLater": 3, "daysLaterText":"2 days later", "taskName": "S3"},
	{"sessionText": "Session #4 - Day 7", "interval": 3, "daysLater": 6, "daysLaterText":"3 days later", "taskName": "S4"},
	{"sessionText": "Session #5 - Day 12", "interval": 5, "daysLater": 11, "daysLaterText":"5 days later", "taskName": "S5"},
	{"sessionText": "Session #6 - Day 20", "interval": 8, "daysLater": 19, "daysLaterText":"8 days later", "taskName": "S6"},
	{"sessionText": "Session #7 - Day 33", "interval": 13, "daysLater": 32, "daysLaterText":"13 days later", "taskName": "S7"},
	{"sessionText": "Session #8 - Day 54", "interval": 21, "daysLater": 53, "daysLaterText":"21 days later", "taskName": "S8"},
	{"sessionText": "Session #9 - Day 88", "interval": 34, "daysLater": 87, "daysLaterText":"34 days later", "taskName": "S9"},
	{"sessionText": "Session #10 - Day 143", "interval": 55, "daysLater": 142, "daysLaterText":"55 days later", "taskName": "S10"},
	]
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var start_date = new Date();
	var start_session = 0;
	
	$('#current_session_num').change(function(){
		start_session = $(this).children(':selected').val() - 1;
		updatePlanner();
	});

	$('#current_session_date').datepicker({
		showOn: 'button',
		buttonImageOnly: true,
		buttonImage: 'images/calendar.gif',
		defaultDate: new Date(),
		format: "M d, yyyy",
		defaultDate: 0,
		autoclose: true,
		todayHighlight: true,
		todayBtn: "linked",
		onSelect: function () {
			selectedDate = $.datepicker.formatDate("M d, yyyy", $(this).datepicker('getDate'));
		}
	}).on('changeDate', function(){
		start_date = $(this).datepicker('getDate');
		updatePlanner();
	});

	$('#datetimepicker1').datepicker();

	$('.date-withicon').datepicker({
		format: 'mm-dd-yyyy'
	});

	$("#reset").click(resetCurrentSession);
	$("#download").click(downloadCsv);

	resetCurrentSession();

	function resetCurrentSession() {
		$('#current_session_num').val(1);
		$('#current_session_num').selectpicker('refresh')
		$('#current_session_date').datepicker("setDate", new Date);
		start_date = new Date();
		start_session = 0;
		updatePlanner();
	}

	function updatePlanner() {
		$("#planner-list").empty()
		for (let i = start_session; i < fibonacci_list.length; i++) {
			var $new_session = $('<div class="list-group-item list-group-item-action"></div>');
			var $new_details = $('<div class="d-flex w-100 justify-content-between"></div>');
			var $new_date = $('<h5 class="mb-1"></h5>');
			var $new_daysLaterText = $('<small></small>');
			var $new_sessionText = $('<small class="text-muted"></small>');

			var session_date = new Date(start_date.getTime());;
			session_date.setDate(start_date.getDate() + fibonacci_list[i]["daysLater"] - fibonacci_list[start_session]["daysLater"]);
			$new_date.append(months[session_date.getMonth()] + ' ' + session_date.getDate());
			$new_daysLaterText.append(fibonacci_list[i]["sessionText"]);
			$new_sessionText.append(fibonacci_list[i]["daysLaterText"]);

			$new_details.append($new_date);
			$new_details.append($new_daysLaterText);
			$new_session.append($new_details);
			$new_session.append($new_sessionText);
			$("#planner-list").append($new_session);
			$("#planner-list").append($new_session);
			$("#planner-list").append($new_session);
		}
	}

	function downloadCsv() {
		var vocabs = $('#vocab').val().trim().split(/,+/);

	    // filename for CSV
	    var filename = "schedule_" 
	    + start_date.getFullYear() 
	    + ("0" + (start_date.getMonth()+1)).slice(-2)
	    + ("0" + start_date.getDate()).slice(-2)
	    + "_S" + String(start_session+1);
	    
	    // content for CSV
	    var csvRows = [];
	    csvRows.push(['TYPE', 'CONTENT', 'PRIORITY', 'INDENT', 'DATE', 'DATE_LANG']);
	    for (const vocab of vocabs) {
			// header
			var vocabOutput = vocab.charAt(0).toUpperCase() + vocab.slice(1).toLowerCase();
			csvRows.push(['task', vocabOutput, '4', '1', '', 'en']);

		  	// schedule
		  	for (let i = start_session; i < fibonacci_list.length; i++) {
		  		var session_date = new Date(start_date.getTime());;
		  		session_date.setDate(start_date.getDate() + fibonacci_list[i]["daysLater"] - fibonacci_list[start_session]["daysLater"]);
		  		var content = vocabOutput + " " + fibonacci_list[i]["taskName"];
		  		var date = months[session_date.getMonth()] + ' ' + session_date.getDate();
		  		csvRows.push(['task', content, '4', '2', date, 'en']);
		  	}

			// filename
			filename = filename + "_";
			var topics = vocab.split(/\s+/);
			for (const topic of topics) {
				filename = filename + topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
			}
			
		}

		// generate CSV
		let csvContent = "data:text/csv;charset=utf-8,";
		for (const csvRow of csvRows) {
			csvContent += csvRow.join(",") + "\r\n";
		}
		var encodedUri = encodeURI(csvContent);

		// download CSV
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", filename + ".csv");
		document.body.appendChild(link);
		link.click();
	}
});