$("#about-link").on('click', function () {
    if (!$('about-li').hasClass('active')) {
        $('#about-li').addClass('active');
        $('#home-li').removeClass('active');
        $('#home-body').fadeOut('slow', function() {
            $('#about-body').fadeIn();
        });
    }
});