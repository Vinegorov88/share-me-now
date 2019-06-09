
if(top.location != 'http://localhost:8000/'){
    $('#uploadFileBtn').css('display', 'none');
    $('#infoFile').css('display', 'inline');
    $('#btnDownload').css('top', '82px');      
    $('#btnDownload').css('display', 'inline');
    $('.text-center').css('top', '83px');
}

$(document).on('click', '#uploadBtn', function(event){
    event.preventDefault();     
    $('input[type="file"]').click();
}); 

$('input[type="file"]').change(function () {

    if(this.files[0].size > 20000000) {
        $("div[role='dialog']").show();             
        return;
    }

    let files = this.files[0];

    let fData = new FormData();
    fData.append('myfile', files);
    
    $.ajax({ 
        
        beforeSend: function () {                
            $(".btn").hide();      
            $('.progress').show();
        },
        
        xhr: function () {
            let xhr = new window.XMLHttpRequest();
            xhr.upload.onprogress = function(event)
            {
                if (event.lengthComputable)
                {
                    function startProgress(){
                        let percentComplete = parseFloat((event.loaded / event.total) * 100);
                        
                        $('div[aria-valuenow="0"]').html(Math.round(percentComplete * 1) + "%");
                        $('div[style="width: 0%;"]').css('width', Math.round(percentComplete * 100) + "%");
                    }
                    startProgress();  
                }
            }, false
            return xhr;
        },
        
        url: '/file/upload',
        type: 'POST',
        data: fData,
        dataType: "json",
        processData: false,
        contentType: false,
        crossDomain: true,
        
        error: function(res){
            console.log(res);
        },        
        success: function(res){

            $(".progress").hide();
            $('#fileUrlDownload').removeClass('hide').val(res);
            $('.text-center').hide();
            $("input[type='text']").show();
            $('#fileUrlDownload').css({"margin-left":"250px;"});
            $('#btnCopy').show();
        }
    });             
}); 

$(document).on('click', '#btnCopy', function(res){
    $('#fileUrlDownload input').val(res);
    $('#fileUrlDownload').focus();
    $('#fileUrlDownload').select();
    document.execCommand("copy");
});

$(document).on('click', '#closeModal', function(){
    $('#modalWindow').hide();
    $("input[type='file']").val('');
});



