var upload = document.getElementById('upload');
var confirmButton = $("#confirm");
var resetButton = $("#reset");

function onFile() {
    var me = this,
        file = upload.files[0],
        name = file.name.replace(/.[^/.]+$/, '');
    console.log('upload code goes here', file, file.name);
    $('#box').removeClass("area").addClass("preview");
    readURL(upload);
    resetButton.show();
    confirmButton.show();
}

upload.addEventListener('dragenter', function (e) {
    upload.parentNode.className = 'area dragging';
}, false);

upload.addEventListener('dragleave', function (e) {
    upload.parentNode.className = 'area';
}, false);

upload.addEventListener('dragdrop', function (e) {
    onFile();
}, false);

upload.addEventListener('change', function (e) {
    onFile();
}, false);

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#box').css('background-image', `url(${e.target.result})`);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

resetButton.click(() => {
    $('#box').css('background-image', `url("/public/assets/img/placeholder.png")`);
    $('#box').removeClass("preview").addClass("area");
    upload.value = "";
    resetButton.hide();
    confirmButton.hide();
});

confirmButton.click(() => {
    alert("File uploaded!");
});

// TYPE CHECK
// if (file.type === 'audio/mp3' || file.type === 'audio/mpeg') {
//     if (file.size < (3000 * 1024)) {
//         upload.parentNode.className = 'area uploading';
//     } else {
//         window.alert('File size is too large, please ensure you are uploading a file of less than 3MB');
//     }
// } else {
//     window.alert('File type ' + file.type + ' not supported');
// }

$(".uploadForm").on('submit', function (e) {
    $('.buttonUpload').prop('disabled', true).css({ 'background-color': 'grey' });
    e.preventDefault();
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = ((evt.loaded / evt.total) * 100);
                    $(".progress-bar").width(percentComplete + '%');
                    $(".progress-bar>span").html(percentComplete.toFixed(2) + '%');
                }
            }, false);
            return xhr;
        },
        type: 'POST',
        url: '/php/upload.php',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function () {
            $(".progress-bar").width('0%');
        },
        syncLocalFiles: () => {
            _.each(fs_arr, (fs) => {
                if (fs.actual_node.id == 7)
                    fs.renderElements(file_manager.upload);
            });
            _.each(shells, (s) => {
                if (s.actual_node.id == 7)
                    s.actual_node = file_manager.upload;
            });
        },
        error: function () {
            $('.uploadStatus').html('<p style="color:#EA4335;">File upload failed, please try again.</p>');
        },
        success: function (response) {
            const resp = { path: response.split("!")[0], type: response.split("!")[1] }
            //console.log(resp);
            //console.log(['jpg', 'png', 'jpeg', 'gif'].includes(resp.type));
            $('.uploadForm')[0].reset();
            $('.uploadStatus').html('<p style="color:#28A74B;">File has been uploaded successfully!</p>')
                .append(['jpg', 'png', 'jpeg', 'gif'].includes(resp.type) ? '<img src="/php/' + resp.path + '"><br>' : "")
                .append('<a href="/php/' + resp.path + '" target="_blank">Click here to open it.</a>');
            getRemoteFiles();
            setTimeout(this.syncLocalFiles, 1000);
        }
    });
});