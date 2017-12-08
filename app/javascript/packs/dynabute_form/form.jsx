import React from 'react'
import ReactDOM from 'react-dom'
import { DynabuteValueField } from './field'
import {map} from 'lodash'

class DynabuteValueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {fields: [], obj: {}, dynabuteValues: {}}

    Promise.all([$.getJSON('/dynabute_fields.json?target_model=user'), $.getJSON('/users/6.json')])
      .then((data) => {
        const fields = data[0], obj = data[1];
        this.originalDvalues = obj.dynabute_values.slice();
        const dynabuteValues = this.toDvalueState(obj.dynabute_values, fields);
        delete obj.dynabute_values
        this.setState({fields, obj, dynabuteValues})
      });

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(){
    const dParams = this.toDvalueParams(this.state.fields, this.state.dynabuteValues);
    const params = {user: {
      dynabute_values_attributes: dParams
    }}
    $.ajax(`/users/${this.state.obj.id}`, {method: 'patch', data: params}).then(()=>{
      location.href = '/users'
    })
  }

  toDvalueParams(fields, values){
    return _(fields).map((f)=>{
      const newValue = values[f.id]
      if(f.has_many) {
        const origDvalue = this.originalDvalues.filter((v) => v.field_id == f.id)
        const added = _.difference(newValue, origDvalue.map((d) => d.value))
        const removed = _.difference(origDvalue.map((d) => d.value), newValue)
        return [
          ...origDvalue.map((d) => {
            if(removed.includes(d.value)) { d._destroy = true; }
            return d;
          }),
          ...added.map((value) => ({field_id: f.id, value}))
        ]
      } else {
        if(!newValue) { return null; }
        const origDvalue = this.originalDvalues.find((v) => v.field_id == f.id) || {};
        return Object.assign(origDvalue, {value: newValue, field_id: f.id});
      }
    }).flatten().compact().value();
  }

  toDvalueState(rawValues, fields) {
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

  onChange(fieldId, values) {
    const newValues = Object.assign(this.state.dynabuteValues, {[fieldId]: values});
    this.setState({dynabuteValues: newValues})
  }

  render(){
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="user">Name:</label>
            <input type="text" className="form-control" id="user" />
          </div>
          {
            this.state.fields.map((f, i)=>(
              <div style={{marginBottom: 30}} key={f.id}>
                <DynabuteValueField
                  field={f}
                  value={this.state.dynabuteValues[f.id]}
                  onChange={this.onChange}
                />
              </div>
            ))
          }
          <button type="button" className="btn btn-primary" onClick={this.onSubmit}>yo</button>
        </form>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <DynabuteValueForm/>,
    document.getElementById('dynabute-form')
  )
})
