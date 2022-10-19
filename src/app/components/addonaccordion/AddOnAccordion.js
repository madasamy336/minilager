import React, { Component } from 'react'
import { Accordion } from 'semantic-ui-react'

export default class AddOnAccordion extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
      <Accordion className='w-100'>
        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <p>Vehicle Detail 1</p>
          <div><img src="/assets/images/arrow-down.png" alt="Down" /></div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <div className='row'>
            <div className='col-lg-3'>Name</div>
            <div className='col-lg-9'>Vehicle Detail 1</div>
          </div>
        </Accordion.Content>
      </Accordion>
    )
  }
}