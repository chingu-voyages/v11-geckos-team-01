
module.exports = {
    findNodes () {
    // https://stackoverflow.com/questions/48612674/depth-first-traversal-with-javascript
    const schema = []
    let calls = 0
    let lastNode
    const callback = ({ node, callback, name = '_root' }) => {
      if (schema.length) {
        schema[schema.length - 1].node[name] = `{{&${name}}}`
      }
      schema.push({ node, callback, name })
      lastNode = node
    }
    (function recurse (context, name) {
      calls++
      console.log('recurse called ', calls, ' times')
      console.log(lastNode)
      let prop
      const regex = /repeat\((\w|\d|\s|,)+\)/g
      const repeats = context[0] && Object.keys(context[0])[0].match(regex)
      if (context[0] && repeats) {
        prop = repeats[0]
        callback({ node: context[0][prop], callback: repeats[0], name })
        // debugger
        return recurse(context[0][prop])
      } else {
        for (let prop in context) {
          if (Array.isArray(context[prop])) {
            // callback({ name: prop, node: context[prop] })
            return recurse(context[prop], prop, context)
          }
        }
      }
    })(this.state.value)
    console.log(schema)
    return schema
  }
}
