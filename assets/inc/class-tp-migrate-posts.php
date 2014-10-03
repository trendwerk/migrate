<?php
/**
 * Migrate posts
 */
class TP_Migrate_Posts extends TP_Migrate {
	var $db_name = 'posts';
	var $type = 'posts';

	function __construct() {
		$this->_connect();

		add_action( 'wp_ajax_tp_migrate_' . $this->type . '_get', array( $this, 'get' ) );
		add_action( 'wp_ajax_tp_migrate_' . $this->type . '_add', array( $this, 'add' ) );
	}

	/**
	 * Get all entries
	 */
	function get() {
		$entries = $this->_db->get_results( "SELECT * FROM " . $this->db_name . "" );

		wp_send_json( $entries );
	}

	/**
	 * Add entry
	 *
	 * @param object $reference Entry to migrate
	 */
	function add() {
		remove_all_actions( 'save_post' );

		$reference = (object) $_POST['reference'];

		$new = array(
			'post_content' => $reference->content,
			'post_name'    => str_replace( '.html', '', $reference->url ),
			'post_status'  => 'publish',
			'post_title'   => $reference->title,
			'post_type'    => 'post',
		);

		//Add or update the page
		if( $_entry = $this->get_post( $reference->id, $this->db_name ) ) {
			$post_id = wp_update_post( wp_parse_args( array(
				'ID' => $_entry->ID,
			), $new ) );
		} else {
			$post_id = wp_insert_post( $new );
		}

		//Reference ID and table
		update_post_meta( $post_id, '_reference_id', $reference->id );
		update_post_meta( $post_id, '_reference_table', $this->db_name );

		//Setup redirect
		//TO DO: Setup redirect

		//Return
		wp_send_json( array(
			'entry' => get_post( $post_id ),
		) );
	}
} //new TP_Migrate_Posts;
