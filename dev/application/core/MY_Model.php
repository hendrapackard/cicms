<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Model extends CI_Model{
    protected $_table_name;
    protected $_order_by;
    protected $_order_by_type;
    protected $_primary_filter = 'intval';
    protected $_primary_key;
    protected $_type;
    public $rules;

    function __construct()
    {
        parent::__construct();
    }

    //Memasukkan data ke database
    public function insert($data,$batch=FALSE)
    {
        if ($batch == TRUE){
            $this->db->insert_batch('{PRE}'.$this->_table_name,$data);
        }
        else{
            $this->db->set($data);
            $this->db->insert('{PRE}'.$this->_table_name);
            $id = $this->db->insert_id();
            return $id;
        }
    }

    //Mengubah data ke database
    public function update($data, $where = array())
    {
       $this->db->set($data);
       $this->db->where($where);
       $this->db->update('{PRE}'.$this->_table_name);
    }

    //Untuk Mendapatkan data
    public function get($id = NULL, $single = FALSE)
    {
        if ($id != NULL){
            $filter = $this->_primary_filter;
            $id = $filter($id);
            $this->db->where($this->_primary_key,$id);
            $method = 'row';
        }

        elseif ($single == true){
            $method = 'row';
        }

        else{
            $method = 'result';
        }

        if ($this->_order_by_type){
            $this->db->order_by($this->_order_by,$this->_order_by_type);
        }
        else{
            $this->db->order_by($this->_order_by);
        }

        return $this->db->get('{PRE}'.$this->_table_name)->$method();
    }

    //Untuk Mendapatkan data berdasarkan array
    public function get_by($where = null, $limit = null, $offset = null, $single = false, $select = null)
    {
        if ($select != NULL){
            $this->db->select($select);
        }

        if ($where){
            $this->db->where($where);
        }

        if (($limit) && ($offset)){
            $this->db->limit($limit,$offset);
        }
        elseif($limit){
            $this->db->limit($limit);
        }

        return $this->get(NULL,$single);
    }

    //Untuk menghapus data
    public function delete($id)
    {
        $filter = $this->_primary_filter;
        $id = $filter($id);

        if (!$id){
            return FALSE;
        }

        $this->db->where($this->_primary_key,$id);
        $this->db->limit(1);
        $this->db->delete('{PRE}'.$this->_table_name);
    }

    //Untuk menghapus data berdasarkan array
    public function delete_by($where =null)
    {
        if ($where){
            $this->db->where($where);
        }

        $this->db->delete('{PRE}'.$this->_table_name);
    }

    //Untuk menghitung jumlah data
    public function count($where = null)
    {
        if (!empty($this->_type)){
            $where['post_type'] = $this->_type;
        }

        if ($where){
            $this->db->where($where);
        }

        $this->db->from('{PRE}'.$this->_table_name);
        return $this->db->count_all_results();
    }
}