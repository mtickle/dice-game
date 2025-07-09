

//-- TABLE
import { useTable, usePagination, useSortBy } from 'react-table'

export default function DataTable(columns, data) {

    const generateUUID = () => {
        let
            d = new Date().getTime(),
            d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination,
    )

    return (


        <>
            <table {...getTableProps()} className="table table-striped">

                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key, ...mtHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                        return (
                            <tr key={key} {...mtHeaderGroupProps}>
                                {headerGroup.headers.map(column => {
                                    const { key, ...mtColumn } = column.getHeaderProps()
                                    return (
                                        <th key={key} {...mtColumn}>
                                            {column.render('Header')}
                                        </th>
                                    )
                                })}
                            </tr>
                        )
                    })}

                    {/* {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span></th>
                            ))}
                        </tr>
                    ))} */}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((mtRow, i) => {
                        prepareRow(mtRow)
                        return (<tr key={i}>
                            {mtRow.cells.map(mtCell => {
                                const { key, ...mtCellProps } = mtRow.getRowProps()
                                return <td key={generateUUID()} {...mtCellProps}>
                                    {mtCell.render('Cell')}
                                </td>
                            })}
                        </tr>)
                    })}
                </tbody>
            </table>
            
            <div>
                <button className="btn btn-outline-dark" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button className="btn btn-outline-dark" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button className="btn btn-outline-dark" onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button className="btn btn-outline-dark px-2" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}

                <div className="btn align-baseline">
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </div>
                <div className="btn align-baseline">
                    {' '} Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '75px' }}
                    />
                </div>{' '}Records per page: {' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )


}
