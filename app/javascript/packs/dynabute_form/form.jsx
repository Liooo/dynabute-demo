import React from 'react'
import ReactDOM from 'react-dom'
import { DynabuteValueField } from './field'
import {map} from 'lodash'

class DynabuteValueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {fields: [], obj: {}, dynabuteValues: {}}

    Promise.all([fetch('/dynabute_fields.json?target_model=user'), fetch('/users/6.json')])
      .then((resps) => Promise.all(resps.map((r) => r.json())))
      .then((data) => {
        const fields = data[0], obj = data[1]
        this.originalDvalues = Object.assign({}, obj.dynabute_values)
        const dynabuteValues = this.toDvalueState(obj.dynabute_values, fields);
        delete obj.dynabute_values
        this.setState({fields, obj, dynabuteValues})
      });

    this.onChange = this.onChange.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  onSubmit(){
    map(this.state.fields, (f)=>{
      const newValue = this.state.dynabuteValues[f.id]
      if(!f.has_many) {
        const origDvalue = this.originalDvalues.find((v) => v.field_id == f.id)
        const newDvalParams = Object.assign(origDvalue, {value: newValue})
        return newDvalParams
      } else {
        const origDvalue = this.originalDvalues.filter((v) => v.field_id == f.id)
        const newDvalParams = []
        newValue.forEach((v)=>{
          if (origDvalue) {
          }
        })
      }
    })
  }

  toDynabuteValueParams(stateValues){
    map(stateValues, (v, k)=>{ })
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
        <form>
          <div className="form-group">
            <label htmlFor="user">Name:</label>
            <input type="text" className="form-control" id="user" />
          </div>
          {
            this.state.fields.map((f, i)=>(
              <div style={{marginBottom: 20}} key={f.id}>
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
    // document.body.appendChild(document.createElement('div'))
  )
})
