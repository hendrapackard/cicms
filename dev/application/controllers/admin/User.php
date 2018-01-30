<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends Backend_Controller{

    protected $user_detail;

    public function __construct()
    {
        parent::__construct();
    }

    public function login()
    {
        $post = $this->input->post(null,true);

        if (isset($post['username'])){
            $this->user_detail = $this->User_model->get_by(
                array('username' => $post['username'],'group' => 'admin'),1,null,true
            );
        }

        $this->form_validation->set_message('required','%s kosong, tolong diisi');;

        $rules = $this->User_model->rules;
        $this->form_validation->set_rules($rules);

        if ($this->form_validation->run() == FALSE){
            $this->site->view('login');
        }
        else{
            $login_data = array(
                'ID' => $this->user_detail->ID,
                'username' => $post['username'],
                'logged_in' => TRUE,
                'active' => $this->user_detail->active,
                'last_login' => $this->user_detail->last_login,
                'group' => $this->user_detail->group,
                'email' => $this->user_detail->email
            );

            $this->session->set_userdata($login_data);

            if (isset($post['remember'])){
                $expire = time() + (86400 * 7);
                set_cookie('username',$post['username'],$expire,"/");
                set_cookie('password',$post['password'],$expire,"/");
            }

            redirect(set_url('dashboard'));
        }

    }

    public function logout()
    {
        $this->session->sess_destroy();
        redirect(set_url('login'));
    }

    /*public function temporary_register()
    {
        $data_user_baru = array(
            'username' => 'admin',
            'group' => 'admin',
            'password' => bCrypt('admin',12),
            'email' => 'admin@bagiilmu.com',
            'active' => 1
        );

        $this->User_model->insert($data_user_baru);
    }*/

    public function password_check($str)
    {
        $user_detail = $this->user_detail;
        if (@$user_detail->password == crypt($str,@$user_detail->password)){
            return true;
        }
        elseif (@$user_detail->password){
            $this->form_validation->set_message('password_check','Passwordnya Anda salah');
            return false;
        }
        else{
            $this->form_validation->set_message('password_check','Anda tidak memiliki hak akses Admin');
        }
    }


}