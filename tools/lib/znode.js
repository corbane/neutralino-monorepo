// @ts-check


//------------------------------------------------------------------------------
// Hast
//------------------------------------------------------------------------------


import { h as H } from 'hastscript'
import { toString } from 'mdast-util-to-string'

/**
 *  @typedef {import ('hast').ElementContent} HastElementContent
 *  @typedef {import ('hast').Element} HastElement
 *  @typedef {import ('hast').Root} HastRoot
 *  @typedef {import ('hast').Parent} HastParent
 */

/**
 * @param {HastElement} root 
 * @param {(el: HastElement) => number} getLevel 
 */
export function HastToZTree (root, getLevel = null)
{
    const htags = ["h1", "h2", "h3", "h4", "h5", "h6"]

    if (typeof getLevel != "function") {
        getLevel = (el) => {
            const idx = htags.indexOf (el.tagName)
            return idx == -1 ? null : idx + 1
        }
    }
    
    /** @type {ZNode <HastElementContent>} */
    var zroot   = new ZNode (root)
    var zparent = zroot
    var index   = 0
    var child   = root.children[index++]

    while (child)
    {
        if (child.type !== 'element' || htags.includes (child.tagName) === false)
        {
            zparent.append (child)
            child = root.children[index++]
            continue
        }

        var level = getLevel (child)

        if( Number.isFinite (level) === false || level < 0 )
        {
            zparent.append (child)
        }
        else
        {
            if (level < zparent.level + 1)
            {
                while (zparent != null && zparent.level + 1 != level)
                    zparent = zparent.parent
            }

            var zchild = new ZNode (child, zparent)
            zparent.append (zchild)
            zparent = zchild
        }

        child = root.children[index++]
    }
    
    return zroot
}


/**
 * @param {ZNode <HastElementContent>} znode
 */
export function zhastToHast (znode)
{
    if (znode.parent == null)
    {
        return H (null, znode.element, znode.children.map (
            c => c instanceof ZNode ? zhastToHast (c) : c
        )) 
    }

    /** @type {HastElementContent[]} */
    const children = new Array (znode.children.length)
    var i = 0

    for (var child of znode.children) {
        children[i++] = child instanceof ZNode ? zhastToHast (child) : child
    }

    // TODO must be better
    const id = toString (znode.element).replace (/[ "`']/g, '')

    return H ('section', { 'data-zlevel': znode.level }, [
        H ('header', { id }, znode.element),
        H ('section', { 'data-sectionof': id }, children),
    ])
}


//------------------------------------------------------------------------------
// ZTree
//------------------------------------------------------------------------------


/**
    @typedef {import ('mdast').Content} MdastContent
    @typedef {import ('mdast').Parent} MdastParent
    @typedef {import ('mdast').Heading} MdastHeading
*/

/**
 * @param {Node} root 
 * @param {(el: Node) => number} getLevel 
 * @typedef {{ children?: Node[], type?: string }} Node
 */
 export function toZTree (root, getLevel)
 {
    var zroot   = new ZNode (root)
    var zparent = zroot
    var index   = 0
    var child   = root.children[index++]

    while (child)
    {
        const level = getLevel (child)

        if( Number.isFinite (level) === false || level < 0 )
        {
            zparent.append (child)
        }
        else
        {
            if (level < zparent.level + 1)
            {
                while (zparent != null && zparent.level + 1 != level)
                    zparent = zparent.parent
            }

            var zchild = new ZNode (child, zparent)
            zparent.append (zchild)
            zparent = zchild
        }

        child = root.children[index++]
    }

    return zroot
 }
 

var _last_id = 0
function newId () {
    _last_id++
    return _last_id.toString ()
}

/**
 * @template {any} T
 */
export class ZNode
{
    /** @type {ZNode} */
    parent

    /** @type {string} */
    id
    /** @type {number} */
    level
    /** @type {T} */
    element
    /** @type {(T|ZNode)[]} */
    children

    /**
     * @param {T} element 
     * @param {ZNode} parent 
     */
    constructor (element, parent = null)
    {
        this.element  = element
        this.parent   = parent
        this.level    = parent == null ? 0 : parent.level + 1
        this.id       = newId ()
        this.children = []
    }

    /**
     * @param {T|ZNode} node 
     */
    append (node) { this.children.push (node) }
}
