import React from 'react'

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
    const {field_id, value_type} = this.props.field
    switch(value_type) {
      case 'select':
        return Object.assign(this.props.value, {value: parseInt(e.target.value)})
      default:
        return Object.assign(this.props.value, {value: e.target.value})
    }
  }

  renderField(field){
    const {id, name, options, value_type: valueType, has_many: hasMany} = field
    const elemId = `field-${id}`;
    const value = this.props.value
    switch(valueType){
      case 'integer':
      case 'string':
        const type = valueType == 'integer' ? 'number' : 'text';
        return (
          <div className="form-group">
            <label htmlFor={elemId}>{name}</label>
            <input type={type} className="form-control" id={elemId} onChange={this.onChange}/>
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
                    value={value}
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
