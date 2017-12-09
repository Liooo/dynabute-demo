import React from 'react'
import {zip, map} from 'lodash'

export class HasManyField extends React.Component{

  constructor(props){
    super(props);
    this.onAdd = this.onAdd.bind(this)
    this.extractValue = this.extractValue.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e, idx = null){
    const value = this.extractValue(e, idx)
    this.props.onChange(this.props.field.id, value)
  }

  extractValue(e, idx) {
    const {id: field_id, value_type} = this.props.field;
    switch(value_type) {
      case 'select':
        const newValues = [...e.target.options].filter((o) => o.selected).map((o) => parseInt(o.value))
        return zip(this.props.value, newValues).map((values)=>{
          const [origVal, newVal] = values
          if (origVal && newVal) { // changed
            return {id: origVal.id, field_id, value: newVal}
          } else if (!origVal && newVal) { // newly added
            return {field_id, value: newVal}
          } else if (origVal && !newVal) { //removed
            return {id: origVal.id, field_id, _destroy: true}
          }
        })
      default:
        const val = this.props.value.slice();
        val.splice(idx, 1, {field_id, value: e.target.value});
        return val
    }
  }

  onRemove(idx){
    this.props.onRemove(this.props.field.id, idx);
  }

  onAdd(){
    this.props.onAdd(this.props.field.id);
  }

  renderField(field){
    const {id, name, options, value_type: valueType, has_many: hasMany} = field
    const elemId = `field-${id}`;
    const values = this.props.value
    switch(valueType){
      case 'integer':
      case 'string':
        const type = valueType == 'integer' ? 'number' : 'text';
        return (
          <div style={{borderBottom: '1px solid #e5e5e5', paddingBottom: 10}}>
            <fieldset>
              <legend>{name}</legend>
              {
                values.map((v, idx) => {
                  if(v._destroy) return null;
                  return (
                    <div className="row" key={idx}>
                      <div className="col-lg-3 form-group">
                        <input type={type} className="form-control" value={v.value} onChange={(e) => this.onChange(e, idx)}/>
                      </div>
                      <div className="col-lg-1" style={{paddingTop: 5}}>
                        <button type="button" className="btn btn-xs btn-danger" onClick={() => this.onRemove(idx)}>remove</button>
                      </div>
                    </div>
                  )
                })
              }
            </fieldset>
            <button className="btn btn-xs btn-success" type="button" onClick={this.onAdd}>add</button>
          </div>
        )
      case 'boolean':
        return (
          <div className="checkbox">
            <label>
              <input type="checkbox" value="checkboxA" /> {name}
            </label>
          </div>
        )
      case 'select':
        return (
          <div className="form-group">
            <label htmlFor={elemId}>{name}</label>
            <select className="form-control" id={elemId} name="number"
                    multiple
                    value={values.filter((v)=>!v._destroy).map((v)=>v.value)}
                    onChange={this.onChange} >
              {options.map((o) => <option value={o.id} key={o.id} >{o.label}</option> )}
            </select>
          </div>
        )
    }
  }

  render(){
    const {field} = this.props
    return (
      <div>
        {this.renderField(field)}
      </div>
    )
  }
}
