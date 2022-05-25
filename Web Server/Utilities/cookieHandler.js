exports.getUid = (cookie) => {
    uid = cookie.uid;
    if (uid == null) {
        uid = '-1';
    }
    return parseInt(uid);
};
