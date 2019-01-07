(function($) {
let hero = document.getElementById('hero-slides');
let menu = document.getElementById('menu');
let slides = document.getElementById('slides');
let dribbble = document.getElementById('dribbble');
let next = [ 'next', 'next-catch' ].map(n => document.getElementById(n));
let prev = [ 'prev', 'prev-catch' ].map(n => document.getElementById(n));
let slideChildren = slides.children;
let slideCount = slides.children.length;
let currentlyDemoing = false;
let currentPage = 0;
let slidesPerPage = () => window.innerWidth > 1700 ? 4 : window.innerWidth > 1200 ? 3 : 2;
let maxPageCount = () => slideCount / slidesPerPage() -0.25;

function goToPage(pageNumber = 0) {
    let slideCount = slides.children.length -1.85;
    let maxPageCount = () => slideCount / slidesPerPage() -0.45;
	currentPage = Math.min(maxPageCount(), Math.max(0, pageNumber));
	console.log(currentPage);
	hero.style.setProperty('--page', currentPage);
}

function sleep(time) {
	return new Promise(res => setTimeout(res, time));
}

function hoverSlide(index) {
	index in slideChildren &&
		slideChildren[index].classList.add('hover');
}

function unhoverSlide(index) {
	index in slideChildren &&
		slideChildren[index].classList.remove('hover');
}

async function demo() {
	if(currentlyDemoing) {
		return;
	}
	currentlyDemoing = true;
	if(currentPage !== 0) {
		goToPage(0);
		await sleep(200);
	}
	let slides = slidesPerPage();
	let pageSeq_ = { 2: [ 1, 2, 1 ], 3: [ 1, 2, 1 / 3 ], 4: [ 1, 1, 0 ] };
	let pageSeq = pageSeq_[slides] || pageSeq_[4];
	let slideSeq_ = { 2: [ 2, 4, 3 ], 3: [ 3, 6, 2 ], 4: [ 3, 6, 2 ] };
	let slideSeq = slideSeq_[slides] || slideSeq_[2];
	await sleep(300);
	goToPage(pageSeq[0]);
	await sleep(500);
	hoverSlide(slideSeq[0]);
	await sleep(1200);
	goToPage(pageSeq[1]);
	dribbble.classList.add('hover');
	unhoverSlide(slideSeq[0]);
	await sleep(500);
	hoverSlide(slideSeq[1]);
	await sleep(1200);
	goToPage(pageSeq[2]);
	unhoverSlide(slideSeq[1]);
	await sleep(300);
	hoverSlide(slideSeq[2]);
	await sleep(1600);
	goToPage(0);
	unhoverSlide(slideSeq[2]);
	dribbble.classList.remove('hover');
	currentlyDemoing = false;
}

next.forEach(n => n.addEventListener('click', () => !currentlyDemoing && goToPage(currentPage + 1)));
prev.forEach(n => n.addEventListener('click', () => !currentlyDemoing && goToPage(currentPage - 1)));
menu.addEventListener('click', demo);

sleep(100).then(demo);

    $.fn.unsplash = function(options) {
        //Default values
        var defaults = {
            client_id: '',
            limit: '',
            columns: '',
            width: ''
        };
        var settings = $.extend({}, defaults, options);
        
        //Set default parameters
        var page = $(".more").attr("href") ? undefined : 1;
        var filter = $(".dropdown a").attr("href") ? undefined : 'laltest';

        //Initialize Masonry
        var $container = $('#slides');
        $container.imagesLoaded(function() {
            $container.masonry({
                itemSelector: '.item'
            });
        });
        function unsplash(page, filter) {
            $.ajax({
                url: 'https://api.unsplash.com/photos',
                type: 'GET',
                dataType: 'json',
                data: {
                    client_id: settings.client_id,
                    page: page,
                    per_page: settings.limit,
                    order_by: filter
                },
                success: function(data) {
                    $.each(data, function(i, item) {
                        //Set custom width
                        var image_url = item.urls.small.replace("&w=1280", "&w=" + settings.width);

                        var image = $("<img>").attr("src", image_url).hide();
                        image.fadeToggle("slow");
                        var uhref=$("<a>").attr("href", item.links.html).append("View on Unsplash");
                        var link = $("<div class='link'>").append(uhref);
                        var location = $("<div class='location' target='_blank'>").append(item.user.username);
                        var headline = $("<div class='headline' target='_blank'>").append(item.user.name);
                        var name = $("<div class='body'>").append(location,headline,link);
                        var number=$("<div class='number'>").append(item.color);
                        var item = $("<div class='slide'>").append(number,name,image,);
                        var $container = $('#slides');

                        //Append item to Masonry
                        var $item = $(item);
                        $container.append( $item ).masonry().masonry( 'appended', $item );
                        $("#slides").masonry( 'destroy' );
                    });
                    //Set page number value in MORE button
                    var more = $("<a id='getunsplash'>").attr("href", page).html("<span>...</span>");
                    $("#footer").html(more);
                }, 
                error: function(){
                    $("#getunsplash").html("ERROR");
                }
            });
        }

        //Click function to get the more
        $(document).on('click', '#getunsplash', function() {
            page = $("#getunsplash").attr('href');
            page++;
            unsplash(page, filter);
            return false;
        });
        $(document).on('click', '.dropdown a', function(e) {
            e.preventDefault();
            $("#slides").masonry( 'destroy' );
            $("#slides,#footer").empty();
            filter = $(this).attr("href");
            unsplash(1, filter);
        });
        //Initial Load
        unsplash(page, filter);
        
        $( document ).ajaxComplete(function( event, xhr, settings,XMLHttpRequest ) {
            setTimeout(function() {
                if(xhr.status == 200){
                     $("#getunsplash").html("MORE");
                } else {
                    $("#getunsplash").html("ERROR");
                }
            }, 1500);
        });
    };
}(jQuery));