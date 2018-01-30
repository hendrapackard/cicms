<?php

    function get_template_directory($path,$dir_file){
        global $SConfig;

        $replace_path = str_replace('\\','/',$path);
        $get_digit_doc_root = strlen($SConfig->_document_root);
        $full_path = substr($replace_path,$get_digit_doc_root);
        return $SConfig->_site_url.$full_path.'/'.$dir_file;
    }

    function get_template($view){
        $_this =& get_instance();
        return $_this->site->view($view);
    }

    function set_url($sub){
        $_this =& get_instance();
        if ($_this->site->side == 'backend'){
            return site_url('admin/'.$sub);
        }
    }

    function is_active_page_print($page,$class){
        $_this =& get_instance();
        if ($_this->site->side == 'backend' && $page == $_this->uri->segment(2)){
            return $class;
        }
    }

    function title(){
        $_this =& get_instance();
        global $SConfig;

        $array_backend_page = array(
            'dashboard' => 'Dashboard',
            'artikel' => 'Daftar Artikel',
            'halaman' => 'Daftar Halaman',
            'produk' => 'Daftar Produk',
            'komentar' => 'Daftar Komentar',
            'statistik' => 'Statistik',
            'tampilan' => 'Tampilan',
            'konfigurasi' => 'Konfigurasi',
            'user' => 'Daftar User',
        );

        $title = NULL;
        if ($_this->site->side == 'backend' && (array_key_exists($_this->uri->segment(2), $array_backend_page)))
            return $array_backend_page[$_this->uri->segment(2)].' | '.$SConfig->_cms_name;
    }

?>