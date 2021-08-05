/**
 * @param {String} href
 * @return {HTMLAnchorElement}
 */
export const createLink = (href) => {
  const link = document.createElement('a')
  link.download = 'encryptedFile.bmp'
  link.className = 'link link--self-end'
  link.innerText = 'Скачать'
  link.href = href

  return link;
}
