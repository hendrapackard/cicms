var path = window.location.pathname;
var host = window.location.hostname;

    $(function () {
        $(window).hashchange(function () {
            var hash = $.param.fragment();

            if (hash == 'tambah'){
                if(path.search('admin/artikel') > 0){
                    $('#myModal .modal-header #myModalLabel').text('Tambah Artikel');
                    $('#myModal .modal-footer #submit-artikel').text('Tambah');
                    $('#myModal #form-artikel').attr('action','tambah');
                }

                $('#myModal').addClass('big-modal');
                $('#myModal').modal('show');
            }

            else if(hash.search('edit') == 0){

                if(path.search('admin/artikel') > 0){
                    $('#myModal .modal-header #myModalLabel').text('Edit Artikel');
                    $('#myModal .modal-footer #submit-artikel').text('Update!');
                    $('#myModal #form-artikel').attr('action','update');
                }

                $('#myModal').addClass('big-modal');
                $('#myModal').modal('show');
            }

            else if(hash.search('hapus') == 0){

                if(path.search('admin/artikel') > 0){
                    $('#myModal form').hide();
                    $('#myModal .modal-header #myModalLabel').text('Hapus Artikel');
                    $('#myModal .modal-footer #submit-artikel').text('Hapus!');
                    $('#myModal #form-artikel').attr('action','hapus');
                    $('#myModal .modal-body').prepend('<p id="hapus-notif">Apakah Anda yakin akan menghapus : Artikel ... ???</p>');
                }

                $('#myModal').modal('show');
            }


        });

        $(window).trigger('hashchange');

        $('#myModal').on('hidden',function () {
            window.history.pushState(null,null,path);
            $('#myModal').removeClass('big-modal');
            $('#myModal #hapus-notif').remove();
            $('#myModal form').find("input[type=text],textarea").val(""); //untuk menetralkan inputan
            $('#myModal form').show();
        });

        /* ************************************** */
        /*        BACKEND BAGIAN ARTIKEL          */
        /* ************************************** */

        $(document).on('click','#submit-artikel',function (eve) {
            eve.preventDefault();

            var action = $('#form-artikel').attr('action');
            var datatosend = $('#form-artikel').serialize();

            $.ajax('http://'+host+path+'/action/'+action,{
                dataType : 'json',
                type : 'POST',
                data : datatosend,
                success : function (data) {
                    if (data.status == 'success') {
                        $('#myModal').modal('hide');
                        $('div.widget-content').prepend(
                            '<div class="control-group"><div class="alert alert-info">'+
                            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
                            '<strong>Berhasil!</strong> Artikel telah diperbaharui...</div></div>'
                        );
                    }
                    else {
                        $.each(data.errors,function (key,value){
                            $('#'+key).attr('placeholder',value);
                        })
                    }
                }
            });
        })
    });

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
    };

    var myLine = new Chart(document.getElementById("area-chart").getContext("2d")).Line(lineChartData);