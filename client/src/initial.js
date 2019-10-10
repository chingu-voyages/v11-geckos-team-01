const initial = `[{
  'repeat(50, 100)': {
    _id: '{{guid}}',
    company: [
      {
        'repeat(3, 5)': {
	  	  _id: '{{guid}}',
          name: null,
          value: 0
        }
      }
    ],
    people: [{
      'repeat(3, 5)': {
        name: null,
		_id: '{{guid}}',
        facts: [{
          'repeat(3, 5)': {
            _id: '{{guid}}',
            desc: null
          }
       }]
      }
    }],
    picture: 'http://placehold.it/32x32'
  }
}]`
export default initial
