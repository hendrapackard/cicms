var path = window.location.pathname;
var host = window.location.hostname;

$(function(){   
  $(window).hashchange(function(){
    var hash = $.param.fragment();      

    if(hash == 'tambah'){
      if(path.search('admin/artikel/kategori') > 0){       
        var kategori_artikel = getJSON('http://'+host+path+'/ambil',{});
        
        /* kategori artikel */
        $('#category_parent option').remove();
        $('#category_parent').append('<option value="">Pilih Induk Kategori</option>');
        if(kategori_artikel.record){
          $.each(kategori_artikel.record, function(key, value) {
               $('#category_parent').append('<option value="'+value['category_ID']+'">'+value['category_name']+'</option>');
          });          
        }

        $('#myModal .modal-header #myModalLabel').text('Tambah Kategori Artikel');
        $('#myModal .modal-footer #submit-kategori-artikel').text('Tambah!');
        $('#myModal #form-kategori-artikel').attr('action', 'tambah');    
      }

      else if(path.search('admin/artikel') > 0){
        $('#myModal .modal-header #myModalLabel').text('Tambah Artikel');
        $('#myModal .modal-footer #submit-artikel').text('Tambah!');
        $('#myModal #form-artikel').attr('action','tambah');        
      }
      
      $('#myModal').addClass('big-modal');
      $('#myModal').modal('show');
    }

    else if(hash.search('edit') == 0){

      if(path.search('admin/artikel/kategori') > 0){

        /* kategori artikel */
        var kategori_artikel = getJSON('http://'+host+path+'/ambil',{});          
        $('#category_parent option').remove();
        $('#category_parent').append('<option value="">Pilih Induk Kategori</option>');
        if(kategori_artikel.record){
          $.each(kategori_artikel.record, function(key, value) {
               $('#category_parent').append('<option value="'+value['category_ID']+'">'+value['category_name']+'</option>');
          });          
        }

        /* get value kategori */
        var cat_ID = getUrlVars()["id"];
        var kategori_detail = getJSON('http://'+host+path+'/ambil',{id: cat_ID});
        $('#myModal .modal-body #category_name').val(kategori_detail.data['category_name']);
        $('#myModal .modal-body #category_description').val(kategori_detail.data['category_description']);
        $('#myModal .modal-body #category_parent option[value ="'+kategori_detail.data['category_parent']+'"]').prop('selected', true);

        /* all atribut initialized */          
        $('#myModal .modal-body #category_id').val(cat_ID);

        $('#myModal .modal-header #myModalLabel').text('Edit Artikel');
        $('#myModal .modal-footer #submit-kategori-artikel').text('Update!');
        $('#myModal #form-kategori-artikel').attr('action', 'update');        
      }

      else if(path.search('admin/artikel') > 0){
        var post_ID = getUrlVars()['id'];
        var artikel_detail = getJSON('http://'+host+path+'/action/ambil', {id:post_ID});
        $('#myModal .modal-body #post_title').val(artikel_detail.data['post_title']);
        $('#myModal .modal-body #post_content').val(artikel_detail.data['post_content']);
        $('#myModal .modal-header #myModalLabel').text('Edit Artikel');
        $('#myModal .modal-footer #submit-artikel').text('Update!');
        $('#myModal #form-artikel').attr('action','update');  
        $('#myModal #form-artikel #post_id').val(post_ID);        
      }
      
      $('#myModal').addClass('big-modal');
      $('#myModal').modal('show');      
    }

    else if(hash.search('hapus') == 0){
      if(path.search('admin/artikel/kategori') > 0){
        var category_ID = getUrlVars()["id"];
        var kategori_detail = getJSON('http://'+host+path+'/ambil',{id: category_ID});          
        $('#myModal form').hide();  
        $('#myModal #form-kategori-artikel').attr('action', 'hapus');
        $('#myModal .modal-header #myModalLabel').text('Hapus Kategori Artikel');
        $('#myModal .modal-footer #submit-kategori-artikel').text('Ya Hapus Saja!');
        $('#myModal .modal-body').prepend('<p id="hapus-notif">Apakah Anda yakin akan menghapus : <b>"'+kategori_detail.data['category_name']+'"</b> ???</p>');
        $('#myModal #form-kategori-artikel #category_id').val(category_ID);      
      }

      else if(path.search('admin/artikel') > 0){
        var post_ID = getUrlVars()['id'];
        var artikel_detail = getJSON('http://'+host+path+'/action/ambil', {id: post_ID});
        $('#myModal form').hide();
        $('#myModal .modal-header #myModalLabel').text('Hapus Artikel');
        $('#myModal .modal-footer #submit-artikel').text('Hapus Saja!');
        $('#myModal #form-artikel').attr('action','hapus');   
        $('#myModal .modal-body').prepend('<p id="hapus-notif">Apakah Anda yakin akan menghapus : Artikel <b>'+artikel_detail.data['post_title']+'</b> ???</p>');
        $('#myModal #form-artikel #post_id').val(post_ID);
      }
      
      $('#myModal').modal('show');  
    }

    else if(hash.search('ambil') == 0){
      if(path.search('admin/artikel')){
        var hal_aktif, cari, kategori = null;
        var hash = getUrlVars();

        if(hash['hal']){
          hal_aktif = hash['hal'];
        }

        ambil_artikel(hal_aktif,true);
        $("ul#pagination-artikel li a:contains('"+hal_aktif+"')").parents().addClass('active').siblings().removeClass('active');        
      }
    }
  });

  $(window).trigger('hashchange');

  $('#myModal').on('hidden', function(){
    window.history.pushState(null,null,path);
    $('#myModal').removeClass('big-modal');
    $('#myModal #hapus-notif').remove();
    $('#myModal form').find("input[type=text], textarea").val("");
    $('#myModal form').show();
  });

  moment.locale('id');

  /* ************************************** */
  /*        BACKEND BAGIAN ARTIKEL          */
  /* ************************************** */

  $(document).on('click', '#submit-artikel', function(eve){
    eve.preventDefault();

    var action = $('#form-artikel').attr('action');
    var datatosend = $('#form-artikel').serialize();

    $.ajax('http://'+host+path+'/action/'+action,{
      dataType:'json',
      type: 'POST', 
      data: datatosend,
      success: function(data){
        if(data.status == 'success'){
          ambil_artikel(null,false);
          $('#myModal').modal('hide');
          $('div.widget-content').prepend(
              '<div class="control-group"><div class="alert alert-info">'+
              '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
              '<strong>Berhasil!</strong> Artikel telah diperbaharui ... </div></div>'
            );          
        }
        else{
          $.each(data.errors, function(key, value){
            $('#'+key).attr('placeholder', value);
          });
        }
      }

    });
  });

  ambil_artikel(null,false);

  /* ******************************************************************** */
  /* Tambah / Update Hapus Kategori Artikel (CREATE UPDATE DELETE)  */
  /* ******************************************************************** */
  $(document).on('click','#submit-kategori-artikel', function(eve){
    eve.preventDefault();
    var action = $('#form-kategori-artikel').attr('action');

    $.ajax('http://'+host+path+'/'+action, {
      dataType : 'json',
      type : 'POST',
      data: $('#form-kategori-artikel').serialize(),
      success: function(data){
        if(data.status == 'success'){
          ambil_kategori();
          $('#myModal').modal('hide');
        }
        else{
          $.each(data.errors, function(key, value) {
            $('#'+key).attr('placeholder', value);
          });
        }
         
      }

    });  
  });

  /* ************************************** */
  /* Ambil Kategori (READ) */
  /* ************************************** */    
  ambil_kategori();

});


