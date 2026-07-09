import PropTypes from "prop-types";

export default function Table({

    columns = [],

    data = [],

    loading = false,

    emptyMessage = "No hay registros disponibles.",

    striped = true,

    hover = true,

    bordered = false,

    compact = false,

    className = "",

}) {

    return (

        <div className={`table-responsive ${className}`}>

            <table
                className={`
                    table
                    ${striped ? "table-striped" : ""}
                    ${hover ? "table-hover" : ""}
                    ${bordered ? "table-bordered" : ""}
                    ${compact ? "table-compact" : ""}
                `}
            >

                <thead>

                    <tr>

                        {

                            columns.map((column) => (

                                <th
                                    key={column.key}
                                >

                                    {column.title}

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        loading ? (

                            <tr>

                                <td
                                    colSpan={columns.length}
                                    className="table-loading"
                                >

                                    Cargando...

                                </td>

                            </tr>

                        ) : data.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={columns.length}
                                    className="table-empty"
                                >

                                    {emptyMessage}

                                </td>

                            </tr>

                        ) : (

                            data.map((row, index) => (

                                <tr
                                    key={row.id ?? index}
                                >

                                    {

                                        columns.map((column) => (

                                            <td
                                                key={column.key}
                                            >

                                                {

                                                    column.render

                                                        ? column.render(row)

                                                        : row[column.key]

                                                }

                                            </td>

                                        ))

                                    }

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

Table.propTypes = {

    columns: PropTypes.array.isRequired,

    data: PropTypes.array,

    loading: PropTypes.bool,

    emptyMessage: PropTypes.string,

    striped: PropTypes.bool,

    hover: PropTypes.bool,

    bordered: PropTypes.bool,

    compact: PropTypes.bool,

    className: PropTypes.string,

};