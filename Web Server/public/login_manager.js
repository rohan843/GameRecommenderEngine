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

const loginForm = document.getElementById('login');
const logoutLink = document.getElementById('logout');
const uid = document.getElementById('uid');
const signinCloseBtn = document.getElementById('signinCloseBtn');
const signinHead = document.getElementById('signinHead');
const maxUID = parseInt(document.getElementById('maxUID').value);
const minUID = parseInt(document.getElementById('minUID').value);
const newUserEntry = document.getElementById('newUserDemo');
const resetNewUser = document.getElementById('resetNewUser');


uid.value = '';
let uidCookie = getCookie('uid');

if (uidCookie == null || uidCookie == -1) {
    setCookie('uid', -1);
    showToast('Please login to view personalized recommendations.', 3000);
} else if (uidCookie == -2) {
    signinHead.innerHTML = `<span class="text-main-1">New User</span> Logged In`;
    newUserEntry.innerText = `Exit demo mode`;
    resetNewUser.style.display = 'block';
} else {
    signinHead.innerHTML = `<span class="text-main-1">User ${uidCookie}</span> Logged In`;
}
uidCookie = getCookie('uid');

signinCloseBtn.addEventListener('click', (e) => {
    uid.value = '';
})

loginForm.addEventListener('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
        id = parseInt(uid.value);
        // uid.value = '';
    } catch (error) {
        showToast(`Please enter valid UID between ${minUID} and ${maxUID}, inclusive.`);
    }
    if (id >= minUID && id <= maxUID) {
        setCookie('uid', id);
        showToast(`Successfully signed in as User ${id}.`);
        location.reload();
        signinHead.innerHTML = `<span class="text-main-1">User ${getCookie('uid')}</span> Logged In`;
        newUserEntry.innerText = `Enter new user demo mode`;
        resetNewUser.style.display = 'none';
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
        location.reload();
        newUserEntry.innerText = `Enter new user demo mode`;
        resetNewUser.style.display = 'none';
        signinHead.innerHTML = `<span class="text-main-1">Sign</span> In`;
    }
});

newUserEntry.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    uid.value = '';
    if (getCookie('uid') == -2) {
        showToast('Exiting new user mode.');
        location.reload();
        setCookie('uid', -1);
        signinHead.innerHTML = `<span class="text-main-1">Sign</span> In`;
        newUserEntry.innerText = `Enter new user demo mode`;
        resetNewUser.style.display = 'none';
    } else {
        setCookie('uid', -2);
        newUserEntry.innerText = `Exit demo mode`;
        signinHead.innerHTML = `<span class="text-main-1">New User</span> Logged In`;
        showToast('Successfully entered new user mode.');
        location.reload();
        resetNewUser.style.display = 'block';
        alert("You have entered a new user demo mode. This mode is intended to demonstrate how the recommender adapts to the behaviour of a newly signed up user. It is assumed that while signing up, this user chose ADVENTURE, CASUAL, and RPG as the favourite genres. Based on this and on the user's activity, the system will provide recommendations. To reset the data for this user, and to restart the demo afresh, please press the reset new user data link thet would have appeared in the login modal when you entered the new user mode.");
    }
});

resetNewUser.addEventListener('click', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(await postData('http://localhost:4000/new_user_refresh'));
    showToast('New User refreshed.');
    location.reload();
});
