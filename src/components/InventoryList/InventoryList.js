import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './InventoryList.module.css'

import { Table, Menu, Icon } from 'semantic-ui-react'

class InventoryList extends Component {
  render() {
    const { itemConfig, items, sortColumn, sortDirection, onSort } = this.props

    return (
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            {itemConfig.map(heading => (
              <Table.HeaderCell
                sorted={(heading.sortable && sortColumn === heading.key) ? sortDirection : null}
                onClick={() => heading.sortable && onSort(heading.key)}
              >
                {heading.name ? heading.name : <span className={styles.capitalize}>{heading.key}</span>}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items.map(row => {
            return <Table.Row key={row.id || row._id}>
              {itemConfig.map(spec => {
                let val = row[spec.key]
                val = spec.format ? spec.format(val) : val
                return <Table.Cell>{val}</Table.Cell>
              })}
            </Table.Row>
          })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={itemConfig.length}>
              <Menu floated='right' pagination>
                <Menu.Item as='a' icon>
                  <Icon name='chevron left' />
                </Menu.Item>
                <Menu.Item as='a'>1</Menu.Item>
                <Menu.Item as='a'>2</Menu.Item>
                <Menu.Item as='a'>3</Menu.Item>
                <Menu.Item as='a'>4</Menu.Item>
                <Menu.Item as='a' icon>
                  <Icon name='chevron right' />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }
}

InventoryList.propTypes = {
  // data: PropTypes.array
}

export default InventoryList
