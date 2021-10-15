
//@ts-check

//------------------------------------------------------------------------------
// JSON schema utilities
//------------------------------------------------------------------------------

/**
 * @param {object} obj 
 * @param {(obj: any) => boolean} filter
 * @param {(obj: any) => any} callback 
 * 
 * @warning
 * - This function assumes that there are no cyclic objects.
 */
export async function visitObject (obj, filter, callback)
{
    if (Array.isArray (obj))
    {
        for (var item of obj) {
            //@ts-ignore
            await visitObject (item, filter, callback)
        }
        return obj
    }
    else if (obj != null && typeof obj === 'object')
    {
        if (filter (obj)) callback (obj)
        for (var key in obj) {
            //@ts-ignore
            await visitObject (obj[key], filter, callback)
        }
    }

    return obj
}
