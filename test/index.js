/// <reference types="prismjs" />
//@ts-check

/**
    @typedef {import ('../out/html/sidebar.js')['default']} SidebarJS
    @typedef {Record <
        string,
        SidebarJS[keyof SidebarJS]
    >} Description
*/


/** @type {Description} */
var DESCRIPTION = null

var CURRENT_PAGE = ''

/** @type {Record <string, Element>} */
var MENU_GROUPS = {}

document.addEventListener('DOMContentLoaded', async () =>
{
    CURRENT_PAGE = null
    DESCRIPTION = (await import ('../out/html/sidebar.js')).default
    fillMenu ()
    const page = localStorage.getItem ('CURRENT_PAGE')
    if (page) {
        showPage (page).then (() => {
            window.scroll (0, parseInt (localStorage.getItem ('CURRENT_SCROLL')))
        })
    } else {
        showPage (Object.keys (DESCRIPTION)[0])
    }
})

// Accordion
/** @param {Element} elem */
function expandMenuGroup (elem)
{
    if (elem.classList.contains ("show"))
        elem.classList.remove ("show")
    else
        elem.classList.add ("show")
}


//------------------------------------------------------------------------------
// Sidebar
//------------------------------------------------------------------------------


/** @type {Document["querySelector"]} */
const $ = (selector) => document.querySelector (selector)

/** @type {Document["querySelectorAll"]} */
const $$ = (selector) => document.querySelectorAll (selector)

/** @type {Document["getElementById"]} */
const $id = (id) => document.getElementById (id)


//------------------------------------------------------------------------------
// Sidebar
//------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', async () =>
{
    $id ('sidebar-main-buttun').onclick = openSidebar
    // $id ('sidebar-close-buttun').onclick = closeSidebar
    $id ('sidebar-overlay').onclick = closeSidebar
})

function openSidebar ()
{
    $id ("sidebar").style.display = "block";
    $id ("sidebar-overlay").style.display = "block";
}

function closeSidebar ()
{
    $id ("sidebar").style.display = "none";
    $id ("sidebar-overlay").style.display = "none";
}


/** @param {string} pageTitle */
function menuHeader (pageTitle)
{
    const elem = document.createElement ('div')
    elem.className = 'button block white left-align'
    elem.onclick = () => expandMenuGroup (elem.nextElementSibling)
    elem.textContent = pageTitle
    return elem
}

/**
 * @param {Element[]} items
 */
function menuGroup (items)
{
    const elem = document.createElement ('div')
    elem.className = 'bar-block hide padding-large medium menu-group'
    elem.append (...items)
    return elem
}

/**
 * @param {string} pageTitle
 * @param {string} headingTitle
 * */
function menuButton (pageTitle, headingTitle)
{
    const elem = document.createElement ('div')
    elem.className = 'bar-item button menu-button-item'
    elem.textContent = headingTitle
    elem.onclick = () => { showPage (pageTitle, headingTitle) }
    return elem
}

function fillMenu ()
{
    const sidemenu = $id ('sidemenu')

    for (var title in DESCRIPTION) {
        sidemenu.append (
            menuHeader (title),
            MENU_GROUPS[title] = menuGroup (DESCRIPTION[title].ids.map (
                id => menuButton (title, id)
            ))
        )
    }
}


//------------------------------------------------------------------------------
// Pages
//------------------------------------------------------------------------------


window.addEventListener ('scroll', () =>
{
    localStorage.setItem ('CURRENT_SCROLL', ''+window.scrollY)

    if (window.scrollY > 80) {
        $id ('header').classList.add ('small')
    } else {
        $id ('header').classList.remove ('small')
    }
})

/**
 * @param {string} title 
 * @param {string} [id] 
 */
async function showPage (title, id)
{
    if (CURRENT_PAGE !== title)
    {
        const rep = await fetch (DESCRIPTION[title].url)
        if (rep.ok === false) return

        var container = $id ('page-content')
        container.innerHTML = await rep.text ()
        
        CURRENT_PAGE = title
        localStorage.setItem ('CURRENT_PAGE', title)
        document.querySelector ('#header > h1').textContent = title
        applyStyles ()
        fillCodeBlocks ()
    }

    if (id) {
        $id(id).scrollIntoView ({behavior: "smooth"})
    }

    closeSidebar ()
}

function applyStyles ()
{
    for (var elem of document.querySelectorAll ('[data-zlevel="1"]')) {
        elem.classList.add ('container', 'card-4', 'margin', 'white')
    }

    for (var elem of document.querySelectorAll ('[data-zlevel="2"] > ul')) {
        elem.classList.add ('list-table')
    }

    globalThis.Prism.highlightAll ()
    
    // for (var elem of document.querySelectorAll ('.list-table li > code')) {
    //     elem.classList.add ('language-js')
    //     globalThis.Prism.highlightElement (elem)
    // }
}



//------------------------------------------------------------------------------
// Code Blocks
//------------------------------------------------------------------------------


function fillCodeBlocks ()
{
    for (var codeBlock of document.querySelector ('.main').querySelectorAll ('pre > code'))
    {
        if (codeBlock.classList.contains ('language-js') === false) continue
        appendTryButton (codeBlock)
    }
}

/**
 * @param {Element} codeBlock 
 * @returns 
 */
function appendTryButton (codeBlock)
{
    const view = document.createElement ('div')
    const btn  = document.createElement ('button')
    btn.textContent = 'Try'
    btn.classList.add ('button', 'small', 'border')
    btn.style.marginTop = '10px'
    btn.onclick = evalCodeHandle (codeBlock.textContent, view)
    codeBlock.insertAdjacentElement ("afterend", view)
    codeBlock.insertAdjacentElement ("afterend", btn)
}

const evalCodeHandle = (code, target) => async () =>
{
    var result

    try {
        result = await eval (code)
    } catch (error) {
        target.textContent = error instanceof Error
            ? ''+error
            : JSON.stringify (error, null, 2)
        return
    }

    if (!result) {
        target.textContent = result
        return
    }
    target.textContent = typeof result === 'object'
        ? JSON.stringify (result, null, 2)
        : result
}


