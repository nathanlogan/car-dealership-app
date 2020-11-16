import React from 'react'
import PropTypes from 'prop-types'
import styles from './Filters.module.css'

import { Dropdown } from 'semantic-ui-react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const Filters = props => {
  const { itemConfig, filters, appliedFilters, onFilter } = props
  const Range = Slider.createSliderWithTooltip(Slider.Range)

  return (
    <div className={styles.filters}>
      {Object.keys(filters).map(key => {
        const filter = filters[key]
        let filterType
        let filterName

        // determine filter type (range or dropdown)
        itemConfig.forEach(item => {
          if (item.key === key) {
            filterType = item.filterType
            filterName = item.name || item.key.substr(0, 1).toUpperCase() + item.key.substr(1)
          }
        })

        return filterType === 'select' ? (
          <Dropdown
            key={key}
            placeholder={filterName}
            multiple
            search
            selection
            onChange={(e, meta) => onFilter(key, meta.value)}
            options={filter.map(filter => ({
              text: filter,
              value: filter,
            }))}
          />
        ) : (
          <label className={styles.range} key={key}>
            {filterName} ({filter[0]} - {filter[filter.length - 1]}):
            <Range
              defaultValue={[filter[0], filter[filter.length - 1]]}
              value={appliedFilters.filter(filter => filter.facet === key)[0]?.values}
              min={filter[0]}
              max={filter[filter.length - 1]}
              onChange={vals => onFilter(key, vals, 'range')}
            />
          </label>
        )
      })}
    </div>
  )
}

Filters.propTypes = {
  itemConfig: PropTypes.array,
  filters: PropTypes.object,
  appliedFilters: PropTypes.array,
  onFilter: PropTypes.func,
}

export default Filters
