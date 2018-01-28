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

	var pos = $("#panel-content").scrollTop();
	//scroll on down arrow key press
  $(document).keydown(function(event) {
		pos = $("#panel-content").scrollTop();
		event.preventDefault();
		if(event.which==40){//or 34?
			$("#panel-content").scrollTop(pos+5);
		}
		else if(event.which==38){//or 33?
			$("#panel-content").scrollTop(pos-5);
		}
	});

	//listen for scroll reaching bottom of section
	$('#panel-content').on('scroll', function() {
		if(pos<$("#panel-content").scrollTop()){//only on scroll down
			var panelht = $("#panel-content").innerHeight();
			var scrollht = document.getElementById("panel-content").scrollHeight;
			pos = $("#panel-content").scrollTop();
			if(pos+panelht >= scrollht-5){
				//fadeout current section and scroll to top
				var back_elem = $('.panel-background').find('img:visible');
				$(back_elem).fadeOut(500);
				$("#panel-content").find('#'+back_elem.attr('id')).fadeOut(500);
				$("#panel-content").animate({scrollTop:0}, '500');
				pos=scrollht;
				//fadein next
				if($(back_elem).next().length>0){
					$(back_elem).next().fadeIn(1000);
					$("#panel-content").find('#'+back_elem.attr('id')).next().fadeIn(1000);
				}
				else if($(back_elem).parent().next().length>0){
					//new topic
					back_elem = $(back_elem).parent().next().find('img:first-child');
					$(back_elem).fadeIn(1000);
					$("#panel-content").find('#'+back_elem.attr('id')).fadeIn(1000);
				}
				else{//back to the beginning
					$('.panel-background').find('img:first').fadeIn(1000);
					$('#panel-content').find('div:first').fadeIn(1000);
				}
			}
		}
	});

});//end of document-ready code
