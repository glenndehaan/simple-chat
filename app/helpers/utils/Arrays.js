/**
 * Remove an item from an array by value
 *
 * @param array
 * @param value
 */
function removeByValue(array, value) {
    const index = array.indexOf(value);
    array.splice(index, 1);
}

function removeByObjectValue(array, property, value) {
    for(let item = 0; item < array.length; item++) {
        if(array[item][property] === value) {
            array.splice(item, 1);
            break;
        }
    }
}

module.exports = {removeByValue, removeByObjectValue};
