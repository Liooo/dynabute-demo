import React from 'react'
import ReactDOM from 'react-dom'
import {HasOneField} from "./has_one_field";
import {HasManyField} from "./has_many_field";
import {flatten} from 'lodash'

class DynabuteValueForm extends React.Component {
  constructor(props) {
    super(props)

    const {fields, values, obj} = this.props;
    this.originalDvalues = values.slice();
    const dynabuteValues = this.toDvalueState(values, fields);
    this.state = {fields, obj, dynabuteValues, errors: []}

    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onAdd(field){
    const {id, value_type} = field;
    const initialVal = value_type == 'boolean' ? false : ''
    const values = this.state.dynabuteValues[id].concat({field_id: id, value: initialVal});
    const dynabuteValues = Object.assign(this.state.dynabuteValues, {[id]: values});
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

  onChange(fieldId, values) {
    const newValues = Object.assign(this.state.dynabuteValues, {[fieldId]: values});
    this.setState({dynabuteValues: newValues})
  }

  onNameChange(e){
    const newObj = Object.assign(this.state.obj, {name: e.target.value})
    this.setState({obj: newObj})
  }

  onSubmit(){
    this.setState({errors: []})
    const values = flatten(Object.values(this.state.dynabuteValues))
    const params = {
      name: this.state.obj.name,
      dynabute_values_attributes: values
    };
    this.props.onSubmit(params)
      .catch((err)=>{
      this.setState({errors: err});
        window.scrollTo(0, 0);
    })
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

  render(){
    return (
      <div>
        {this.state.errors.length > 0 &&
          <div className="alert alert-danger">
            {this.state.errors.map((m, i)=><div key={i}>{m}</div>)}
          </div>
        }
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" className="form-control" id="name" value={this.state.obj.name} onChange={this.onNameChange}/>
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
          <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Save</button>
          <a href={this.props.cancelLink} style={{marginLeft: 10}} className="btn btn-default">Cancel</a>
        </form>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const elem = $('#dynabute-form');

  const {controllerName, modelId} = elem.data();
  const modelName = controllerName.slice(0, controllerName.length - 1)

  const onSubmit = function(params) {
    const method = modelId ? 'patch' : 'post';
    const url = modelId ? `/${controllerName}/${modelId}.json` : `/${controllerName}.json`;
    const data = {[modelName]: params}
    return $.ajax(url, {method, data}).then(
      function backToindex() {
        window.history.replaceState(null, null, `/${controllerName}`);
        window.location.reload();
      },
      function passErrors(resp){
        return new Promise((_, rj) => rj(resp.responseJSON))
      }
    )
  };

  const getFields = $.getJSON(`/dynabute_fields.json?target_model=${modelName}`);
  const getModel = modelId ? $.getJSON(`/${controllerName}/${modelId}.json`) : null;
  Promise.all([getFields, getModel])
    .then((data) => {
      const fields = data[0],
        obj = data[1] || {},
        values = obj.dynabute_values || [];
      ReactDOM.render(
        <DynabuteValueForm onSubmit={onSubmit} cancelLink={`/${controllerName}`} fields={fields} values={values} obj={obj} />,
        elem[0]
      )
    });
})
