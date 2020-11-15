import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './InventoryList.module.css'

import { Table, Menu, Icon } from 'semantic-ui-react'

class InventoryList extends Component {
  render() {
    const {
      itemConfig,
      items,
      sortColumn,
      sortDirection,
      onSort,
      onPageNav,
      pages,
      currentPage,
    } = this.props
    let menuItems = []

    // populate menu items
    for (let i = 1; i <= pages; i++) {
      menuItems.push(
        <Menu.Item
          key={i}
          active={currentPage === i}
          onClick={(_e, data) => currentPage !== i && onPageNav(data.children)}
        >
          {i}
        </Menu.Item>
      )
    }

    const pageRow = (
      <Table.Row>
        <Table.HeaderCell colSpan={itemConfig.length}>
          <Menu floated="right" pagination>
            <Menu.Item
              key="L"
              icon
              disabled={currentPage === 1}
              onClick={() => onPageNav(currentPage - 1)}
            >
              <Icon name="chevron left" />
            </Menu.Item>

            {menuItems}

            <Menu.Item
              key="R"
              icon
              disabled={currentPage === pages}
              onClick={() => onPageNav(currentPage + 1)}
            >
              <Icon name="chevron right" />
            </Menu.Item>
          </Menu>
        </Table.HeaderCell>
      </Table.Row>
    )

    return (
      <Table sortable celled fixed>
        <Table.Header>
          {pages && pages > 1 ? pageRow : null}
          <Table.Row>
            {itemConfig.map(heading => (
              <Table.HeaderCell
                key={heading.key}
                sorted={heading.sortable && sortColumn === heading.key ? sortDirection : null}
                onClick={() => heading.sortable && onSort(heading.key)}
              >
                {heading.name ? (
                  heading.name
                ) : (
                  <span className={styles.capitalize}>{heading.key}</span>
                )}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items.map(row => {
            return (
              <Table.Row key={row._id}>
                {itemConfig.map(spec => {
                  let val = row[spec.key]
                  val = spec.format ? spec.format(val) : val
                  return <Table.Cell key={`${row._id}_${spec.key}`}>{val}</Table.Cell>
                })}
              </Table.Row>
            )
          })}
        </Table.Body>

        {pages && pages > 1 ? <Table.Footer>{pageRow}</Table.Footer> : null}
      </Table>
    )
  }
}

InventoryList.propTypes = {
  itemConfig: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.oneOf(['ascending', 'descending']),
  onSort: PropTypes.func,
  onPageNav: PropTypes.func,
  pages: PropTypes.number,
  currentPage: PropTypes.number,
}

export default InventoryList
