import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Filters.module.css'

import { Dropdown } from 'semantic-ui-react'

class Filters extends Component {
  render() {
    const { itemConfig, filters, onFilter } = this.props
    console.log('filt', filters)

    return (
      <div>
        {Object.keys(filters).map(key => {
          const filter = filters[key]
          console.log('filter', filter)

          itemConfig.forEach(item => {

          })

          return key
        })}
      </div>
    )
  }
}

Filters.propTypes = {
  // data: PropTypes.array
}

export default Filters
