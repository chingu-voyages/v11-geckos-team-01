
module.exports = {
  formatJSONfromString: function (str = '') {
    return str
      .replace(/(\r\n|\r|\n|\s)+/g, '')
      .replace(/"/g, `\\"`)
      .replace(/([,]|[{])([\d]|[\w])+:/g, (str) => {
        const word = /\w+/g
        const prop = str.match(word) ? str.match(word)[0] : ''

        if (str.indexOf('{') !== -1) {
          return `{"${prop}":`
        } else {
          return `,"${prop}":`
        }
      })
      .replace(/'/g, '"')
  }
}
