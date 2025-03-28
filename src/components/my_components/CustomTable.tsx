import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

export default function CustomTable({
  headers,
  rows,
}: {
  headers: Array<string>
  rows: Array<Array<any>>
}) {
  return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableCell key={"header_" + index}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={"row_" + index}>
                            {row.map((data, dataIndex) => (
                                <TableCell key={dataIndex}>
                                    {typeof data === 'boolean'
                                    ? data ? 'Sí' : 'No'
                                    :data}
                                </TableCell>
                            ))}
                        </TableRow>
                            
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
