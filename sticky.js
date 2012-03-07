// Sticky v1.0.1 by Daniel Raftery
// http://thrivingkings.com/sticky
//
// http://twitter.com/ThrivingKings

(function($) {
	
	// Using it without an object
	$.sticky = function( note, options, callback ) {
		return $.fn.sticky( note, options, callback );
	};
	
	$.fn.sticky = function( note, options, callback ) {
		
		var settings = {
			'speed'      : 'fast', // animations: fast, slow, or integer
			'duplicates' : true,   // true or false
			'autoclose'  : 5000,   // integer or false
			'position'   : 'top-right' // top-left, top-right, bottom-left, or bottom-right
		};
		
		// Passing in the object instead of specifying a note
		if( !note ) {
			note = this.html();
		}
		
		if( !!options ) {
			$.extend( settings, options );
		}
		
		// Variables
		var display = true,
			duplicate = false,
			getUniqID = function(){return Math.floor(Math.random()*9999999);},
			uniqID = getUniqID(); // Somewhat of a unique ID
		
		// Handling duplicate notes and IDs
		$('.sticky-note').each(function() {
			if( $(this).html() === note && $(this).is(':visible') ) {
				duplicate = true;
				if( !settings['duplicates'] ) {
					display = false;
				}
			}
			if( $(this).attr('id') === uniqID ) {
				uniqID = getUniqID();
			}
		});
		
		// Make sure the sticky queue exists
		if( !$('body').find('.sticky-queue').html() ) {
			$('body').append( '<div class="sticky-queue ' + settings['position'] + '"></div>' );
			// IE6 fix
			try {
				if( !window.XMLHttpRequest ) {
					var element = $('.sticky-queue.' + settings['position'] );
					element.css( 'position', 'absolute' );
					$(window).scroll( function() {
						var scrolltop = $(this).scrollTop();
						if( settings['position'] === 'top-right' || settings['position'] === 'top-left') {
							element.css( 'top', parseInt( scrolltop - 2, 10 ) );
						}
					});
				}
			} catch(e) {}
		}
		// Can it be displayed?
		if( !!display ) {
			// Building and inserting sticky note
			$('.sticky-queue').prepend( '<div class="sticky border-' + settings['position'] + '" id="' + uniqID + '"></div>' );
			$('#' + uniqID).append( '<img src="close.png" class="sticky-close" rel="' + uniqID + '" title="Close" />' );
			$('#' + uniqID).append( '<div class="sticky-note" rel="' + uniqID + '">' + note + '</div>' );
			
			// Smoother animation
			var height = $('#' + uniqID).height();
			$('#' + uniqID).css( 'height', height );
			
			$('#' + uniqID).slideDown( settings['speed'] );
			display = true;
		}
		
		// Listeners
		$('.sticky').ready( function() {
			// If 'autoclose' is enabled, set a timer to close the sticky
			if( settings['autoclose'] ) {
				$('#' + uniqID).delay( settings['autoclose'] ).fadeOut( settings['speed'] );
			}
		});
		// Closing a sticky
		$('.sticky-close').click( function() {
			$('#' + $(this).attr('rel')).dequeue().fadeOut( settings['speed'] );
		});
		
		
		// Callback data
		var response = {
			'id'        : uniqID,
			'duplicate'	: duplicate,
			'displayed'	: display,
			'position'	: settings['position']
		};
		
		// Callback function?
		if( callback ) {
			callback( response );
		}
		else {
			return response;
		}
		
	};
})( jQuery );