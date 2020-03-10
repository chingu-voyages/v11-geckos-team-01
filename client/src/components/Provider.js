import React, { userState } from 'react';
import { render } from 'react-dom';

import set from 'lodash.set'
import get from 'lodash.get'
import flow from 'lodash.flow'
import times from 'lodash.times'

import inferSchema from 'to-json-schema';
import jsf from 'json-schema-faker';

import auth from '../config/auth'
import template from '../config/template'

jsf.extend('faker', () => require('faker'));

export default function Provider(Presenter) {
  return class extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        user: null,
        jsonSchema: null,
        selectedIndex: 0,
        jsonSchemas: [],
        quantity: 3,
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

    async componentDidMount() {
      const { data } = await template.get('/')

      if (data && data.length) {
        const schemaId = get(data, '[0]._id')

        await this.setState({ schemaId, jsonSchemas: data });
      }

      const response = await auth.get('/current_user', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200 && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))

        this.setState({ user: response.data.user })
      }
    }

    createOne = async () => {
      try {
        const { quantity, jsonSchema, jsonRaw, jsonSchemas } = this.state

        const { data } = await template.post('/', {
          jsonSchema: JSON.stringify(jsonSchema),
          jsonRaw: JSON.stringify(jsonRaw),
          quantity
        })

        const nextState = [...jsonSchemas, data]

        console.log(quantity)

        const items = this.generateItems(quantity, jsonSchema)

        this.setState({
          items,
          schemaId: data._id,
          jsonRaw,
          quantity,
          jsonSchema,
          jsonSchemas: nextState,
          selectedIndex: nextState.length - 1
        })
      } catch (e) {
        console.error(e)
      }
    }

    deleteOne = () => {
      const { jsonSchemas, schemaId, } = this.state

      const url = `/${schemaId}`

      template.delete(url).then((data) => {
        const nextState = jsonSchemas.filter(({ _id }) => _id !== schemaId)

        if (nextState.length) {
          const selectedIndex = nextState.length - 1

          const { _id, jsonSchema, quantity } = get(nextState.slice(-1), '[0]')

          const parsed = JSON.parse(jsonSchema)

          this.setState({
            schemaId: _id,
            quantity,
            items: this.generateItems(quantity, parsed),
            jsonSchemas: nextState,
          })
        } else {
          this.setState({
            schemaId: '',
            jsonSchemas: [],
            value: []
          })
        }
      }).catch((error) => {
        console.error(error)
      })
    }

    jsonPrettify = (str) => {
      return  JSON.stringify(JSON.parse(str), null, 2)
    }

    onSelect = ({ _id, jsonRaw, jsonSchema, quantity }) => {
      const parsed = JSON.parse(jsonSchema)

      this.setState({
        schemaId: _id,
        quantity,
        jsonRaw: this.jsonPrettify(jsonRaw),
        items: this.generateItems(quantity, parsed)
      })
    }

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
        const jsonSchema = inferSchema(v, options)

        this.setState({ jsonSchema, jsonRaw: v })
      } catch (e) {
        console.log(e)
      }
    }

    generateItems = (quantity, jsonSchema) => {
      return times(quantity, () => jsf.generate(jsonSchema))
    }

    generateData = async () => {
      if (!this.state.schemaId) return

      const { jsonSchemas, schemaId, jsonSchema, jsonRaw, quantity, items } = this.state

      const url = `/${this.state.schemaId}`

      const body = {
        jsonRaw: JSON.stringify(jsonRaw),
        jsonSchema: JSON.stringify(jsonSchema),
        quantity
      }

      try {
        const { data } = await template.put(url, body)

        const nextState = jsonSchemas.map((item) => item._id !== schemaId ? item : data)

        this.setState({
          success: true,
          quantity,
          jsonSchemas: nextState,
          items: this.generateItems(quantity, jsonSchema)
        })
      } finally {
        console.log('[REQUEST COMPLETE]')
      }
    }

    setDataQuantity = ({ currentTarget: { value } }) => {
      this.setState({ quantity: value ? parseInt(value) : 1 })
    }

    setSelectedIndex = (selectedIndex) => {
      console.log(selectedIndex)
      this.setState({ selectedIndex })
    }

    render (props) {
      return (
        <Presenter
          setDataQuantity={this.setDataQuantity}
          generateSchema={this.generateSchema}
          generateData={this.generateData}
          jsonSchemas={this.state.jsonSchemas}
          selectedIndex={this.state.selectedIndex}
          setSelectedIndex={this.setSelectedIndex}
          jsonSchema={this.state.jsonSchema}
          schemaId={this.state.schemaId}
          onSelect={this.onSelect}
          createOne={this.createOne}
          deleteOne={this.deleteOne}
          jsonRaw={this.state.jsonRaw}
          quantity={this.state.quantity}
          user={this.state.user}
          items={this.state.items}
          {...props}
        />
      );
    }
  }
}
