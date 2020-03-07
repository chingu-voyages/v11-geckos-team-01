import React, { userState } from 'react';
import { render } from 'react-dom';

import set from 'lodash.set'
import get from 'lodash.get'
import times from 'lodash.times'

import inferSchema from 'to-json-schema';
import jsf from 'json-schema-faker';

jsf.extend('faker', () => require('faker'));

export default function Provider(Presenter) {
  return class extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        value: [],
        result: [],
        schema: null,
        schemas: [],
        templates: [],
        quantity: 1,
        button: {
          margin: '0 8px 0 8px'
        },
        root: {
          flexGrow: 1,
          height: '100%',
          margin: '0'
        },
        items: []
      }
    };

    generateSchema = (v) =>  {
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

      try {
        const schema = inferSchema(v, options)
            // console.log(schema)
        this.setState({ schema })
      } catch (e) {
        console.log(e)
      }
    }

    generateData = async () => {
      const { schema, quantity, items } = this.state

      await this.setState({ items: times(quantity, () => jsf.generate(schema)) })
    }

    setDataQuantity = ({ currentTarget: { value } }) => {
      this.setState({ quantity: value ? parseInt(value) : 1 })
    }

    render (props) {
      return (
        <Presenter
          setDataQuantity={this.setDataQuantity}
          generateSchema={this.generateSchema}
          generateData={this.generateData}
          items={this.state.items}
          {...props}
        />
      );
    }
  }
}
