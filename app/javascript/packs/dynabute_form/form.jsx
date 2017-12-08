import React from 'react'
import ReactDOM from 'react-dom'
import { DynabuteValueField } from './field'

class DynabuteValueForm extends React.Component{
  constructor(props) {
    super(props)
    this.state = {fields: [], obj: {}, dynabuteValues: {}}

    Promise.all([fetch('/dynabute_fields.json?target_model=user'), fetch('/users/6.json')])
      .then((resps) => Promise.all(resps.map((r) => r.json())))
      .then((data) => {
        const fields = data[0], obj = data[1]
        const dynabuteValues = this.buildDynabuteHash(obj.dynabute_values, fields);
        delete obj.dynabute_values
        this.setState({fields, obj, dynabuteValues})
      });

    this.onChange = this.onChange.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  buildDynabuteHash(rawValues, fields) {
    return fields.reduce((hash, f) => {
      let value;
      if(f.has_many) {
        value = rawValues.filter((v) => v.field_id == f.id).map((v) => v.value)
      } else{
        const v = rawValues.find((v) => v.field_id == f.id);
        value = v ? v.value : ''
      }
      hash[f.id] = value;
      return hash;
    }, {})
  }

  onRemove(fieldId, idx) {
    const value = this.state.dynabuteValues[fieldId].slice();
    value.splice(idx, 1);
    const newValues = Object.assign(this.state.dynabuteValues, {[fieldId]: value});
    this.setState({dynabuteValues: newValues})
  }

  onAdd(fieldId) {
    const obj = this.state.obj.dynabute_values
    obj.dynabute_values.push({field_id: fieldId, value: ''})
  }

  onChange(fieldId, values){
    const newValues = Object.assign(this.state.dynabuteValues, {[fieldId]: values});
    this.setState({dynabuteValues: newValues})
  }

  render(){
    return (
      <div>
        <form action="/users" method="post">
          <div className="form-group">
            <label htmlFor="user">Name:</label>
            <input type="text" className="form-control" id="user" />
          </div>
          {
            this.state.fields.map((f, i)=>(
              <DynabuteValueField
                key={f.id}
                field={f}
                value={this.state.dynabuteValues[f.id]}
                onChange={this.onChange}
                onRemove={this.onRemove}
              />
            ))
          }
        </form>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <DynabuteValueForm/>,
    document.getElementById('dynabute-form')
    // document.body.appendChild(document.createElement('div'))
  )
})
