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
    DESCRIPTION = (await import ('../out/html/sidebar.js')).default
    fillMenu ()
    showPage (Object.keys (DESCRIPTION)[0])
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


document.addEventListener('DOMContentLoaded', async () =>
{
    var elem = document.getElementById ('sidebar-main-buttun')
    elem.onclick = openSidebar
    var elem = document.getElementById ('sidebar-close-buttun')
    elem.onclick = closeSidebar
    var elem = document.getElementById ('sidebar-overlay')
    elem.onclick = closeSidebar
})

function openSidebar ()
{
    document.getElementById("sidebar").style.display = "block";
    document.getElementById("sidebar-overlay").style.display = "block";
}

function closeSidebar ()
{
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("sidebar-overlay").style.display = "none";
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
    const sidemenu = document.getElementById ('sidemenu')

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

        var container = document.getElementById ('page-content')
        container.innerHTML = await rep.text ()
        
        CURRENT_PAGE = title
        highlight ()
        fillCodeBlocks ()
    }

    if (id)
        document.getElementById(id).scrollIntoView ({behavior: "smooth"})
}

//------------------------------------------------------------------------------
// Code Blocks
//------------------------------------------------------------------------------

function highlight ()
{
    globalThis.Prism.highlightAll ()
    // document.getElementById ('page-content')
}


function fillCodeBlocks ()
{
    for (var codeBlock of document.querySelector ('.main').querySelectorAll ('code'))
    {
        if (codeBlock.classList.contains ('language-js') === false) continue
        appendTryButton (codeBlock)
    }
}

/**
 * @param {HTMLElement} codeBlock 
 * @returns 
 */
function appendTryButton (codeBlock)
{
    const view = document.createElement ('div')
    const elem = document.createElement ('button')
    elem.textContent = 'Try'
    elem.onclick = evalCodeHandle (codeBlock.textContent, view)
    codeBlock.insertAdjacentElement ("afterend", view)
    codeBlock.insertAdjacentElement ("afterend", elem)
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


