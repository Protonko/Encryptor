export const fileInput = () => {
  const ELEMENT_SELECTORS = {
    fileInput: '[data-file-input]',
    fileName: '[data-file-name]',
  }

  /**
   * Set file name on input
   */
  document.addEventListener('change', event => {
    if (event.target.closest(ELEMENT_SELECTORS.fileInput)) {
      const fileInput = event.target
      fileInput.nextElementSibling.textContent = fileInput.files[0].name
    }
  })
}
