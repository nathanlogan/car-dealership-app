import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Filters.module.css'

import { Header, Dropdown } from 'semantic-ui-react'

class Filters extends Component {
  render() {
    const { itemConfig, filters, onFilter } = this.props

    return (
      <div>
        <Header as="h3">Filters: </Header>
        
        {Object.keys(filters).map(key => {
          const filter = filters[key]
          let filterType
          let filterName

          // determine filter type (range or dropdown)
          itemConfig.forEach(item => {
            if (item.key === key) {
              filterType = item.filterType
              filterName = item.name || (item.key.substr(0, 1).toUpperCase() + item.key.substr(1))
            }
          })

          if (filterType === 'select') return (
            <p><Dropdown
              placeholder={filterName}
              multiple
              search
              selection
              onChange={(e, meta) => onFilter(key, meta.value)}
              options={
                filter.map(filter => ({
                  text: filter,
                  value: filter,
                }))
              }
            /></p>
          )
          else if (filterType === 'range') return (<p>
            {/* // <Dropdown
            //   placeholder={filterName}
            //   selection
            //   onChange={(e, meta) => onFilter(key, meta.value)}
            //   options={
            //     filter.map(filter => ({
            //       text: filter,
            //       value: filter,
            //     }))
            //   }
            // /> - 
            // <Dropdown
            //   placeholder={filterName}
            //   selection
            //   onChange={(e, meta) => onFilter(key, meta.value)}
            //   options={
            //     filter.map(filter => ({
            //       text: filter,
            //       value: filter,
            //     }))
            //   }
            // /> */}
            Range: {filter[0]} - {filter[filter.length - 1]}</p>
          )
        })}
      </div>
    )
  }
}

Filters.propTypes = {
  // data: PropTypes.array
}

export default Filters
