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

//global variables
var dynamic_content = getParameterByName('dc');//decide content of home-page based on url
var blog_content = getParameterByName('bc');//decide content of blog-page based on url
var scrollanim = false;
var writeon = false;
var position;
var current_page;
var current_panel;
var frame_height;
var cum_panelheight = 0;
var ind;//for top and bottom tabs
var indx;//for side tabs

//load content & make calculations after content loads
window.onload = function() {
	//general fade in for header and sections of all pages
		$("header").fadeTo(1500, 1.0);
		$("section").fadeTo(3000, 1.0);
};

//enabling js after page dom loads
$(document).ready(function() {

//In case window.onload doesn't fire
	setTimeout(function() {
		$("header").fadeTo(1500, 1.0);
		$("section").fadeTo(3000, 1.0);
	}, 8000);

//check for dynamic blog content and load it
	if(blog_content != null) {
		//remove all blogs and indices
		$('#panel-content-nothome').find('.blog').fadeOut(500);
		$('#panel-content-nothome').find('.blogindex').find('li').fadeOut(500);
		//load relevant blogs and indices
		$('#panel-content-nothome').find('.posttag').each(function(index,element){
			if($.trim($(element).text())==blog_content){
				$(element).parents('.blog').fadeIn(500);
				var indxx = $('#panel-content-nothome').find('article').index($(element).parents('.blog'))+1;
				$('#panel-content-nothome').find('.blogindex').find('li:nth-of-type('+indxx+')').fadeIn(500);
			}
		});
		//insert tag in index title
		$('#panel-content-nothome').find('.blogindex').find('h2').text(blog_content);
	}
//also... remove faq from blog page
	if ($('#panel-content-nothome').find('article:first').attr('class')=='blog'){
		$('#panel-content-nothome').find('.blog:last').css('display','none');
		$('#panel-content-nothome').find('.blogindex').find('li:last').css('display','none');
	}

//home page: initializing counters for scroll operations
	current_page = $('#panel-content').find('article:first');
	current_panel = $(current_page).find('div:first');
	if(dynamic_content != null) {
		current_panel = $('#panel-content').find('#'+dynamic_content);
		current_page = $(current_panel).parent();
	}
	//load content & background
	$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
	$(current_page).fadeIn(500);
	//give 2 seconds for content to load fully
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
		$('#panel-content').animate(
			{ scrollTop: cum_panelheight - $(current_panel).outerHeight() + 6 },
			2000, function(){ scrollanim = false; }
		);
		position = $("#panel-content").scrollTop();
		//autofocus on panel
		$('#panel-content').focus();
		//activate relevant top-bottom-tabs
		ind = $(current_page).children('div').index(current_panel);
		switchtabs(ind);
		//reset relevant side tabs
		indx = $('#panel-content').children('article').index(current_page);
		switchsidetabs(indx);
	}, 2000);

//refresh frame height on resize
	$( window ).resize(function() {
		frame_height = $("#panel-content").innerHeight();
	});

