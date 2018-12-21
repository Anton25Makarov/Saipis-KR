function makeSignUpSectionVisible() {
    let authSection = document.getElementById('auth-section');
    authSection.innerHTML = '';

    let form = document.createElement('form');
    form.id = 'signup';
    form.action = '/signup';
    form.method = 'post';
    form.classList.add('visible-form');

    let loginDiv = document.createElement('div');
    loginDiv.classList.add('field');
    let passwordDiv = document.createElement('div');
    passwordDiv.classList.add('field');

    let loginLabel = document.createElement('label');
    loginLabel.for = 'username';
    loginLabel.innerHTML = 'Логин: ';
    let loginInput = document.createElement('input');
    loginInput.type = 'text';
    loginInput.id = 'username';
    loginInput.name = 'username';
    loginInput.required = true;
    loginInput.onfocus = function () {
        loginInput.style.borderColor = '#FFFF00';
    };
    loginInput.onblur = function () { // фокус "исчезает"
        loginInput.style.borderColor = 'transparent'; // прозрачный фон
    };
    loginDiv.appendChild(loginLabel);
    loginDiv.appendChild(loginInput);
    let passwordLabel = document.createElement('label');
    passwordLabel.for = 'password';
    passwordLabel.innerHTML = 'Пароль: ';
    let passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;
    passwordInput.onfocus = function () {
        passwordInput.style.borderColor = '#FFFF00';
    };
    passwordInput.onblur = function () {
        passwordInput.style.borderColor = 'transparent';
    };
    passwordDiv.appendChild(passwordLabel);
    passwordDiv.appendChild(passwordInput);
    let cancelButton = document.createElement('button');
    cancelButton.onclick = function () {
        require(['makeAuthSectionClear', 'jquery'], function (makeAuthSectionClear, $) {
            makeAuthSectionClear();
        });
        return false;
    };
    cancelButton.innerHTML = 'Отмена';
    let signUpButton = document.createElement('input');
    signUpButton.type = 'submit';
    signUpButton.value = 'Зарегистрироваться';

    form.appendChild(loginDiv);
    form.appendChild(passwordDiv);
    form.appendChild(cancelButton);
    form.appendChild(signUpButton);

    authSection.insertBefore(form, authSection.firstChild);

/*    form.addEventListener('submit',
        require(['checkEmptyFields', 'jquery'], function (checkEmptyFields, $) {
            checkEmptyFields();
        }));*/

    return false;
}

function makeLogInSectionVisible() {
    let authSection = document.getElementById('auth-section');
    authSection.innerHTML = '';

    let form = document.createElement('form');
    form.id = 'login';
    form.action = '/login';
    form.method = 'post';
    form.classList.add('visible-form');

    let loginDiv = document.createElement('div');
    loginDiv.classList.add('field');
    let passwordDiv = document.createElement('div');
    passwordDiv.classList.add('field');

    let loginLabel = document.createElement('label');
    loginLabel.for = 'username';
    loginLabel.innerHTML = 'Логин: ';
    let loginInput = document.createElement('input');
    loginInput.type = 'text';
    loginInput.id = 'username';
    loginInput.name = 'username';
    loginInput.required = true;
    loginInput.onfocus = function () {
        loginInput.style.borderColor = '#FFFF00';
    };
    loginInput.onblur = function () {
        loginInput.style.borderColor = 'transparent';
    };
    loginDiv.appendChild(loginLabel);
    loginDiv.appendChild(loginInput);
    let passwordLabel = document.createElement('label');
    passwordLabel.for = 'password';
    passwordLabel.innerHTML = 'Пароль: ';
    let passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;
    passwordInput.onfocus = function () {
        passwordInput.style.borderColor = '#FFFF00';
    };
    passwordInput.onblur = function () {
        passwordInput.style.borderColor = 'transparent';
    };
    passwordDiv.appendChild(passwordLabel);
    passwordDiv.appendChild(passwordInput);
    let cancelButton = document.createElement('button');
    cancelButton.onclick = function () {
        require(['makeAuthSectionClear', 'jquery'], function (makeAuthSectionClear, $) {
            makeAuthSectionClear();
        });
        return false;
    };
    cancelButton.innerHTML = 'Отмена';
    let signUpButton = document.createElement('input');
    signUpButton.type = 'submit';
    signUpButton.value = 'Войти';

    form.appendChild(loginDiv);
    form.appendChild(passwordDiv);
    form.appendChild(cancelButton);
    form.appendChild(signUpButton);

    authSection.insertBefore(form, authSection.firstChild);

/*    form.addEventListener('submit',
        require(['checkEmptyFields', 'jquery'], function (checkEmptyFields, $) {
            checkEmptyFields();
        }));*/

    return false;
}

function checkCookies() {
    if (navigator.cookieEnabled === false) {
        document.getElementById("error").innerHTML = "Cookies are enabled, please turn them on";
    }
}

$('html').bind('keyup', function (e) {
    if (e.keyCode === 27) {
        require(['makeAuthSectionClear', 'jquery'], function (makeAuthSectionClear, $) {
            makeAuthSectionClear();
        });
        return false;
    }
});

$('html').bind('mousedown', function () {
    $('.error:visible').filter(':parent').fadeOut(3000); // :parent - непоустые элементы, :visible - идимые эл страницы
});

function readJSON() {
    if ($("#history-table").css('display') === "block") {
        $("#history-table").css({display: "none"});
        $("tbody tr").remove();
        $("#history-button").text('Показать лучшие команды');
        return false;
    }
    $.getJSON("../resources/data/data.json")
        .done(function (json) { //success (fail | always)
            require(['mustache', 'jquery'], function (mustache, $) {
                let templ =
                    '<tr>' +
                    '   <td>{{team}}</td>' +
                    '   <td>{{win}}</td>' +
                    '   <td>{{lastYear}}</td>' +
                    '</tr>';
                for (let i = 0; i < json.team.length; i++) {
                    let data = {
                        team: json.team[i].name,
                        win: json.team[i].win,
                        lastYear: json.team[i].lastYear
                    };
                    let h = mustache.to_html(templ, data);
                    $("#table-cont").append(h);
                    $("#history-table").css({display: "block"});
                    $("#history-button").text(' Скрыть лучшие команды  ');
                }
            });
        });
}


$(function () { // like document on ready
    $('.dropdown-toggle').click(function () {
        $(this).next('.dropdown').slideToggle();
    });

    $(document).click(function (e) {
        let target = e.target;
        if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
            $('.dropdown').hide();
        }
    });
});


$(document).ready(function () {
    $('.masterTooltip').hover(function () {
        let title = $(this).attr('title');
        $(this).data('tipText', title).removeAttr('title');
        $('<p class="tooltip"></p>')
            .text(title)
            .appendTo('body')
            .fadeIn('slow');
    }, function () {
        $(this).attr('title', $(this).data('tipText'));
        $('.tooltip').remove();
    }).mousemove(function (e) {
        let mousex = e.pageX + 20;
        let mousey = e.pageY + 10;
        $('.tooltip')
            .css({top: mousey, left: mousex})
    });
});