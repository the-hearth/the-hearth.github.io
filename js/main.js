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
	var position = $("#panel-content").scrollTop();
	var current_page = $('#panel-content').find('article:visible');
	var cum_panelheight = 0;
	var frame_height = $("#panel-content").innerHeight();
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

	//manual!!!!change soon!!!! scroll for down/up arrow keys
  $(document).keydown(function(event) {
		event.preventDefault();
		position = $("#panel-content").scrollTop();
		if(event.which==40){//down arrow
			$("#panel-content").scrollTop(position+5);
			//$('#panel-content').animate({ scrollTop: position+5 }, 10);
		}
		else if(event.which==34){//pgdn
			$('#panel-content').scrollTop(position+50);
		}
		else if(event.which==38){//up arrow
			$("#panel-content").scrollTop(position-5);
		}
		else if(event.which==33){//pgup
			$('#panel-content').scrollTop(position-50);
		}
	});

	//listen for scroll reaching bottom of a panel/page
	$('#panel-content').on('scroll', function() {
		//for scrolling downwards
		if(position<$("#panel-content").scrollTop()){
			position = $("#panel-content").scrollTop();
			if(position >= cum_panelheight - frame_height -2){
				//alert('this panel is over: '+ $(current_panel).attr('id'));
				$('.panel-background').find('img:visible').fadeOut(500);
				//scroll to next, update counters, change background
				if($(current_panel).next().length>0){
					$('#panel-content').animate({ scrollTop: cum_panelheight +6 }, 1000);
					current_panel = $(current_panel).next();
					//alert('current panel is now: '+ $(current_panel).attr('id'));
					$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
					cum_panelheight += $(current_panel).outerHeight();
				}
				else {//load next page, change background
					$(current_page).fadeOut(500);
					if($(current_page).next().length>0){
						current_page = $(current_page).next();
					}
					else {
						current_page = $("#panel-content").children('article:first');
					}
					$(current_page).fadeIn(1000);
					//get first panel
					current_panel = $(current_page).children('div:first');
					//alert('current panel is now: '+ $(current_panel).attr('id'));
					cum_panelheight = $(current_panel).outerHeight();
					$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
					//try not to trigger going back again!
					$('#panel-content').animate({ scrollTop: 6 }, 1000);
				}
				//update position
				position = $("#panel-content").scrollTop();
			}
		}
		//for upwards scroll
		else {
			position = $("#panel-content").scrollTop();
			if(position < cum_panelheight - $(current_panel).innerHeight() +5){
				//alert('this panel is scrolled up: '+ $(current_panel).attr('id'));
				$('.panel-background').find('img:visible').fadeOut(500);
				//scroll to previous, update counters, change background
				if($(current_panel).prev().length>0){
					cum_panelheight -= $(current_panel).outerHeight();
					current_panel = $(current_panel).prev();
					$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
					$('#panel-content').animate({ scrollTop: cum_panelheight - frame_height }, 1000);
					//alert('current panel is now: '+ $(current_panel).attr('id'));
				}
				//load previous page, change background, do nothing if it's the top of the first page
				else {
					$(current_page).fadeOut(500);
					if($(current_page).prev().length>0){
						current_page = $(current_page).prev();
					}
					else {
						current_page = $("#panel-content").children('article:last');
					}
					$(current_page).fadeIn(1000);
					//get first panel
					current_panel = $(current_page).children('div:last');
					$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
					//alert('current panel is now: '+ $(current_panel).attr('id'));
					cum_panelheight=0;
					$(current_page).children('div').each(function(index,element){
						cum_panelheight += $(element).outerHeight();
					});
					//try not to trigger skipping front again!
					$('#panel-content').animate({ scrollTop: cum_panelheight - frame_height -6 }, 1000);
				}
				//update position
				position = $("#panel-content").scrollTop();
			}
		}
	});

});//end of document-ready code
