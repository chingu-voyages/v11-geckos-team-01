import React, { userState } from 'react';
import { render } from 'react-dom';

import get from 'lodash.get';

import auth from '../config/auth'
import template from '../config/template'

import initial from '../initial.json'

import { generateItems, inferSchema } from '../shared'

export default function Provider(Presenter) {
  return class extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        user: null,
        schemaId: null,
        jsonRaw: JSON.stringify(initial, null, 2),
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
        // const schemaId = get(data, '[0]._id')

        await this.setState({ jsonSchemas: data });
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
          items: generateItems(quantity, jsonSchema)
        })
      } finally {
        console.log('[REQUEST COMPLETE]')
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

        const items = generateItems(quantity, jsonSchema)

        this.setState({
          items,
          schemaId: data._id,
          quantity,
          jsonSchema,
          jsonSchemas: nextState,
          jsonRaw: JSON.stringify(jsonRaw),
          selectedIndex: nextState.length - 1
        })
      } catch (e) {
        console.error(e)
      }
    }

    deleteOne = () => {
      const { jsonSchemas, schemaId } = this.state

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
            items: generateItems(quantity, parsed),
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
        items: generateItems(quantity, parsed)
      })
    }

    generateSchema = (v) => {
      try {
        const jsonSchema = inferSchema(v)

        const jsonRaw = JSON.stringify(v, null, 2)

        this.setState({ jsonSchema, jsonRaw })
      } catch (e) {
        console.log(e)
      }
    }

    setDataQuantity = ({ currentTarget: { value } }) => {
      this.setState({ quantity: value ? parseInt(value) : 1 })
    }

    setSelectedIndex = (selectedIndex) => {
      console.log(selectedIndex)
      this.setState({ selectedIndex })
    }

    render () {
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
        />
      );
    }
  }
}
