import React from 'react'
import {zip, map} from 'lodash'
import {toDatetimeLocalStr} from "./util";

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
        const values = this.props.value.slice();
        const accessor = value_type == 'boolean' ? 'checked' : 'value'
        const newValue = Object.assign(values[idx], {field_id, value: e.target[accessor]})
        values.splice(idx, 1, newValue);
        return values
    }
  }

  onRemove(idx){
    this.props.onRemove(this.props.field.id, idx);
  }

  onAdd(){
    this.props.onAdd(this.props.field);
  }

  buildBooleanInputGetter(onChange) {
    return function getInput(value, idx) {
      return (
        <div className="col-sm-3">
          <input type="checkbox" checked={value} onChange={(e) => onChange(e, idx)}/>
        </div>
      )
    }
  }

  buildTextInputGetter(type, onChange) {
    return function getInput(value, idx) {
      return (
        <div className="col-sm-3 form-group">
          <input type={type} className="form-control" value={value} onChange={(e) => onChange(e, idx)}/>
        </div>
      )
    }
  }

  renderMany(legend, getInput, values){
    return (
      <div style={{borderBottom: '1px solid #e5e5e5', paddingBottom: 10}}>
        <fieldset>
          <legend>{legend}</legend>
          {
            values.map((v, idx) => {
              if(v._destroy) return null;
              return (
                <div className="row" key={idx}>
                  { getInput(v.value, idx) }
                  <div className="col-sm-1" style={{paddingTop: 5}}>
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
  }

  renderField(field){
    const {id, name, options, value_type: valueType} = field
    const elemId = `field-${id}`;
    let values = this.props.value;
    switch(valueType){
      case 'integer':
      case 'string':
      case 'datetime':
        const inputType = {integer: 'number', string: 'text', datetime: 'datetime-local'}[valueType];
        values = valueType == 'datetime' ?
          values.map((v)=>Object.assign(v, {value: toDatetimeLocalStr(v.value)})) :
          values;
        return this.renderMany(name, this.buildTextInputGetter(inputType, this.onChange), values);
      case 'boolean':
        return this.renderMany(name, this.buildBooleanInputGetter(this.onChange), values);
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
    return (
      <div>
        {this.renderField(this.props.field)}
      </div>
    )
  }
}
