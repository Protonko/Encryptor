/**
 * @param {String} text
 * @return {HTMLParagraphElement}
 */
export const createDescription = (text) => {
  const paragraph = document.createElement('p')
  paragraph.className = 'description'
  paragraph.innerText = text

  return paragraph
}
