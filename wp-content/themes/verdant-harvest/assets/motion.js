( function () {
	var reduce = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	// Duplicate marquee items so the -50% translate loop is seamless.
	// Done in JS so the editor shows a single, clean set of items.
	if ( ! reduce ) {
		document.querySelectorAll( '.vh-marquee__track' ).forEach( function ( track ) {
			var items = Array.prototype.slice.call( track.children );
			items.forEach( function ( item ) {
				var clone = item.cloneNode( true );
				clone.setAttribute( 'aria-hidden', 'true' );
				track.appendChild( clone );
			} );
		} );
	}

	if ( reduce ) {
		return;
	}

	// Scroll-reveal: JS applies the hidden initial state so the editor
	// (no JS) always shows elements in their final visible state. Uses a
	// class rather than inline styles so the .vh-in CSS rule (added on
	// intersect) can override it via normal cascade order — an inline
	// style can never be beaten by a class-based rule.
	var revealers = document.querySelectorAll( '.vh-reveal' );
	revealers.forEach( function ( el ) {
		el.classList.add( 'vh-pending' );
	} );

	if ( 'IntersectionObserver' in window ) {
		var io = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'vh-in' );
						io.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
		);
		revealers.forEach( function ( el ) {
			io.observe( el );
		} );
	} else {
		revealers.forEach( function ( el ) {
			el.classList.add( 'vh-in' );
		} );
	}
}() );
