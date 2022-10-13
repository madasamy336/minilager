import AccordionExampleStyled from '../components/unitsfilter/UnitsFilter'
import { Dropdown } from 'semantic-ui-react'
import UnitsCard from '../components/unitscard/UnitsCard'

const Units = () => {
    const tenantTypeOptions = [
        {
          key: 1,
          text: 'Personal User',
          value: 1
        },
        {
          key: 2,
          text: 'Business User',
          value: 2,
        },
      ]
      
      const storageTypeOptions = [
          {
            key: 1,
            text: 'All',
            value: 1
          },
          {
            key: 2,
            text: 'Units',
            value: 2,
          },
        ]

    return (
        <div className="units-wrapper">
            <div className="container">
                <div className="units-banner position-relative">
                    <img className='w-100' src='/assets/images/rentnow-img.png' alt="Storage Units"/>
                    <div className='dropdown-div mx-auto position-absolute'>
                                    <h2 className='text-center'>Find Your Storage Place</h2>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-12'>
                                        <Dropdown placeholder="Choose Tenant Type" clearable fluid search selection options={tenantTypeOptions} />
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-12'>
                                            <Dropdown placeholder="Choose Storage Type" clearable fluid search selection options={storageTypeOptions} />
                                        </div>
                                    </div>
                                </div>
                </div>
                <div className="units-row">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <div className="filters-div">
                                <AccordionExampleStyled />
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12">
                            <div className="units-container-div">
                                <div className='units-div'>
                                    <div className='row'>
                                        <div className='col-lg-4 col-md-6 col-sm-12 2 px-2'>
                                             <UnitsCard />               
                                        </div>
                                        <div className='col-lg-4 col-md-6 col-sm-12 px-2'>
                                             <UnitsCard />               
                                        </div>
                                        <div className='col-lg-4 col-md-6 col-sm-12 px-2'>
                                             <UnitsCard />               
                                        </div>
                                        <div className='col-lg-4 col-md-6 col-sm-12 px-2'>
                                             <UnitsCard />               
                                        </div>
                                        <div className='col-lg-4 col-md-6 col-sm-12 px-2'>
                                             <UnitsCard />               
                                        </div>
                                        <div className='col-lg-4 col-md-6 col-sm-12 px-2'>
                                             <UnitsCard />               
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>   
            </div>
        </div>
    )
}

export default Units;