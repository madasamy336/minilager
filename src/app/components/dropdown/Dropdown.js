import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownExampleSelection = (props) => (
  <Dropdown placeholder={props.placeholderText} clearable fluid search selection options={props.options} />
)

export default DropdownExampleSelection