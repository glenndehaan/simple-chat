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

module.exports = {removeByValue};
