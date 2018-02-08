//function for resetting activity of tob-bottom tabs based on an index
function switchtabs(ind) {
	$('.top-bottom-tabs').find('li').css('cursor','pointer');
	$('.top-tabs').find('li').each(function(index,element){
		if(index>ind){$(element).css('cursor','default');}
	});
	$('.bottom-tabs').find('li').each(function(index,element){
		if(index<ind){$(element).css('cursor','default');}
	});
}

//function for resetting activity of side tabs based on an index
function switchsidetabs(indx) {
	$('.side-tabs').find('li').css('cursor','pointer');
	$('.left-tabs').find('li').each(function(index,element){
		if(index>=indx){$(element).css('cursor','default');}
	});
	$('.right-tabs').find('li').each(function(index,element){
		if(index+1<indx){$(element).css('cursor','default');}
	});
}

//function for parsing url for parameters (taken from http://jennamolby.com/how-to-display-dynamic-content-on-a-page-using-url-parameters/)
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//function for temp countdown
function makeTimer() {
	var endTime = new Date("February 8, 2018 18:00:00 PDT");
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

//global variables
var dynamic_content = getParameterByName('dc');//decide content of home-page based on url
var scrollanim = false;
var position;
var current_page;
var current_panel;
var frame_height;
var cum_panelheight = 0;
var ind;//for top and bottom tabs
var indx;//for side tabs

//load content & make calculations after content loads
window.onload = function() {

};

//enabling js after page dom loads
$(document).ready(function() {

//general fade in for all pages
	$('body').fadeIn(1000);

//timer
	setInterval(function() { makeTimer(); }, 1000);

//initializing counters for scroll operations
	position = $("#panel-content").scrollTop();
	current_page = $('#panel-content').find('article:first');
	current_panel = $(current_page).find('div:first');
	if(dynamic_content != null) {
		current_panel = $('#panel-content').find('#'+dynamic_content);
		current_page = $(current_panel).parent();
	}
	//load content & background
	$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
	$(current_page).fadeIn(1000);
	//give some time for content to load
	setTimeout(function() {
		//calculate heights
		frame_height = $("#panel-content").innerHeight();
		$(current_page).children('div').each(function(index,element){
			cum_panelheight += $(element).outerHeight();
			if($(element).attr('id')==$(current_panel).attr('id')){
				return false;
			}
		});
		//scroll to place
		scrollanim = true;
		$('#panel-content').animate({ scrollTop: cum_panelheight - $(current_panel).outerHeight() + 6 }, 1000);
		setTimeout(function(){ scrollanim = false; }, 1100);
		position = $("#panel-content").scrollTop();
		//autofocus on panel
		$('#panel-content').focus();
		//activate relevant top-bottom-tabs
		ind = $(current_page).children('div').index(current_panel);
		switchtabs(ind);
		//reset relevant side tabs
		indx = $('#panel-content').children('article').index(current_page);
		switchsidetabs(indx);
	}, 1000);

//refresh frame height on resize
	$( window ).resize(function() {
		frame_height = $("#panel-content").innerHeight();
	});

//listen for scroll reaching between panels
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
				//update url
				window.history.pushState('','','?dc='+$(current_panel).attr('id'));
				//activate relevant top-bottom-tabs
				ind = $(current_page).children('div').index(current_panel);
				switchtabs(ind);
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
				//update url
				window.history.pushState('','','?dc='+$(current_panel).attr('id'));//update url
				//activate relevant top-bottom-tabs
				ind = $(current_page).children('div').index(current_panel);
				switchtabs(ind);
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
			//load page and scroll
			$(current_page).fadeIn(1000);
			scrollanim = true;
			$('#panel-content').animate({ scrollTop: 6 }, 1000);
			setTimeout(function(){ scrollanim = false; }, 1100);
			position = $("#panel-content").scrollTop();
			//get first panel for now (change to 'same' panel???)
			current_panel = $(current_page).children('div:first');
			//update url and load background
			window.history.pushState('','','?dc='+$(current_panel).attr('id'));//update url
			$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500)
			//reset height
			cum_panelheight = $(current_panel).outerHeight();
			//activate relevant top-bottom-tabs
			ind = $(current_page).children('div').index(current_panel);
			switchtabs(ind);
		}
	});

	//listen for click on top-bottom tabs
	$('.top-bottom-tabs').on('mousedown', 'li', function(event) {
		event.preventDefault();
		//update current panel
		if($(current_page).attr('class')=='travels')
		{current_panel = $('#panel-content').find('#'+$(current_page).attr('class')+'_'+$(this).attr('class').split(" ")[1]);}
		else
		{current_panel = $('#panel-content').find('#'+$(current_page).attr('class')+'_'+$(this).attr('class').split(" ")[0]);}
		//calculate cum panel height
		cum_panelheight = 0;
		$(current_page).children('div').each(function(index,element){
			cum_panelheight += $(element).outerHeight();
			if($(element).attr('id')==$(current_panel).attr('id')){
				return false;
			}
		});
		//animate scroll to new panel
		scrollanim = true;
		$('#panel-content').animate({ scrollTop: cum_panelheight - $(current_panel).outerHeight() +6}, 1000);
		setTimeout(function(){ scrollanim = false; }, 1100);
		position = $("#panel-content").scrollTop();
		//update url and reload background
		window.history.pushState('','','?dc='+$(current_panel).attr('id'));
		$('.panel-background').find('img:visible').fadeOut(500);
		$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500)
		//activate relevant top-bottom-tabs
		ind = $(current_page).children('div').index(current_panel);
		switchtabs(ind);
	});

	//listen for click on side tabs
	$('.side-tabs').on('mousedown', 'li', function(event) {
		event.preventDefault();
		$('.panel-background').find('img:visible').fadeOut(500);
		$(current_page).fadeOut(500);
		current_page = $('#panel-content').find('.'+$(this).attr('class'));
		//load page and scroll
		$(current_page).fadeIn(1000);
		scrollanim = true;
		$('#panel-content').animate({ scrollTop: 6 }, 1000);
		setTimeout(function(){ scrollanim = false; }, 1100);
		position = $("#panel-content").scrollTop();
		//get first panel for now (change to 'same' panel???)
		current_panel = $(current_page).children('div:first');
		//update url and load background
		window.history.pushState('','','?dc='+$(current_panel).attr('id'));//update url
		$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500)
		//reset height
		cum_panelheight = $(current_panel).outerHeight();
		//activate relevant top-bottom-tabs
		ind = $(current_page).children('div').index(current_panel);
		switchtabs(ind);
		//reset relevant side tabs
		indx = $('#panel-content').children('article').index(current_page);
		switchsidetabs(indx);
	});

	//listen for form select
	$(".service").change(function() {
  	//alert($(this).val()+" option selected");
		if($(this).val()=='homestay'){
			var newOptions = {"Select Room": "Room Type", "Double Bed": "Double Bed", "Single Bed": "Single Bed", "Twin Bed": "Twin Bed"};
			$(".room").empty();
			$.each(newOptions, function(key,value) {
  			$(".room").append($("<option></option>")
     		.attr("value", value).text(key));
	 		});
		}
		else if($(this).val()=='hostel'){
			var newOptions = {"Select Room": "Room Type", "Men's Dorm": "Men's Dorm", "Women's Dorm": "Women's Dorm", "Coed Dorm": "Coed Dorm"};
			$(".room").empty();
			$.each(newOptions, function(key,value) {
  			$(".room").append($("<option></option>")
     		.attr("value", value).text(key));
	 		});
		}
		if($(this).val()=='travel'){
			var newOptions = {"Itineraries": "Itinerary Type", "Itinerary 1": "Itinerary 1", "Itinerary 2": "Itinerary 2", "Itinerary 3": "Itinerary 3"};
			$(".room").empty();
			$.each(newOptions, function(key,value) {
  			$(".room").append($("<option></option>")
     		.attr("value", value).text(key));
	 		});
		}
	});

	//listen for click inside deals panel
	$('.dealtxt').on('mousedown', function(event) {
		event.preventDefault();
		$('.deal-container').focus();
	});

	//listen for click on labels in deals panel
	$('.link').on('mousedown', function(event) {
		event.preventDefault();
		$('.label').fadeOut(1000);
		$('.dealtxt').fadeOut(1000);
		$('.dealimg').fadeOut(1000);
		var active_index = $(this).attr('class').split(" ")[4].split("-")[1];
		$('.deal'+active_index).fadeIn(1000);
		if(active_index==2){
			$('.deal-container').css('top','6vw');
		}
		else if(active_index==3){
			$('.deal-container').css('top','8.5vw');
		}
		else {
			$('.deal-container').css('top','3.5vw');
		}

	});

});//end of document-ready code
