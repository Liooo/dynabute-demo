import React from 'react'

export class DynabuteValueField extends React.Component{

  constructor(props){
    super(props);
    const initialVal = this.props.field.value || (this.hasMany ? [] : '');
    // this.state = {value: initialVal};
    this.onAdd = this.onAdd.bind(this)
    this.extractValue = this.extractValue.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e, idx = null){
    const value = this.extractValue(e, idx)
    console.log("field onchange", e.target.value, value, idx)
    this.props.onChange(this.props.field.id, value)
  }

  extractValue(e, idx) {
    const {value_type: valueType, has_many: hasMany} = this.props.field
    console.log("valuetype = ", valueType, 'has_many=', hasMany)
    switch(valueType) {
      case 'select':
        return hasMany ?
          [...e.target.options].filter((o) => o.selected).map((o) => o.value) :
          e.target.value
      default:
        if(!hasMany) return e.target.value;
        const val = this.props.value.slice();
        val.splice(idx, 1, e.target.value);
        return val
    }
  }

  onRemove(idx){
    this.props.onRemove(this.props.field.id, idx)
  }

  onAdd(){
    const newVal = this.props.value.concat('')
    this.props.onChange(this.props.field.id, newVal);
  }

  renderField(field){
    const elemId = `field-${field.id}`
    const {id, name, options, value_type: valueType, has_many: hasMany} = field
    switch(valueType){
      case 'integer':
      case 'string':
        const type = valueType == 'integer' ? 'number' : 'text';
        return (
          <div>
            {hasMany ?
              <fieldset>
                <legend>{name}</legend>
                {
                  this.props.value.map((v, idx) => (
                    <div className="row"  key={idx}>
                      <div className="col-lg-3 form-group">
                        <input type={type} className="form-control" value={v} onChange={(e) => this.onChange(e, idx)}/>
                      </div>
                      <div className="col-lg-1" style={{paddingTop: 5}}>
                        <button type="button" className="btn btn-xs btn-danger" onClick={() => this.onRemove(idx)}>remove</button>
                      </div>
                    </div>
                  ))
                }
              </fieldset>
              :
              <div className="form-group">
                <label htmlFor={elemId}>{name}</label>
                <input type={type} className="form-control" id={elemId} onChange={this.onChange}/>
              </div>
            }
            { hasMany ? <button type="button" onClick={this.onAdd}>add</button> : null }
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
                    multiple={hasMany}
                    onChange={this.onChange} >
              {options.map((o)=>(<option value={o.id} key={o.id}>{o.label}</option>))}
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
