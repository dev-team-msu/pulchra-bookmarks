function openSettings() {
    $('.app-container').css('margin-right', '370px').css('overflow-y', 'hidden')
    $('.settings.window').css('right', '0px')
    $('.settings.cancel-overlay').css('right', '370px')
    $('#settings-open-button').css('opacity', '0')
}

function closeSettings() {
    $('.app-container').css('margin-right', '0px').css('overflow-y', 'auto')
    $('.settings.window').css('right', '-500px')
    $('.settings.cancel-overlay').css('right', '5000px')
    $('#settings-open-button').css('opacity', '1')
}

$('#logo, #title').on('click', function (e) {
    e.stopPropagation()
    openLink('https://chrome.google.com/webstore/detail/pulchra-bookmarks/pknkgclggganidoalifaagfjikhcdolb')
})

$('#version').on('click', function (e) {
    e.stopPropagation()
    openLink('https://github.com/dev-team-msu/pulchra-bookmarks')
})

$('#range-rows').on('input', function (e) {
    let rows = parseInt(e.target.value)
    let cols = parseInt(document.getElementById('cols').innerText)
    document.getElementById('rows').innerText = rows.toString()
    chrome.storage.local.set({['rows']: rows}, () => {})
    makeGrid(cols, rows)
    setTimeout(() => {$('.empty-icon-bm').css('border','1px solid #fff')}, 20)
})

$('#range-cols').on('input', function (e) {
    let cols = parseInt(e.target.value)
    let rows = parseInt(document.getElementById('rows').innerText)
    document.getElementById('cols').innerText = cols.toString()
    chrome.storage.local.set({['cols']: cols}, () => {})
    makeGrid(cols, rows)
    setTimeout(() => {$('.empty-icon-bm').css('border','1px solid #fff')}, 20)
})

$('#close-settings-button, .cancel-overlay').on('click', function (e) {
    e.stopPropagation()
    closeSettings()
})

$('#new-tab').on('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    chrome.storage.local.get(['new-tab'], (res) => {
        if (res['new-tab']) {
            chrome.storage.local.set({['new-tab']: false}, () => {})
            setCheckbox('checkbox-new-tab', false)
        } else {
            chrome.storage.local.set({['new-tab']: true}, () => {})
            setCheckbox('checkbox-new-tab', true)
        }
    })
})

$('#show-quick').on('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    chrome.storage.local.get(['show-quick', 'cols'], function (res) {
        if (res['show-quick']) {
            chrome.storage.local.set({['show-quick']: false}, () => {})
            setCheckbox('checkbox-show-quick', false)
        } else {
            chrome.storage.local.set({['show-quick']: true}, () => {})
            setCheckbox('checkbox-show-quick', true)
        }
        updateBottomMenu(res['cols'])
    })
})

$('#show-header').on('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    chrome.storage.local.get(['show-header'], function (res) {
        if (res['show-header']) {
            chrome.storage.local.set({['show-header']: false}, () => {})
            setCheckbox('checkbox-show-header', false)
        } else {
            chrome.storage.local.set({['show-header']: true}, () => {})
            setCheckbox('checkbox-show-header', true)
        }
        updateHeaderMenu()
    })
})

$('#reload-icons').on('click', function (e) {
    e.stopPropagation()
    loadAllIcons()
})

$('.changegrid').hover(
    () => { // In hover
    $('.empty-icon-bm').css('border','1px solid #fff')},
    () => { // Out hover
    $('.empty-icon-bm').css('border','none')}
)