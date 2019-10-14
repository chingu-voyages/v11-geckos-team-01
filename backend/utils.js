
const cloneDeep = require('lodash/cloneDeep');
const Mustache = require('mustache');
const uuid = require('uuid/v4');

const repeats = (node = {}) => {
  const regex = /repeat\((\w|\d|\s|,)+\)/g;
  return Object.keys(node)[0].match(regex);
};

const repeatNode = (callback, node, mode) => {
  const args = callback.match(/\d+/g);
  const parsed = args.map((str) => parseInt(str, 10));

  const max = parsed[1];
  const min = parsed[0];

  let i = Math.floor((Math.random() * ((max + 1) - min)) + min);

  const result = [];
  // eslint-disable-next-line no-plusplus
  while (--i) {
    result.push({ ...node });
  }
  return mode === 'json' ? JSON.stringify(result) : result;
};

const findNodes = (value) => {
  const queue = [...value];
  const schema = [];
  const explored = [];
  const callback = ({ node, cb, name = '_root' }) => {
    const nextState = cloneDeep(node);
    Object.keys(node).forEach((prop) => {
      if (Array.isArray(node[prop])) {
        nextState[prop] = `{{&${prop}}}`;
      }
    });
    return schema.push({ node: nextState, cb, name });
  };
  function BFS(cb, rootNode) {
    let node = [rootNode];
    let name;
    while (queue.length > 0) {
      node = queue.shift();
      name = explored.shift();
      let prop;
      if (node && repeats(node)) {
        prop = repeats(node);
        cb({ node: node[prop], callback: repeats(node)[0], name });
        explored.push(prop);
        queue.push(node[prop]);
      } else {
        // eslint-disable-next-line no-loop-func
        Object.keys(node).forEach((prop) => { // eslint-disable-line no-shadow
          if (Array.isArray(node[prop])) {
            explored.push(prop);
            queue.push(node[prop][0]);
          }
        });
      }
    }
  }
  BFS(callback, value);
  return schema;
};

const generateJSON = () => {
  let result = '';
  let lastNode = {};
  const nodes = findNodes();
  const callbacks = nodes.reduce((acc, { node, callback, name }) => ({
    ...acc, [name]: () => repeatNode(callback, node, 'json')
  }), {});
  const config = {
    guid: () => uuid(),
    ...callbacks
  };
  while (nodes.length) {
    lastNode = nodes.shift();
    const { callback, node, name } = lastNode;
    let template = '';
    template = name === '_root'
      ? JSON.stringify(this.repeatNode(callback, node))
      : result;
    const string = Mustache.render(template, config);
    result = string
      .replace(/("\[)/g, '[')
      .replace(/(\]")/g, ']');
  }
  // this.setState({ result: JSON.parse(result) })
  return JSON.parse(result);
};

module.exports = generateJSON;