/* ************************************** */
/*        ANEKA JAVASCRIPT FUNCTION       */
/* *************************w************* */

function ambil_artikel(hal_aktif,scrolltop){
  if($('table#tbl-artikel').length > 0){
    // alert('ada tablenya');
    $.ajax('http://'+host+path+'/action/ambil',{
      dataType:'json',
      type: 'POST', 
      data:{hal_aktif:hal_aktif},
      success: function(data){
        $('table#tbl-artikel tbody tr').remove();
        $.each(data.record , function(index, element){
           $('table#tbl-artikel').find('tbody').append(
              '<tr>'+
              '  <td width="2%"><input type="checkbox" name="post_id[]" value="'+element.post_ID+'"></td>'+
              '  <td width="50%"><a class="link-edit" href="artikel#edit?id='+element.post_ID+'">'+element.post_title+'</a> <strong></strong></td>'+
              '  <td width="10%"><i class="icon-comment-alt"></i> <span class="value">'+element.comment_count+'</span></td>'+
              '  <td width="10%"><i class="icon-eye-open"></i> <span class="value">'+element.post_counter+'</span></td>'+
              '  <td width="12%"><i class="icon-time"></i> <span class="value">'+moment(element.post_date).fromNow()+'</span></td>'+
              '  <td width="16%" class="td-actions">'+
              '    <a href="artikel#edit?id='+element.post_ID+'" class="link-edit btn btn-small btn-info"><i class="btn-icon-only icon-pencil"></i> Edit</a>'+
              '    <a href="artikel#hapus?id='+element.post_ID+'" class="btn btn-invert btn-small btn-info"><i class="btn-icon-only icon-remove" id="hapus_1"></i> Hapus</a>'+
              '  </td>'+
              '</tr>'                
            )
        });
        
        /* BAGIAN UNTUK PAGINATION DILETAKKAN DISINI */
        var pagination = '';
        var paging = Math.ceil(data.total_rows / data.perpage);

        if( (!hal_aktif) && ($('ul#pagination-artikel li').length == 0)){
          $('ul#pagination-artikel li').remove();
          for(i = 1; i <= paging ; i++){
            pagination = pagination + '<li><a href="artikel#ambil?hal='+i+'">'+i+'</a></li>';
          }
        }

        $('ul#pagination-artikel').append(pagination);
        $("ul#pagination-artikel li:contains('"+hal_aktif+"')").addClass('active');

        if(scrolltop == true) {
          $('body').scrollTop(0);
        }
    
      }

    });
  }
}

