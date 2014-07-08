var TP_Migrate_Main;

(function($){
	TP_Migrate_Main = function( _updater, type ) {
		var self = this;

		self.migrated = 0;

		this._init = function() {
			_updater.status = { name: type + '_init' };
			_updater.progress = {};
			_updater.render();

			self.start();
		}

		/**
		 * Start migration
		 */
		this.start = function() {
			var data = {
				action: 'tp_migrate_' + type + '_get'
			};

			$.post( ajaxurl, data, function( entries ) {
				if( 0 < entries.length ) {
					self.entries = entries;
					self.migrate();
				} else {
					self.finished();
				}
			} );
		}

		/**
		 * Migrate entries
		 */
		this.migrate = function() {
			self.update();
			
			for( var i = 0; i < self.entries.length; i++ ) {
				self.schedule( i );
			}
		}

		/**
		 * Schedule entry to migrate
		 */
		this.schedule = function( i ) {
			setTimeout( function() {
				self.migrateEntry( self.entries[i] );
			}, 0 * i );
		}

		/**
		 * Migrate an entry
		 */
		this.migrateEntry = function( entry ) {
			var data = {
				action:    'tp_migrate_' + type + '_add',
				reference: entry
			};

			$.post( ajaxurl, data, function( response ) {
				self.migrated++;
				self.update();

				if( ! response.entry )
					console.log( response );

				if( self.migrated == self.entries.length ) 
					self.finished();
			} );
		}

		/**
		 * Update progress
		 */
		this.update = function() {
			_updater.status = {
				name:   type + '_migrating', 
				args: 	{ '%i': self.migrated, '%t': self.entries.length }
			};

			_updater.progress = {
				val: self.migrated,
				max: self.entries.length
			};

			_updater.render();
		}

		/**
		 * Finished
		 */
		this.finished = function() {
			_updater.next();
		}

		/**
		 * Initialize
		 */
		self._init();
	}
})(jQuery);
