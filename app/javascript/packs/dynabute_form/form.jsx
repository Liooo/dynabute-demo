import React from 'react'
import ReactDOM from 'react-dom'
import {HasOneField} from "./has_one_field";
import {HasManyField} from "./has_many_field";
import {flatten} from 'lodash'

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
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  onAdd(fieldId){
    const values = this.state.dynabuteValues[fieldId].concat({field_id: fieldId, value: ''});
    const dynabuteValues = Object.assign(this.state.dynabuteValues, {[fieldId]: values});
    console.log("-", dynabuteValues)
    this.setState({dynabuteValues})
  }

  onRemove(fieldId, idx){
    const values = this.state.dynabuteValues[fieldId]
    if(values[idx].id) {
      values[idx]._destroy = true
    } else {
      values.splice(idx, 1);
    }
    const dynabuteValues = Object.assign(this.state.dynabuteValues, {[fieldId]: values})
    this.setState({dynabuteValues})
  }

  onSubmit(){
    const values = flatten(Object.values(this.state.dynabuteValues))
    const params = {user: {
      dynabute_values_attributes: values
    }}
    $.ajax(`/users/${this.state.obj.id}.json`, {method: 'patch', data: params}).then(
      ()=>{
        window.history.replaceState(null, null, '/users');
        window.location.reload();
      },
      (errors)=>{
        console.log("error!", errors)
      }
    )
  }

  toDvalueState(rawValues, fields) {
    return fields.reduce((hash, f) => {
      let value;
      if(f.has_many) {
        value = rawValues.filter((v) => v.field_id == f.id)
      } else {
        value = rawValues.find((v) => v.field_id == f.id) || {field_id: f.id, value: ''}
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
                {f.has_many ?
                  <HasManyField
                    field={f}
                    value={this.state.dynabuteValues[f.id]}
                    onChange={this.onChange}
                    onAdd={this.onAdd}
                    onRemove={this.onRemove}
                  />
                  :
                  <HasOneField
                    field={f}
                    value={this.state.dynabuteValues[f.id]}
                    onChange={this.onChange}
                  />
                }
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
