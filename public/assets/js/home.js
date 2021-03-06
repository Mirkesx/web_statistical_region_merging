var upload = document.getElementById('upload');
var confirmButton = $("#confirm");
var resetButton = $("#reset");
var editBox = $("#edit-srm");
var confirmSRMButton = $("#confirm-srm");
var resetSRMButton = $("#reset-srm");
var baseUrl = `${location.protocol}//${location.host}`;

$('.toast-success').toast({
    'delay': 3000
});

$('.toast-danger').toast({
    'delay': 3000
});

$('#valueQ').on('change', () => {
    var q = $('#valueQ').val();
    $('#valueRange').val(q);
}).on('mousemove', () => {
    var q = $('#valueQ').val();
    $('#valueRange').val(q);
});

$('#kernel1').on('input', () => {
    var current_val = Math.floor($('#kernel1').val());
    var next_val = current_val;
    if (current_val % 2 != 1 || current_val.length > 1) {
        if (current_val == "" || current_val < 3) {
            next_val = 3;
        } else if (current_val > 7) {
            next_val = 7;
        } else {
            next_val = current_val - 1;
        }
    }
    $('#kernel1').val(next_val);
});

$('#kernel2').on('input', () => {
    var current_val = Math.floor($('#kernel2').val());
    var next_val = current_val;
    if (current_val % 2 != 1 || current_val.length > 1) {
        if (current_val == "" || current_val < 3) {
            next_val = 3;
        } else if (current_val > 7) {
            next_val = 7;
        } else {
            next_val = current_val - 1;
        }
    }
    $('#kernel2').val(next_val);
});

function isASupportedFile(filename) {
    var splitted = filename.split(".");
    var type = splitted[splitted.length - 1];
    return ['jpg','jpeg','png','tiff','tif'].includes(type);
}

function onFile() {
    var file = upload.files[0];
    //console.log('upload code goes here', file, file.name);
    if(isASupportedFile(file.name)) {
        $('#box').removeClass("area").addClass("preview");
        readURL(upload);
        resetButton.fadeIn();
        confirmButton.fadeIn();
    } else {
        $('#toast-error').html('The file is not supported!');
        $('.toast-danger').toast('show');
        reset();
    }
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
            //setUploadImage(e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function reset() {
    //$('#box').css('background-image', `url("/public/assets/img/placeholder.png")`);
    //$('#srmBox').css('background-image', `url("/public/assets/img/placeholder.png")`);
    setUploadImage("public/assets/img/placeholder.png");
    //setSRMImage("public/assets/img/placeholder.png");
    $('#box').removeClass("preview").addClass("area");
    $('#fileName').val("");
    upload.value = "";
    editBox.fadeOut();
    resetButton.fadeOut();
    confirmButton.fadeOut();
    cleanInputs();
    resetCarousel()
    $('#upload').prop('disabled', false);
}

resetButton.click(() => {
    reset();
});

resetSRMButton.click(() => {
    reset();
})

confirmButton.click(() => {
    $('#upload').prop('disabled', true);

    var data = new FormData();
    $.each($('#upload')[0].files, function (i, file) {
        data.append('file-' + i, file);
    });

    $.ajax({
        url: `${baseUrl}/upload`,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST',
        success: function (data) {
            console.log(data);
            var data = JSON.parse(data);
            $('#fileName').val(data.file_name);
            setUploadImage(`public/uploads/original_${data.file_name.split(".")[0]}.png`);
            $('#toast-success').html(data.success);
            $('.toast-success').toast('show');
            resetButton.fadeOut();
            confirmButton.fadeOut();
            editBox.fadeIn();
        },
        error: function (error) {
            console.log(error);
            var error = JSON.parse(error);
            $('#toast-error').html('Upload failed!');
            $('.toast-danger').toast('show');
            reset();
        }
    });
});

function enableEditBox() {
    $('#spinner-srm').hide();
    editBox.find('input').each(function () {
        $(this).prop( "disabled", false );
    }).find('button').each(function () {
        $(this).prop( "disabled", false );
    });
}

