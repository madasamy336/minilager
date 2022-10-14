import AccordionExampleStyled from '../components/unitsfilter/UnitsFilter'
import { Dropdown, Header } from 'semantic-ui-react'
import UnitsCard from '../components/unitscard/UnitsCard'
import { Pagination, Icon } from 'semantic-ui-react'

const Units = () => {
    const tenantTypeOptions = [
        {
            key: 1,
            text: 'Personal User',
            value: 'Personal User'
        },
        {
            key: 2,
            text: 'Business User',
            value: 'Business User',
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
    const sortUnitOptions = [
        {
            key: 'popular',
            text: 'Popular',
            value: 'popular',
            content: 'Popular',
        },
        {
            key: 'Price High to Low',
            text: 'Price High to Low',
            value: 'Price High to Low',
            content: 'Price High to Low',
        },
        {
            key: 'Price Low to High',
            text: 'Price Low to High',
            value: 'Price Low to High',
            content: 'Price Low to High',
        }
    ]

    return (
        <div className="units-wrapper">
            <div className="container">
                <div className="units-banner position-relative">
                    <img className='w-100' src='/assets/images/rentnow-img.png' alt="Storage Units" />
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
                                <p className='text-center error py-1'>Please Select Tenant Type</p>
                                <div className='sort-div text-right py-1'>
                                    <Header as='h4'>
                                        <Header.Content>
                                            Sort by:{' '}
                                            <Dropdown
                                                floating
                                                inline
                                                options={sortUnitOptions}
                                                defaultValue={sortUnitOptions[0].value}
                                            />
                                        </Header.Content>
                                    </Header>
                                </div>
                                <div className='units-div'>
                                    <div className='row'>
                                        <UnitsCard />
                                    </div>
                                </div>
                                <div className='pagination-div mt-2 mb-3 text-center'>
                                    <Pagination ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                        nextItem={{ content: <Icon name='angle right' />, icon: true }} defaultActivePage={1} totalPages={10} />
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