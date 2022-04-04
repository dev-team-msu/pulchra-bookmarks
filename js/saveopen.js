// noinspection JSJQueryEfficiency
function getPureJSON(json){
    for (let r = 0; r < json['rows']; r++) {
        for (let c = 0; c < json['cols']; c++) {
            let id = r.toString() + c.toString()
            delete json[id][0]['cache-icon']
        }
    }
    for (let r = json['rows']; r < 10; r++) {
        for (let c = 0; c <  10; c++) {
            let id = r.toString() + c.toString()
            delete json[id]
        }
    }
    for (let r = 0; r < 10; r++) {
        for (let c = json['cols']; c < 10; c++) {
            let id = r.toString() + c.toString()
            delete json[id]
        }
    }
    $.getJSON('manifest.json', function (res) {
        json['version'] = res['version']
    })
    return json
}

function setJsonToLocalStorage(json) {
    chrome.storage.local.get(['background'], function (val) {
        chrome.storage.local.clear(() => {
            chrome.storage.local.set(json, () => {
                if (varDefined(val['background'])){
                    chrome.storage.local.set({'background':val['background']}, () => {
                        initSettingsValues(true)
                        setTimeout(loadAllIcons, 200)
                    })
                }
                else {
                    initSettingsValues(true)
                    setTimeout(loadAllIcons, 200)
                }
            })
        })
    })
}


function saveToFile() {
    chrome.storage.local.get(null, (res) => {
        let now = new Date()
        let now_str = now.toLocaleDateString("ru-RU")
        let json = getPureJSON(res)
        delete json['background']
        $('<a></a>', {
            'download': 'pulchra-' + now_str + '.json',
            'href': 'data:application/json,' + encodeURIComponent(JSON.stringify(json, null, '\t'))
        }).appendTo('body').click(() => {
            $(this).remove()
        })[0].click()
        console.log('Save bookmarks to file')
    })
}

function loadFromFile() {
    try {
        let files = document.getElementById('upload_bookmarks').files[0]
        let fileReader = new FileReader()
        fileReader.readAsDataURL(files)
        fileReader.onload = () => {
            try {
                console.log(fileReader.result.substring(29))
                const cjson = JSON.parse(b64DecodeUnicode(fileReader.result.substring(29)))
                let json = getPureJSON(cjson)
                setJsonToLocalStorage(json)
                console.log('Load bookmarks from file')
            } catch (e) {
                alert('Broken file!\n' + e.toString())
            }
        }
    } catch (e) {
        if (e instanceof TypeError) {
        } else {
            console.log(e)
        }
    }
}

function loadBackground() {
    try {
        let fileReader = new FileReader()
        let files = document.getElementById('upload_background').files[0]
        fileReader.readAsDataURL(files)
        fileReader.onload = () => {
            try {
                fileReader.result
                chrome.storage.local.set({'background':fileReader.result}, () => {})
                $('body').css('background-image', 'url('+fileReader.result+')')
            } catch (e) {
                alert('Broken file!\n' + e.toString())
            }
        }
    } catch (e) {
        if (e instanceof TypeError) {
        } else {
            console.log(e)
        }
    }
}

function saveToCloud() {
    chrome.storage.local.get(null, (res) => {
        let json = getPureJSON(res)
        delete json['background']
        chrome.storage.sync.set(json, () => {
            console.log('Save bookmarks in cloud')
            let save_icon = document.getElementById('cloud-save-icon')
            let old_icon = save_icon.children[0]
            let done_icon = document.createElement('div')
            done_icon.className = 'CheckMark'
            save_icon.replaceChildren(done_icon)
            setTimeout(function () {
                save_icon.replaceChildren(old_icon)
            }, 1000)
        })
    })
}

function loadFromCloud() {
    chrome.storage.sync.get(null, (res) => {
        let json = getPureJSON(res)
        if (varDefined(json['rows'])) {
            console.log('Load bookmarks from cloud')
            setJsonToLocalStorage(json)
            let load_icon = document.getElementById('cloud-load-icon')
            let old_icon = load_icon.children[0]
            let done_icon = document.createElement('div')
            done_icon.className = 'CheckMark'
            load_icon.replaceChildren(done_icon)
            setTimeout(function () {
                load_icon.replaceChildren(old_icon)
            }, 1000)
        } else {
            alert('Cloud hasn\'t any data')
        }
    })
}

$('#save-to-file').on('click', function (e) {
    e.stopPropagation()
    saveToFile()
})

$('#upload_bookmarks').on('change', function (e) {
    e.stopPropagation()
    loadFromFile()
})

$('#upload_background').on('change', function (e) {
    e.stopPropagation()
    loadBackground()
})

$('#save-to-cloud').on('click', function (e) {
    e.stopPropagation()
    saveToCloud()
})

$('#load-from-cloud').on('click', function (e) {
    e.stopPropagation()
    loadFromCloud()
})