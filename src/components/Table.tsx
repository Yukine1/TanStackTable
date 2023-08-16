import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ReactTableProps } from '../table-prefs/table-cfg.ts';
import './Table.css';
import { getMovies } from '../table-prefs/movies.ts';

export const Table = <T extends object>({
  data,
  setData,
  moviesInfo,
  columns,
  showNavigation = true,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const extractPageNumber = (s: string): number | null => {
    const match = s.match(/titles\?page=(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const nextPage = extractPageNumber(moviesInfo.next);
  const prevPage = nextPage ? nextPage - 2 : null;

  const loadFirstPage = async () => {
    try {
      const newData = await getMovies('1');
      if (newData) {
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to load first page', error);
    }
  };

  const loadPreviousPage = async () => {
    if (nextPage !== 1 && nextPage) {
      const prevPageNumber = nextPage - 2;
      if (prevPageNumber) {
        try {
          const newData = await getMovies(prevPageNumber.toString());
          if (newData) {
            setData(newData);
          }
        } catch (error) {
          console.error('Failed to load previous page', error);
        }
      }
    }
  };

  const loadNextPage = async () => {
    if (nextPage) {
      try {
        const newData = await getMovies(nextPage.toString());
        if (newData) {
          setData(newData);
        }
      } catch (error) {
        console.error('Failed to load next page', error);
      }
    }
  };

  const loadLastPage = async () => {
    const lastPageNumber = 100;
    try {
      const newData = await getMovies(lastPageNumber.toString());
      if (newData) {
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to load last page', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showNavigation ? (
        <>
          <div>
            <div>
              <button
                onClick={() => {
                  loadFirstPage();
                  table.setPageIndex(0);
                }}
                disabled={!prevPage}
              >
                {'<<'}
              </button>
              <button
                onClick={() => {
                  loadPreviousPage();
                  table.previousPage();
                }}
                // disabled={!table.getCanPreviousPage()}
                disabled={!prevPage}
              >
                {'<'}
              </button>
              <button
                onClick={() => {
                  loadNextPage();
                  table.nextPage();
                }}
                disabled={!nextPage}
              >
                {'>'}
              </button>
              <button
                onClick={() => {
                  loadLastPage();
                  table.setPageIndex(table.getPageCount() - 1);
                }}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
              <span>
                <div>
                  Page{' '}
                  <strong>
                    {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </strong>
                </div>
              </span>
              <span>
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Table;
