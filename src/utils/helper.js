export function hasProperty(dataObject, property) {
  return Object.hasOwnProperty.call(dataObject, property);
}
export function getNestedObject(nestedObj, pathArr) {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), nestedObj);
}

export function capitalize(word) {
  if (word && typeof word === 'string') {
    // ^ matches the beginning of the string.
    // \w matches any word character.
    // {1} takes only the first character.
    // Thus, ^\w{1} matches the first letter of the word.
    // | works like the boolean OR. It matches the expression after and before the |.
    // \s+ matches any amount of whitespace between the words (for example spaces, tabs, or line breaks).
    return word.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }
  return word;
}

export function calculateText(text) {
  const canvas = calculateText.widht || (calculateText.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  const metrics = context.measureText(text);

  return [metrics.width, text];
}
