define(function(){
    return function() {
        let authSection = document.getElementById('auth-section');
        authSection.innerHTML =
            '<ul id="auth">' +
            '<li><a href="/signup" onclick="return makeSignUpSectionVisible()">Регистрация </a></li>' +
            '<li><a href="/login" onclick="return makeLogInSectionVisible()">Вход</a></li>' +
            '</ul>';
        $('.invalid:visible').fadeOut(3000);
        return false;
    }
});
