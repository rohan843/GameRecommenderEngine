function setCookie(cname, cvalue, exdays = 1000) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function showToast(msg, time = 3000) {
    // Get the snackbar DIV
    const x = document.getElementById("snackbar");
    x.innerText = msg;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, time);
}

loginForm = document.getElementById('login');
logoutLink = document.getElementById('logout');
uid = document.getElementById('uid');
signinCloseBtn = document.getElementById('signinCloseBtn');
signinHead = document.getElementById('signinHead');
maxUID = parseInt(document.getElementById('maxUID').value);
minUID = parseInt(document.getElementById('minUID').value);

uid.value = '';

if (getCookie('uid') == null || getCookie('uid') == -1) {
    setCookie('uid', -1);
    showToast('Please login to view personalized recommendations.', 3000);
} else {
    signinHead.innerHTML = `<span class="text-main-1">User ${getCookie('uid')}</span> Logged In`;
}

signinCloseBtn.addEventListener('click', (e) => {
    uid.value = '';
})

loginForm.addEventListener('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('here');
    try {
        id = parseInt(uid.value);
        // uid.value = '';
    } catch (error) {
        showToast(`Please enter valid UID between ${minUID} and ${maxUID}, inclusive.`);
    }
    if (id >= minUID && id <= maxUID) {
        setCookie('uid', id);
        showToast(`Successfully signed in as User ${id}.`);
        signinHead.innerHTML = `<span class="text-main-1">User ${getCookie('uid')}</span> Logged In`;
    }
    else
        showToast(`Please enter valid UID between ${minUID} and ${maxUID}, inclusive.`);
});

logoutLink.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    uid.value = '';
    if (getCookie('uid') == null || getCookie('uid') == -1) {
        showToast('Already logged out.');
    } else {
        setCookie('uid', -1);
        showToast('Successfully logged out.');
        signinHead.innerHTML = `<span class="text-main-1">Sign</span> In`;
    }
});