function disableEditBox() {
    $('#spinner-srm').css('display', 'inline-block');
    editBox.find('input').each(function () {
        $(this).prop( "disabled", true );
    }).find('button').each(function () {
        $(this).prop( "disabled", true );
    });
}

function cleanInputs() {
    $('#originalSRM').val("");
    $('#segmentedSRM').val("");
    $('#bordersSRM').val("");
    $('#segBordersSRM').val("");
}

confirmSRMButton.click(() => {
    resetCarousel()
    disableEditBox();
    cleanInputs();

    var data = {
        file_name: $('#fileName').val(),
        qvalue: $('#valueQ').val(),
        k1: $('#kernel1').val(),
        k2: $('#kernel2').val(),
        color: $('#colorBorder').val(),
        max_regions: $('#regions').val(),
        min_size: $('#min_size').val()
    };

    $.ajax({
        url: `${baseUrl}/performSRM`,
        data: JSON.stringify(data),
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        method: 'POST',
        type: 'POST',
        success: function (data) {
            console.log(data);
            //var data = JSON.parse(data);
            $('#originalSRM').val(data.data.original);
            $('#segmentedSRM').val(data.data.segmented);
            $('#bordersSRM').val(data.data.borders);
            $('#segBordersSRM').val(data.data.seg_borders);
            $('#toast-success').html(data.success);
            $('.toast-success').toast('show');
            //setUploadImage(data.data.original);
            //setSRMImage(`public/uploads/${data.data.seg_borders}`);
            setCarousel([data.data.segmented, data.data.borders, data.data.seg_borders]);
        },
        error: function (error) {
            console.log(error);
            //var error = JSON.parse(error);
            $('#toast-error').html(data.error);
            $('.toast-danger').toast('show');
        },
        complete: function() {
            enableEditBox();
        }
    });
});

function setUploadImage(filename) {
    $('#box').fadeTo('slow', 0.3, function()
    {
        $(this).css('background-image', `url(${baseUrl}/${filename})`);
    }).fadeTo('slow', 1);
}

function setSRMImage(filename) {
    $('#srmBox').fadeTo('slow', 0.3, function()
    {
        $(this).css('background-image', `url(${baseUrl}/${filename})`);
    }).fadeTo('slow', 1);
}

function setCarousel(filenames) {
    var carouselIndicators = $('#carousel-indicators');
    var carouselImages = $('#carousel-inner');

    carouselIndicators.html("");
    carouselImages.html("");

    var i = 0;
    for(var file of filenames) {
        var indicator = "";
        if(i == 0) {
            indicator =`<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="active"></li>`;
        } else {
            indicator = `<li data-target="#carouselExampleIndicators" data-slide-to="${i}"></li>`;
        }
        carouselIndicators.append(indicator);

        var image = "";
        var now = Date.now();
        if(i == 0) {
            image = `<div class="carousel-item active"><img src="/${file}?dummy=${now}" alt="${i}"></div>`;
        } else {
            image = `<div class="carousel-item"><img src="/${file}?dummy=${now}" alt="${i}"></div>`;
        }
        carouselImages.append(image);
        i++;
    }
}

function resetCarousel() {
    var carouselIndicators = $('#carousel-indicators');
    var carouselImages = $('#carousel-inner');

    carouselIndicators.html('<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>');
    carouselImages.html('<div class="carousel-item active"><img src="/public/assets/img/placeholder.png" alt="0"></div>');
}

$(document).bind('keyup', function(e) {
    if(e.which == 39){
        $('.carousel').carousel('next');
    }
    else if(e.which == 37){
        $('.carousel').carousel('prev');
    }
});

$("#home-link").on('click', function () {
    if(!$('home-li').hasClass('active')) {
        $('#home-li').addClass('active');
        $('#about-li').removeClass('active');
        $('#about-body').fadeOut('slow', function() {
            $('#home-body').fadeIn();
        });
    }
});