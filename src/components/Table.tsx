import { 
    useReactTable,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router";
import './styles/table.css';

type Source = {
    id: number;
    ra: number;
    dec: number;
    variable: boolean;
}

type Props = {
    sources: Source[];
}

export function Table({sources}: Props) {
    const table = useReactTable({
        data: sources,
        columns: [
            {
                header: 'ID',
                cell: ({row}) => <Link to={`/source/${row.original.id}`}>{row.original.id}</Link>,
                size: 50,
                accessorFn: row => row.id,
                sortingFn: (rowA, rowB) => rowA.original.id < rowB.original.id ? -1 : 1,
            },
            {
                header: 'ra',
                accessorFn: row => row.ra.toFixed(5),
                size: 125,
            },
            {
                header: 'dec',
                accessorFn: row => row.dec.toFixed(5),
                size: 125,
            },
        ],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <table>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                            >
                                {header.isPlaceholder ? null : (
                                    <div
                                        style={{
                                            position: 'relative',
                                            cursor: header.column.getCanSort() ? 'pointer' : 'cursor',
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <span style={{position: 'absolute', right: 5}}>
                                            {{
                                                asc: '▲',
                                                desc: '▼',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </span>
                                    </div>
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
                            <td
                                key={cell.id}
                                style={{ width: `${cell.column.getSize()}px` }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );    
}