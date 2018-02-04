function makeTimer() {
	var endTime = new Date("February 5, 2018 18:00:00 PDT");
	var endTime = (Date.parse(endTime)) / 1000;

	var now = new Date();
	var now = (Date.parse(now) / 1000);

	var timeLeft = endTime - now;

	var days = Math.floor(timeLeft / 86400);
	var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
	var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
	var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

	if (hours < "10") { hours = "0" + hours; }
	if (minutes < "10") { minutes = "0" + minutes; }
	if (seconds < "10") { seconds = "0" + seconds; }

	$("#days").html(days + "<span>Days</span>");
	$("#hours").html(hours + "<span>Hours</span>");
	$("#minutes").html(minutes + "<span>Minutes</span>");
	$("#seconds").html(seconds + "<span>Seconds</span>");
}

//enabling js after page loads
$(document).ready(function() {

	//timer
	setInterval(function() { makeTimer(); }, 1000);

	//initializing counters for scroll operations
	var scrollanim = false;
	var position = $("#panel-content").scrollTop();
	var current_page = $('#panel-content').find('article:visible');
	var frame_height = $("#panel-content").innerHeight();
	var cum_panelheight = 0;
	var current_panel;
	$(current_page).children('div').each(function(index,element){
		cum_panelheight += $(element).outerHeight();
		if(position<cum_panelheight){
			current_panel=$(element);
			//check after making urls //alert('current panel number is: '+$(current_panel).attr('id'));
			return false;
		}
	});
	$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
	//initial positioning
	$('#panel-content').animate({ scrollTop: 10 }, 1000);

	//autofocus on panel
	$('#panel-content').focus();

//loop in chrome!!! what to do???

	//listen for scroll reaching bottom of a panel/page
	$('#panel-content').on('scroll', function() {
		//for downwards scroll
		if(position<$("#panel-content").scrollTop()){
			position = $("#panel-content").scrollTop();
			if(!scrollanim && position>cum_panelheight-frame_height*2/3 && $(current_panel).next().length>0){
				//update counters, change background
				$('.panel-background').find('img:visible').fadeOut(500);
				current_panel = $(current_panel).next();
				$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
				cum_panelheight += $(current_panel).outerHeight();
				//animate scroll to next
				scrollanim = true;
				$('#panel-content').animate({ scrollTop: cum_panelheight - $(current_panel).outerHeight() + 6 }, 1000);
				setTimeout(function(){ scrollanim = false; }, 1100);
				position = $("#panel-content").scrollTop();
			}
		}
		//for upwards scroll
		else if(position>$("#panel-content").scrollTop()){
			position = $("#panel-content").scrollTop();
			if(!scrollanim && position<cum_panelheight-$(current_panel).outerHeight()-frame_height/3 && $(current_panel).prev().length>0){
				//update counters, change background
				$('.panel-background').find('img:visible').fadeOut(500);
				cum_panelheight -= $(current_panel).outerHeight();
				current_panel = $(current_panel).prev();				
				$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
				//animate scroll to previous
				scrollanim = true;
				$('#panel-content').animate({ scrollTop: cum_panelheight - frame_height +6}, 1000);
				setTimeout(function(){ scrollanim = false; }, 1100);
				position = $("#panel-content").scrollTop();
			}
		}
	});

	//listen for side arrow keys
	$('#panel-content').keydown(function(event) {
		if(event.which==37 || event.which==39){//side arrow
			event.preventDefault();
			$('.panel-background').find('img:visible').fadeOut(500);
			$(current_page).fadeOut(500);
			if(event.which==37){//left arrow key
				if($(current_page).prev().length>0){
					current_page = $(current_page).prev();
				}
				else {
					current_page = $("#panel-content").children('article:last');
				}
			}
			else {//right arrow key
				if($(current_page).next().length>0){
					current_page = $(current_page).next();
				}
				else {
					current_page = $("#panel-content").children('article:first');
				}
			}
			//common
			$(current_page).fadeIn(1000);
			$('#panel-content').animate({ scrollTop: 6 }, 1000);
			//get first panel (change to 'same' panel?)
			current_panel = $(current_page).children('div:first');
			$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500)
			cum_panelheight = $(current_panel).outerHeight();
		}
	});

});//end of document-ready code
