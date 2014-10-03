var TP_Migrate;

( function( $ ) {
	TP_Migrate = function( el ) {
		var self = this;

		self.status = {
			name: '',
			args: {}
		};

		self.progress = {
			max: 100
		};

		self.step = 0;

		/**
		 * Start migration
		 */
		this.start = function() {
			self.startProgress();
			self.next();			
		}

		/**
		 * Migration steps
		 */
		this.next = function() {
			switch( self.step ) {
				case 0:
					new TP_Migrate_Main( self, 'posts' );
					break;
				case 1:
					new TP_Migrate_Main( self, 'posts' );
					break;
				default:
					self.status = { name: 'finished' };
					self.renderStatus();
					$( '.tp-migrate-status' ).addClass( 'finished' );

					break;
			}
			
			self.step++;
		}

		/**
		 * Render
		 */
		this.render = function() {
			if( self.progress.hasOwnProperty( 'val' ) ) {
				$( el ).find( 'progress' ).val( self.progress.val );
				$( el ).find( 'progress' ).prop( 'max', self.progress.max );
			} else {
				$( el ).find( 'progress' ).removeAttr( 'value' );
				$( el ).find( 'progress' ).prop( 'max', '1' );
			}

			self.renderStatus();
		}

		/**
		 * Render status
		 */
		this.renderStatus = function() {
			label = TP_Migrate_Labels[ self.status.name ];

			for(var arg in self.status.args) {
				label = label.split( arg ).join( self.status.args[ arg ] );
			}

			$( el ).find( '.tp-migrate-status' ).html( label );
		}

		/**
		 * Hide form and show loader
		 */
		this.startProgress = function() {
			$( el ).find( 'form' ).hide( 350 );
			$( el ).find( 'div.progress' ).show( 350 );
		}
		
		/**
		 * Initialize
		 */
		$( document ).ready( function() {
			self.events();
		} );

		/**
		 * Add events
		 */
		this.events = function() {
			$( el ).find( '.tp-migrate-start' ).click( function() {
				self.start();
			} );
		}
	}
	
	$.fn.migrate = function() {
		return this.each( function() {
			if( $( this ).data( 'migrate' ) ) 
				return;

			var migrate = new TP_Migrate( this );
			$( this ).data( 'migrate', migrate );
		} );
	}
	
	$( document ).ready( function() {
		$( '.tp-migrate' ).migrate();
	} );
} )( jQuery );
