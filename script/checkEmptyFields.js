define(function () {
    return function (event) {
        if (!$(':input[required]:text').val() || !$(':input[required]:password').val()) {
            if (event !== null && event !== undefined) {
                event.preventDefault(); //отменить действие браузера
                $('.invalid').text('Не заполнены все поля');
            }
            return false;
        }
    }
});
