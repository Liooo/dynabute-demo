import React from 'react'
import {toDatetimeLocalStr} from "./util";

export class HasOneField extends React.Component{

  constructor(props){
    super(props);
    this.extractValue = this.extractValue.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e, idx = null){
    const value = this.extractValue(e, idx)
    this.props.onChange(this.props.field.id, value)
  }

  extractValue(e, idx) {
    const {value_type} = this.props.field
    let value;
    switch(value_type) {
      case 'select':
        return Object.assign(this.props.value, {value: parseInt(e.target.value)})
      case 'boolean':
        return Object.assign(this.props.value, {value: e.target.checked})
      default:
        return Object.assign(this.props.value, {value: e.target.value})
    }
  }

  renderField(field){
    const {id, name, options, value_type: valueType} = field
    const elemId = `field-${id}`;
    let value = this.props.value.value;

    switch(valueType) {
      case 'integer':
      case 'string':
      case 'datetime':
        const type = {integer: 'number', string: 'text', datetime: 'datetime-local'}[valueType];
        value = valueType == 'datetime' ? toDatetimeLocalStr(value) : value;
        return (
          <div className="form-group">
            <label htmlFor={elemId}>{name}</label>
            <input type={type} className="form-control" id={elemId} onChange={this.onChange} value={value} />
          </div>
        );
      case 'boolean':
        return (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={value} onChange={this.onChange}/> {name}
            </label>
          </div>
        )
      case 'select':
        return (
          <div className="form-group">
            <label htmlFor={elemId}>{name}</label>
            <select className="form-control" id={elemId} name="number"
                    value={value}
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
