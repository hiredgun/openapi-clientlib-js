/**
 * Extends an object with another, following the same syntax as `$.extend` - see {@link http://api.jquery.com/jquery.extend/}.
 * @alias saxo.utils.object.extend
 * @param {boolean} deep - If the argument list begins true the object will be deep copied.
 * @param {...object} objects - Merges properties from later objects on to the first object.
 */
function extend(...args: any[]) {
    // optimized extend
    // speed tested - http://jsperf.com/jquery-extend-vs-custom
    const deep = args[0] === true;
    const l = args.length;
    let i = deep ? 1 : 0;
    const result = args[i++] || {};
    let current;
    let val;

    for (; i < l; i++) {
        current = args[i];
        for (const prop in current) {
            if (current.hasOwnProperty(prop)) {
                val = current[prop];
                if (!deep || typeof val !== 'object') {
                    result[prop] = val;
                } else {
                    if (
                        typeof val !== typeof result[prop] ||
                        Array.isArray(val) !== Array.isArray(result[prop])
                    ) {
                        result[prop] = Array.isArray(val) ? [] : {};
                    }
                    extend(true, result[prop], val);
                }
            }
        }
    }
    return result;
}

export { extend };
