
//@ts-check

//------------------------------------------------------------------------------
// String utilities
//------------------------------------------------------------------------------

/**
 * @param {string[]} lines 
 * @param {number} tabSize
 */
export function trimIndents (lines, tabSize = 2)
{
    /** @param {string} chars */
    const indentLength = (chars) =>
    {
        var n = 0
        for (var c = 0; c < chars.length; c++)
        {
            switch (chars.charCodeAt (c))
            {
            case 9: /*\t*/
                n += tabSize
                break
            case 32: /*' '*/
                n++
                break
            default:
                return n
            }
        }
    }

    /** @param {string} chars @param {number} indent */
    const unindent = (chars, indent) =>
    {
        var n = 0
        for (var c = 0; c < chars.length; c++)
        {
            switch (chars.charCodeAt (c))
            {
            case 9: /*\t*/
                n += tabSize
                break
            case 32: /*' '*/
                n++
                break
            default:
                return chars.substring (n)
            }

            if (n === indent)
                return chars.substring (n)
        }
        return chars
    }

    const count = lines.length
    var indent = 0

    // get the indent of the first non-empty line
    for (var l = 0; l < count; l++)
    {
        var chars = lines[l].trimStart ()
        if (chars == '') continue

        indent = indentLength (lines[l])
        break
    }

    for (var l = 0; l < count; l++)
    {
        lines[l] = unindent (lines[l], indent)
        // if (geIndentLength (lines[l]) >= indent)
        //     lines[l] = lines[l].substring (indent)
    }

    return lines
}


/** 
 * @param {string} chars
 */
export function removeDuplicateEmptyLine (chars)
{
    const lines = chars.split ('\n')
    const count = lines.length

    /** @type {string[]} */
    const out = new Array (count)
    var end = 0

    var prev = false
    for (var l = 0; l < count; l++)
    {
        var chars = lines[l]
        if (chars.trim () == '')
        {
            if (!prev) {
                prev = true
                out[end++] = chars
                
            }
        }
        else
        {
            prev = false
            out[end++] = chars
        }
    }

    out.length = end
    return out.join ('\n')
}
