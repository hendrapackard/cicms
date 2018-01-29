<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Backend_Controller extends MY_Controller{

    function __construct()
    {
        parent::__construct();
        $this->load->helper(array());
        $this->load->library(array());
        $this->load->model(array());

        $this->site->side = 'backend';
        $this->site->template = 'templatevamp';

    }
}