function ambil_kategori(){
  // jsfiddle.net/LkkwH/1/
  // http://jsfiddle.net/sw_lasse/9wpHa/
  var path = window.location.pathname;
  var host = window.location.hostname;  
  if($('#list-kategori').length > 0){
    $.ajax('http://'+host+path+'/ambil', {
      dataType : 'json',
      type : 'POST',
      success: function(data){
          
        $('#list-kategori ul').remove();
         /*
        // BAGIAN 1 
        var htmlStr = '<ul class="list-group hirarki kategori">';
        
        $.each(data.record, function(index, element) {
            htmlStr = htmlStr + '<li id="ID_'+element.category_ID+'" class="list-group-item">';          
            htmlStr = htmlStr + '<a class="link-edit" href="kategori#edit?id='+element.category_ID+'">'+element.category_name+'</a>';
            htmlStr = htmlStr + '<div class="pull-right">';
            htmlStr = htmlStr + '<a href="kategori#edit?id='+element.category_ID+'" class="link-edit btn btn-small btn-info"><i class="btn-icon-only icon-pencil"></i> Edit</a> ';
            htmlStr = htmlStr + '<a href="kategori#hapus?id='+element.category_ID+'" id="hapus_" class="btn btn-invert btn-small"><i class="btn-icon-only icon-remove"></i> Hapus</a>';
            htmlStr = htmlStr + '</div>' ;                  
            htmlStr = htmlStr + '</li>'; 
        });

        htmlStr = htmlStr + "</ul>";
        
        $('#list-kategori').html(htmlStr); 
         */
       
        var htmlStr = "";
        var printTree = function (node) {

          htmlStr = htmlStr + '<ul class="list-group hirarki kategori">';        
          
          for (var i = 0; i < node.length; i++){
            if(node[i]['children']) var listyle = 'li-parent';
            else listyle = '';
            htmlStr = htmlStr + '<li id="ID_'+node[i]['category_ID']+'" class="list-group-item '+listyle+'">';          
            htmlStr = htmlStr + '<a class="link-edit" href="kategori#edit?id='+node[i]['category_ID']+'">'+node[i]['category_name']+'</a>';
            htmlStr = htmlStr + '<div class="pull-right">';
            htmlStr = htmlStr + '<a href="kategori#edit?id='+node[i]['category_ID']+'" class="link-edit btn btn-small btn-info"><i class="btn-icon-only icon-pencil"></i> Edit</a> ';
            htmlStr = htmlStr + '<a href="kategori#hapus?id='+node[i]['category_ID']+'" id="hapus_" class="btn btn-invert btn-small"><i class="btn-icon-only icon-remove"></i> Hapus</a>';
            htmlStr = htmlStr + '</div>'
            
            if(node[i]['children']){
              printTree(node[i]['children'])
            }
            
            htmlStr = htmlStr + '</li>';         
          }

          htmlStr = htmlStr + '</ul>';
          return htmlStr;
        }

        tree = unflatten( data.record );

        $('#list-kategori').html(printTree(tree));

       
        
        $('#list-kategori .list-group').sortable({
          opacity: 0.5,
          cursor: 'move',
          placeholder: 'ui-state-highlight',
          update: function() {
            var orderAll = [];
            $('.list-group li').each(function(){
                 orderAll.push($(this).attr('id').replace(/_/g, '[]='));
            });
            
            // alert($(this).sortable('serialize'));
            $.post( 'http://'+host+path+'/sortir', orderAll.join('&'));
          }
        });               
      }

    });
  }
}

function unflatten( array, parent, tree ){
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { category_ID: 0 };
      
  var children = _.filter( array, function(child){ return child.category_parent == parent.category_ID; });
  
  if( !_.isEmpty( children )  ){
      if( parent.category_ID == 0 ){
         tree = children;   
      }else{
         parent['children'] = children;
      }
      _.each( children, function( child ){ unflatten( array, child ) } );                    
  }
  
  return tree;
}

function getJSON(url,data){
  return JSON.parse($.ajax({
    type: 'POST',
    url : url,
    data:data,
    dataType:'json',
    global: false,
    async: false,
    success:function(msg){

    }
  }).responseText);
}

function getUrlVars(){
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}

var lineChartData = {
      labels: ["23", "25", "25", "26", "27"],
      datasets: [
        {
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: [2700, 2700, 2900, 2600, 2900]
        }
      ]
}

var myLine = new Chart(document.getElementById("area-chart").getContext("2d")).Line(lineChartData);
