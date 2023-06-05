import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Divider,
    Paper
} from "@mui/material";
import { useState } from "react";
import "./index.scss";
export default function Commands(props: { commands: { name: string; type: string; }[]; }) {
    const commands = props.commands as {
        name: string;
        type: string;
    }[];

    const columns = [
        { id: "name", label: "Name", minWidth: 100 },
        { id: "type", label: "Type", minWidth: 100 },
    ];

    const rows = commands;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(commands.length < 10 ? 5:10);

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="commands">
            <h1>Commands</h1>
            <Divider
                sx={{
                    width: "90%",
                    height: "2px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "16px",
                }}
            />
            <Paper className="c"
                sx={{
                   backgroundColor: "transparent",
                }}
            >
                <TableContainer
                    sx={{
                        color: "#fff",
                    }}
                >
                    <Table stickyHeader aria-label="commands">
                        <TableHead
                            sx={{
                                color: "#fff",
                                backgroundColor: "#2f3136",
                            }}
                        >
                            <TableRow
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "#2f3136",
                                    "& .MuiTableCell-root": {
                                        color: "#fff",
                                        backgroundColor: "#2f3136", 
                                        fontWeight: "bold",
                                    },
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="center"
                                        style={{ minWidth: column.minWidth }}
                                        sx={{
                                            color: "#fff",
                                            "& .MuiTableCell-root": {
                                                color: "#fff",
                                                backgroundColor: "#2f3136",
                                            },
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage,
                                )
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.name}
                                            sx={{
                                                "& .MuiTableCell-root": {
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            {columns.map((column) => {
                                                // @ts-ignore
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align="center"
                                                    >
                                                        {
                                                            // @ts-ignore
                                                            column.format &&
                                                            typeof value ===
                                                                "number"
                                                                ? // @ts-ignore
                                                                  column.format(
                                                                      value,
                                                                  )
                                                                : value
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10,20,50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        "& .MuiTablePagination-selectIcon": {
                            color: "#fff",
                        },

                        color: "#fff",
                    }}
                />
            </Paper>
        </div>
    );
}
