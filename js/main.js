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

//decide content of home-page based on url
var dynamic_content = getParameterByName('dc');

//load content after images have loaded
window.onload = function() {
  $("#panel-content").css('visibility','visible');
};

//enabling js after page loads
$(document).ready(function() {

	//timer
	setInterval(function() { makeTimer(); }, 1000);

	//initializing counters for scroll operations
	var scrollanim = false;
	var position = $("#panel-content").scrollTop();
	var current_page = $('#panel-content').find('article:first');
	var current_panel = $(current_page).find('div:first');
	if(dynamic_content != null) {
		current_panel = $('#panel-content').find('#'+dynamic_content);
		current_page = $(current_panel).parent();
	}
	//load page
	$(current_page).css('display','block');
	var frame_height = $("#panel-content").innerHeight();
	//get total height
	var cum_panelheight = 0;
	$(current_page).children('div').each(function(index,element){
		cum_panelheight += $(element).outerHeight();
		if($(element).attr('id')==$(current_panel).attr('id')){
			return false;
		}
	});//alert($(current_page).attr('class')+', '+$(current_panel).attr('id')+', '+cum_panelheight);
	//scroll to place
	scrollanim = true;
	$('#panel-content').animate({ scrollTop: cum_panelheight - $(current_panel).outerHeight() + 6 }, 1000);
	setTimeout(function(){ scrollanim = false; }, 1100);
	position = $("#panel-content").scrollTop();
	//load background
	$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
	//autofocus on panel
	$('#panel-content').focus();

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
				window.history.pushState('','','?dc='+$(current_panel).attr('id'));//update url
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
		}
	});

});//end of document-ready code
