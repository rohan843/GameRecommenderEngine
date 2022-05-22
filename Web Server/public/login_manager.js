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

function showToast(msg) {
    // Get the snackbar DIV
    const x = document.getElementById("snackbar");
    x.innerText = msg;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

if (getCookie('uid') == null || getCookie('uid') == -1) {
    setCookie('uid', -1);
    showToast('Please login for viewing personalized recommendations')
} else {
    showToast(`Welcome user ${getCookie('uid')}`)
}

loginForm = document.getElementById('login');
uid = document.getElementById('uid');
maxUID = parseInt(document.getElementById('maxUID').value);
minUID = parseInt(document.getElementById('minUID').value);

loginForm.addEventListener('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
        id = parseInt(uid.value);
    } catch (error) {
        showToast(`Enter valid UID between ${minUID} and ${maxUID}, inclusive.`);
    }
    if (id >= minUID && id <= maxUID) {
        setCookie('uid', id);
        showToast(`successfully signed in as User ${id}`)
    }
    else
        showToast(`Enter valid UID between ${minUID} and ${maxUID}, inclusive.`);
});
