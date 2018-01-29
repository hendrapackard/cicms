<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends Frontend_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
	    /*$data = array(
	        'username' => 'admin',
	        'password' => 'admin',
            'group' => 'admin',
            'email' => 'admin@gmail.com'
        );

	    $id = $this->User_model->insert($data);
	    echo $id;*/

        /*$data = array(
            'group' => 'user',
        );

        $this->User_model->update($data, array('ID' => 2));*/

//        $this->User_model->delete(2);

//        echo base_url();
		$this->site->view('index');
	}
}
