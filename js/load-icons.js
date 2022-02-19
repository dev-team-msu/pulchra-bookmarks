function loadAllIcons() {
    chrome.storage.local.get(['cols', 'rows'], function (res) {
        let cols = res['cols']
        let rows = res['rows']
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let id = r.toString() + c.toString()
                loadIcon(id)
            }
        }
    })
}

function loadIcon(id) {
    try {
        let link = document.getElementById(id).getAttribute('link')
        let google_img = new Image()
        if (varDefined(link)) {
            $('#' + id).css("background-color", "rgba(255, 255, 255)").css("cursor", "pointer")
            let fav_link = getOpenLink(getDomain(link)) + '/favicon.ico'
            google_img.src = 'https://s2.googleusercontent.com/s2/favicons?domain=' + getOpenLink(link) + '&sz=128'
            google_img.onload = () => waitToLoadFavicon(google_img, fav_link, id, true)
            google_img.onerror = () => waitToLoadFavicon(google_img, fav_link, id, false)
        } else {
            if (document.getElementById('icon-' + id)) {
                document.getElementById('icon-' + id).remove()
            }
        }
    } catch (e) {
    }
}

function waitToLoadFavicon(google_img, fav_link, id, loaded1) {
    let fav_img = new Image()
    fav_img.src = fav_link
    fav_img.onload = () => remakeIcon(google_img, fav_img, id, loaded1, true)
    fav_img.onerror = () => remakeIcon(google_img, fav_img, id, loaded1, false)
}


function remakeIcon(google_img, fav_img, id, loaded1, loaded2) {
    let imgOld = document.getElementById('icon-' + id)
    if (imgOld === null) { // When remake grid so fast
        return
    }
    if (loaded1 && loaded2) {
        if (google_img.naturalWidth >= fav_img.naturalWidth) {
            imgOld.src = google_img.src
        } else {
            imgOld.src = fav_img.src
        }
    } else if (loaded1) {
        if (google_img.naturalWidth !== 16) {
            imgOld.src = google_img.src
        } else {
            imgOld.src = '../images/icons/language.svg'
        }
    } else if (loaded2) {
        imgOld.src = fav_img.src
    } else {
        imgOld.src = '../images/icons/language.svg'
    }
}