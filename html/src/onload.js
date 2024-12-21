window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const pn = params.get('playerName');
    const MatchID = params.get('matchid');

    if (MatchID) {
        document.getElementById('matchId').value = MatchID;
        const button = document.getElementById('fetchbutton');
        button.click();
    }

    const hash = decodeURIComponent(window.location.hash);

    const decodedName = decodeURIComponent(pn);

    const fullName = decodedName ? decodedName + hash : '';

    if (pn) {
        document.getElementById('playerId').value = fullName;
        const button = document.getElementById('fetchbutton');
        button.click();
    }
};