<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Frontend_Controller extends MY_Controller{

    function __construct()
    {
        parent::__construct();
        $this->load->helper(array());
        $this->load->library(array());
        $this->load->model(array('User_model'));

        $this->site->side = 'frontend';
        $this->site->template = 'default';
    }
}