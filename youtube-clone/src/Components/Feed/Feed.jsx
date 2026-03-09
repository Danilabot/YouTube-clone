import './Feed.css'
import { Grid, AutoSizer, WindowScroller } from 'react-virtualized'
import { useCallback } from 'react'
import { Loader } from '../../UI/Loader/Loader'
import GridCell from './GridCell'

const CARD_HEIGHT = 403
const COLUMN_GAP = 16
const ROW_GAP = 30

// Гибридная логика колонок 
const getColumnCount = (width) => {
  if (width >= 2000) return 4
  if (width >= 1024) return 3
  if (width >= 768) return 2
  return 1

}

const Feed = ({ data }) => {
  if (!data || data.length === 0) {
    return <Loader />
  }

  // cellRenderer НЕ зависит от columnCount напрямую
  const cellRenderer = useCallback(
    ({ columnIndex, rowIndex, key, style, columnCount }) => {
      const index = rowIndex * columnCount + columnIndex
      if (index >= data.length) return null

      return (
        <GridCell
          key={key}
          item={data[index]}
          style={style}
          columnGap={COLUMN_GAP}
          rowGap={ROW_GAP}
        />
      )
    },
    [data],
  )

  return (
    <div >
      <WindowScroller>
        {({ height, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => {
              const columnCount = getColumnCount(width)
              const totalGaps = (columnCount - 1) * COLUMN_GAP
              const columnWidth = (width - totalGaps) / columnCount
              const rowCount = Math.ceil(data.length / columnCount)

              return (
                <Grid
                key={columnCount}
                  autoHeight
                  height={height}
                  scrollTop={scrollTop}
                  width={width}
                  columnCount={columnCount}
                  rowCount={rowCount}
                  columnWidth={columnWidth}
                  rowHeight={CARD_HEIGHT + ROW_GAP}
                  cellRenderer={(props) =>
                    cellRenderer({ ...props, columnCount })
                  }
                  overscanRowCount={2}
                />
              )
            }}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  )
}

export default Feed
