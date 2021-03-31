/**
 * Extends an object with another, following the same syntax as `$.extend` - see {@link http://api.jquery.com/jquery.extend/}.
 * @alias saxo.utils.object.extend
 * @param {boolean} deep - If the argument list begins true the object will be deep copied.
 * @param {...object} objects - Merges properties from later objects on to the first object.
 */

type $Object = Record<string, unknown>;

function extend(
    arg1: boolean,
    arg2: $Object | null,
    arg3: $Object,
    ...restArgs: Array<$Object>
): $Object;
function extend(
    arg1: $Object | null,
    arg2: $Object,
    ...restArgs: Array<$Object>
): $Object;
function extend(arg1: boolean | $Object | null, ...restArgs: any[]): $Object {
    // optimized extend
    // speed tested - http://jsperf.com/jquery-extend-vs-custom
    const deep = arg1 === true;
    const l = restArgs.length;
    let i = 0;
    const result = (deep ? restArgs[i++] : arg1) || {};
    let current;
    let val;

    for (; i < l; i++) {
        current = restArgs[i];
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
