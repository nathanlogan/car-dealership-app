import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Inventory.module.css'

import { sortBy, cloneDeep } from 'lodash-es'

import { Container, Header } from 'semantic-ui-react'
import InventoryList from 'components/InventoryList/InventoryList'
import Filters from 'components/Filters/Filters'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      facetedCars: props.cars,
      facetedPagedCars: props.cars.slice(0, props.carsPerPage),

      allFilters: this.getAllFilters(),
      appliedFilters: [],
      
      sortDirection: 'ascending',
      sortColumn: null,
      currentPage: 1,
    }

    this.onSort = this.onSort.bind(this)
    this.onPageNav = this.onPageNav.bind(this)
    this.filter = this.filter.bind(this)
  }

  getAllFilters() {
    let keys = []
    let filters = {}

    // set up filter categories
    this.props.itemConfig.forEach(config => {
      if (config['filterType']) {
        filters[config.key] = []
        keys.push(config.key)
      }
    })

    // populate filter values
    this.props.cars.forEach(car => {
      keys.forEach(key => !filters[key].includes(car[key]) && filters[key].push(car[key]))
    })

    // sort filter values
    Object.keys(filters).forEach(key => (filters[key] = filters[key].sort()))

    return filters
  }

  doSort(results, sortColumn, sortDirection) {
    const sortCars = car => {
      let val = car[sortColumn]

      if (typeof val === 'string') {
        // coerce prices into sortable numbers
        if (val.substr(0, 1) === '$') {
          return parseFloat(val.replace(/[^\d]/g, ''))
        }
        // so you sort alphabetically, not by weird case-sensitivity sorting
        else return val.toLowerCase()
      } else return val
    }

    results = sortBy(results, sortCars)
    if (sortDirection === 'descending') results.reverse()

    return results
  }

  onSort(newColumn) {
    const { sortColumn, sortDirection } = this.state
    let results = cloneDeep(this.state.facetedCars)

    if (sortColumn === newColumn) {
      const newSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending'
      results = this.doSort(results, newColumn, newSortDirection)

      this.setState({
        facetedCars: results,
        facetedPagedCars: results.slice(0, this.props.carsPerPage),
        sortDirection: newSortDirection,
        currentPage: 1,
      })
    } else {
      results = this.doSort(results, newColumn)

      this.setState({
        facetedCars: results,
        facetedPagedCars: results.slice(0, this.props.carsPerPage),
        sortDirection: 'ascending',
        sortColumn: newColumn,
        currentPage: 1,
      })
    }
  }

  onPageNav(page) {
    page = parseFloat(page)
    let newSlice = this.state.facetedCars.slice(
      this.props.carsPerPage * (page - 1),
      this.props.carsPerPage * page
    )

    this.setState(
      {
        facetedPagedCars: newSlice,
        currentPage: page,
      },
      () => window.scrollTo(0, 0)
    )
  }

  // apply "OR" logic within filter type, but "AND" logic across filter types
  filter(facet, values, type = 'select') {
    let results = cloneDeep(this.props.cars)
    let newAppliedFilters = []

    // nuke the old filter definition (if it existed)
    newAppliedFilters = this.state.appliedFilters.filter(filter => filter.facet !== facet)
    // only save our filter if it has values
    if (values.length) newAppliedFilters.push({ facet, values, type })

    // apply each filter type
    newAppliedFilters.forEach(filter => {
      if (filter.type === 'select') {
        results = results.filter(car => filter.values.includes(car[filter.facet]))
      } else {
        results = results.filter(
          car => car[filter.facet] >= filter.values[0] && car[filter.facet] <= filter.values[1]
        )
      }
    })

    // apply current sort before returning
    if (this.state.sortColumn) {
      results = this.doSort(results, this.state.sortColumn, this.state.sortDirection)
    }

    this.setState({
      facetedCars: results,
      facetedPagedCars: results.slice(0, this.props.carsPerPage),
      appliedFilters: newAppliedFilters,
      currentPage: 1,
    })
  }

  render() {
    const { facetedCars, facetedPagedCars, sortColumn, sortDirection, currentPage } = this.state
    const pages = Math.ceil(facetedCars.length / this.props.carsPerPage)

    return (
      <Container className={styles.app}>
        <Header as="h1">Acme Car Dealership</Header>

        <Header as="h2">Filters:</Header>
        <Filters
          itemConfig={this.props.itemConfig}
          onFilter={this.filter}
          filters={this.state.allFilters}
          appliedFilters={this.state.appliedFilters}
        />

        <Header as="h3">{facetedCars.length} results</Header>
        <InventoryList
          itemConfig={this.props.itemConfig}
          items={facetedPagedCars}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={this.onSort}
          onPageNav={this.onPageNav}
          pages={pages}
          currentPage={currentPage}
        />
      </Container>
    )
  }
}

Inventory.propTypes = {
  data: PropTypes.array,
}

export default Inventory
