const initial = `[{
  'repeat(50, 100)': {
    _id: '{{guid}}',
    company: [
      {
        'repeat(3, 5)': {
	  	  _id: '{{guid}}',
          name: '{{companyName}}',
          value: '{{amount}}'
        }
      }
    ],
    people: [{
      'repeat(3, 5)': {
        firstName: '{{firstName}}',
        lastName: '{{lastName}}',
		_id: '{{guid}}',
        facts: [{
          'repeat(3, 5)': {
            _id: '{{guid}}',
            desc: '{{words}}'
          }
       }]
      }
    }]
  }
}]`
export default initial