//listen for scroll reaching between panels
	$('#panel-content').on('scroll', function() {
		//for downwards scroll
		if(position<$("#panel-content").scrollTop()){
			position = $("#panel-content").scrollTop();
			if(!scrollanim && position>cum_panelheight-frame_height*2/3 && $(current_panel).next('div').length>0){
				//update counters, change background
				$('.panel-background').find('img:visible').fadeOut(500);
				current_panel = $(current_panel).next('div');
				$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
				cum_panelheight += $(current_panel).outerHeight();
				//animate scroll to next
				scrollanim = true;
				$('#panel-content').animate({ scrollTop: cum_panelheight - $(current_panel).outerHeight() + 6 },
					1000, function(){ scrollanim = false; }
				);
				//setTimeout(function(){ scrollanim = false; }, 1100);
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
			if(!scrollanim && position<cum_panelheight-$(current_panel).outerHeight()-frame_height/3 && $(current_panel).prev('div').length>0){
				//update counters, change background
				$('.panel-background').find('img:visible').fadeOut(500);
				cum_panelheight -= $(current_panel).outerHeight();
				current_panel = $(current_panel).prev('div');
				$('.panel-background').find('#'+$(current_panel).attr('id')).fadeIn(500);
				//animate scroll to previous
				scrollanim = true;
				$('#panel-content').animate(
					{ scrollTop: cum_panelheight - $(current_panel).outerHeight() +6},
					1000, function(){ scrollanim = false; }
				);
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
		if( (event.which==37 || event.which==39) && !$('.lightbox').width() ){//side arrows
			event.preventDefault();
			$('.panel-background').find('img:visible').fadeOut(500);
			$(current_page).fadeOut(500);
			if(event.which==37){//left arrow key
				if($(current_page).prev('article').length>0){
					current_page = $(current_page).prev('article');
				}
				else {
					current_page = $("#panel-content").children('article:last');
				}
			}
			else {//right arrow key
				if($(current_page).next('article').length>0){
					current_page = $(current_page).next('article');
				}
				else {
					current_page = $("#panel-content").children('article:first');
				}
			}
			//load page and scroll
			$(current_page).fadeIn(1000);
			scrollanim = true;
			$('#panel-content').animate({ scrollTop: 6 },
				1000, function(){ scrollanim = false; }
			);
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
		$('#panel-content').animate({ scrollTop: cum_panelheight - $(current_panel).outerHeight() +6},
			2000, function(){ scrollanim = false; }
		);
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
		if($(this).attr('class')=='none'){
			//do nothing
			return;
		}
		else if($(this).attr('class')=='write'){
			if(writeon){
				$('.write-form').fadeOut(500);
				writeon = false;
			}
			else {//pop up form
				writeon = true;
				$('.write-form').fadeIn(1000);
			}
			return;
		}
		$('.panel-background').find('img:visible').fadeOut(500);
		$(current_page).fadeOut(500);
		current_page = $('#panel-content').find('.'+$(this).attr('class'));
		//load page and scroll
		$(current_page).fadeIn(1000);
		scrollanim = true;
		$('#panel-content').animate({ scrollTop: 6 },
			2000, function(){ scrollanim = false; }
		);
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

	//listen for pay amount select
	$(".pay").change(function() {
		if($(this).val()=='1000'){
			$(".book_now").find('a').attr("href", "https://www.instamojo.com/@thehearth/l5f396a32dee149758ae06f415051a9de/");
		}
		else if($(this).val()=='2000'){
			$(".book_now").find('a').attr("href", "https://www.instamojo.com/@thehearth/ld3ec8bc9d60447c3af2479c8f71ce8f8/");
		}
		else if($(this).val()=='5000'){
			$(".book_now").find('a').attr("href", "https://www.instamojo.com/@thehearth/lba55c1fd07cb43aab0f400b403991da0/");
		}
		else if($(this).val()=='10000'){
			$(".book_now").find('a').attr("href", "https://www.instamojo.com/@thehearth/l2a7dd43d666b4aa78601b06f1cde449a/");
		}
		else {
			$(".book_now").find('a').attr("href", "");
		}
	});

	//listen for service type select
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

	//listen for click on labels in deals panel
	$('.link').on('mousedown', function(event) {
		event.preventDefault();
		//'$(this).parent().children' targets only the current page
		$(this).parent().find('.label').fadeOut(500);
		$(this).parent().find('.dealtxt').css('display','none');
		$(this).parent().find('.dealimg').fadeOut(1000);
		var active_index = $(this).attr('class').split(" ")[4].split("-")[1];
		$(this).parent().children('.deal'+active_index).fadeIn(1000);
		$(this).parent().find('.deal'+active_index).fadeIn(2000);
		//scroll to top
		$(this).parent().children('.deal-container').animate({ scrollTop: 0 }, 1000);
		//adjust the panel container position
		if(active_index==2){ $(this).parent().children('.deal-container').css('top','6vw');	}
		else if(active_index==3){ $(this).parent().children('.deal-container').css('top','8.5vw'); }
		else if(active_index==4){ $(this).parent().children('.deal-container').css('top','11vw'); }
		else { $(this).parent().children('.deal-container').css('top','3.5vw');	}
	});

	//listen for click on tags of posts
	$('.posttag').on('mousedown', function(event) {
		event.preventDefault();
		//update url
		var tag = $(this).text();
		tag = $.trim(tag);
		var add = "/blog.html?bc="+tag;
		window.history.pushState('','',add);
		//direct to url
		$(this).attr("href", add);		
	});

});//end of document-ready code
