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
          <p>Vehicle Detail {this.props.VehicleLength}</p>
          <div><img src="/assets/images/arrow-down.png" alt="Down" /></div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
        <div className='row'>
          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1 mb-2'>Vehicle Type:</span>{this.props.VehicleType}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>Year:</span>{this.props.Year}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>Brand:</span>{this.props.Brand}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>Model:</span>{this.props.Model}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>Color:</span>{this.props.Color}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>Vehicle State:</span>{this.props.VehicleState}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>Registration No:</span>{this.props.RegistrationNo}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>License No:</span>{this.props.LicenseNo}</p>
          </div>
        </div>
          <div className='text-center'>
            <button onClick={() => this.props.RemoveFunction(this.props.index)} class="ui button bg-danger-light fs-7 fw-400 text-white px-5">Remove</button>
          </div>
        </Accordion.Content>
      </Accordion>
    )
  }
}