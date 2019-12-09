const cloneDeep = require('lodash/cloneDeep');
const Mustache = require('mustache');
const moment = require('moment');
const faker = require('faker');
const uuid = require('uuid/v4');

const repeats = (node = {}) => {
  const regex = /repeat\((\w|\d|\s|,)+\)/g;
  return Object.keys(node)[0].match(regex);
};

const repeatNode = (callback, node, mode) => {
  // If no repeat function is passed, return the node
  if (!callback) {
    return node
  }

  const args = (callback || '').match(/\d+/g);
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
//
// This function will find all of the nodes to be
// repeated in the final result (our JSON response).
//
const findNodes = (value) => {
  const queue = [...value];
  const schema = [];
  const explored = [];
  // eslint-disable-next-line no-shadow
  const callback = ({ node, callback, name = '_root' }) => {
    const nextState = cloneDeep(node);
    Object.keys(node).forEach((prop) => {
      if (Array.isArray(node[prop])) {
        nextState[prop] = `{{&${prop}}}`;
      }
    });
    return schema.push({ node: nextState, callback, name });
  };
  // eslint-disable-next-line no-shadow
  (function (callback, rootNode) {
    let node = [rootNode];
    let name;

    while (queue.length > 0) {
      node = queue.shift();
      name = explored.shift();

      let prop;
      if (node && repeats(node)) {
        prop = repeats(node);

        
        callback({ node: node[prop], callback: repeats(node)[0], name });

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
  }(callback, value));
  //
  // Edge case:
  // If no repeatable items are found,
  // we'll just pass the root node here.
  //
  if (!schema.length) {
    callback({
      node: value.length ? value[0] : value, 
      callback: null,
      name: '_root'
    })
  }
  return schema;
};

export function formatJSONfromString (str = '') {
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
export function generator (template) {
  let result = '';
  let lastNode = {};

  let nodes;
  //
  // User can pass an Object or
  // an array as a valid template
  //
  if (!Array.isArray(template)) {
    nodes = findNodes([template]);
  } else {
    nodes = findNodes(template);
  }

  const callbacks = nodes.reduce((acc, { node, callback, name }) => ({
    ...acc, [name]: () => repeatNode(callback, node, 'json')
  }), {});

  const config = {
    guid: () => uuid(),
    amount: () => faker.finance.amount(),
    firstName: () => faker.name.firstName(),
    lastName: () => faker.name.lastName(),
    friendlyDate: () => moment().format('MMMM Do YYYY'),
    timestamp: () => moment().format(),
    companyName: () => faker.company.companyName(),
    sentence: () => faker.lorem.sentence(),
    paragraph: () => faker.lorem.paragraph(),
    words: () => faker.lorem.words(),
    ...callbacks
  };
  //
  // This is where we begin constructing our
  // JSON result based on our template
  //
  while (nodes.length) {
    lastNode = nodes.shift();
    const { callback, node, name } = lastNode;
    // eslint-disable-next-line no-shadow
    let template = '';
    template = name === '_root'
      ? JSON.stringify(repeatNode(callback, node))
      : result;
    const string = Mustache.render(template, config);
    result = string
      .replace(/("\[)/g, '[')
      .replace(/(\]")/g, ']');
  }
  // this.setState({ result: JSON.parse(result) })
  return JSON.parse(result);
}
