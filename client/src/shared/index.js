const times = require('lodash.times');
const set = require('lodash.set');
const get = require('lodash.get');

const toJsonSchema = require('to-json-schema');

const jsf = require('json-schema-faker');

jsf.extend('faker', () => require('faker'));

export const generateItems = (quantity, jsonSchema) => {
  return times(quantity, () => jsf.generate(jsonSchema))
}

export const inferSchema = (v) =>  {
  const re = /\{\{((?!\}\})(.|\n))*\}\}/g

  const options = {
    objects: {
      postProcessFnc: (schema, obj, defaultFnc) => {

        Object.keys(obj).forEach((key) => {
          const a = get(obj, key)
          const b = typeof a === 'string' ? a.match(re) : null

          if (b && b[0] && b[0]) {
            const c = b[0].slice(2, -2)

            set(schema, ['properties', key, 'faker'], c)
          }
          // Pass template variable in here ^^^^^^^^^^^^
          // console.log(schema.properties[key])
        })

        return ({
          ...defaultFnc(schema, obj),
          required: Object.getOwnPropertyNames(obj)
        })
      }
    }
  };

  return toJsonSchema(v, options)
}
