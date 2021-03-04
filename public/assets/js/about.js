$("#about-link").on('click', function () {
    if (!$('about-li').hasClass('active')) {
        $('#about-li').addClass('active');
        $('#home-li').removeClass('active');
        $('#about-body').fadeIn();
        $('#home-body').fadeOut();
    }
});