<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Controller extends CI_Controller{

    public $data = array();

    function __construct()
    {
        parent::__construct();

        $this->load->helper(array());
        $this->load->library(array('Site'));
        $this->load->model(array());
    }

}