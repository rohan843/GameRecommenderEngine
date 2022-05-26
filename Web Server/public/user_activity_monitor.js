let userActions = [];

const getUserAction = (actionType, uid, optns) => {
    if (actionType === 'genre') {
        return {
            type: 'genre',
            uid: parseInt(uid),
            genre_ids: optns.genre_ids
        }
    } else if (actionType === 'game') {
        if (optns.actionSubType === 'pagevisit') {
            return {
                type: 'game',
                sub_type: 'pagevisit',
                uid: parseInt(uid),
                game_id: optns.game_id
            }
        } else if (optns.actionSubType === 'purchase') {
            return {
                type: 'game',
                sub_type: 'purchase',
                uid: parseInt(uid),
                game_id: optns.game_id
            }
        } else if (optns.actionSubType === 'rating') {
            return {
                type: 'game',
                sub_type: 'rating',
                uid: parseInt(uid),
                game_id: optns.game_id,
                rating: optns.rating
            }
        }
    }
};

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// ---- Genre Page Visit ----
if (window.location.pathname === '/search' && regexGenreListCheck.test(params['genres'].trim())) {
    setTimeout(() => {
        const genre_ids = [];
        for (let id of params['genres'].trim().split(',')) {
            genre_ids.push(parseInt(id));
        }
        userActions.push(getUserAction('genre', uidCookie, {
            genre_ids: genre_ids
        }));
    }, pageVisitTime);
}

// ---- Game Page Visit ----
if (window.location.pathname === '/store-product') {
    setTimeout(() => {
        const game_id = parseInt(params['game_id']);
        if ((game_id === 0 || game_id) && (game_id >= 0)) {
            userActions.push(getUserAction('game', uidCookie, {
                actionSubType: 'pagevisit',
                game_id: game_id
            }));
        }
    }, pageVisitTime);
}

// ---- Game Purchase ----
const allBuyBtns = document.querySelectorAll('.hidden_buy_class');
for (let buyBtn of allBuyBtns) {
    buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const tar = e.target;
        const game_id = parseInt(tar.attributes.game_id.value);
        if ((game_id === 0 || game_id) && (game_id >= 0)) {
            userActions.push(getUserAction('game', uidCookie, {
                actionSubType: 'purchase',
                game_id: game_id
            }));
        }
        showToast('Bought!');
    });
}

// ---- Game Rating ----
if (window.location.pathname === '/store-product') {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const game_id = parseInt(params['game_id']);
        const rating = parseInt(reviewForm['review-rate'].value);
        if (rating && (game_id === 0 || game_id) && (game_id >= 0)) {
            userActions.push(getUserAction('game', uidCookie, {
                actionSubType: 'rating',
                game_id: game_id,
                rating: rating
            }));
        }
        showToast('Review Taken!');
    });
}

if (uidCookie != -1) {
    document.addEventListener(
        'visibilitychange',
        () => {
            if (document.visibilityState === 'hidden' && userActions.length > 0) {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        body: JSON.stringify(userActions),
                    },
                    body: JSON.stringify(userActions),
                    keepalive: true
                };
                fetch('/activity-monitor', options);
                userActions = [];
            }
        }
    );
}