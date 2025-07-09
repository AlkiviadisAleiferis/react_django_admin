import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { JsonToTable } from "react-json-to-table";

import ObjectActions from "./objectactions";
import { Paginator } from "../list/changelist";
import { CONTENT_COLUMNS, ACTIONS_COLS } from "../../settings";

export function ObjectHistory({ history_data }) {
    {
        /* 
        {
            ------------------------------
            "history_data": {
                "results": [
                    {
                        "action_time": str,
                        "user": str,
                        "action": str,
                        "description": str,
                    },
                    ...
                ],
                "page": int,
                "total_pages": int,
                "total_objects_num": int,
            },
            ------------------------------
        }
    */
    }

    /* -------- object_content/actions columns -------- */
    const content_cols = { ...CONTENT_COLUMNS };
    const actions_cols = { ...ACTIONS_COLS };

    const total_pages = history_data ? history_data.total_pages : null;
    const page = history_data ? history_data.page : null;
    const show_paginator = total_pages && page;
    let rows_jsx;

    rows_jsx =
        history_data && history_data.results
            ? history_data.results.map((log, index) => {
                  return (
                      <tr key={`log_entry_${index}`}>
                          <td>{log.action_time}</td>
                          <td>{log.user}</td>
                          <td>{log.action}</td>
                          <td>{log.description}</td>
                      </tr>
                  );
              })
            : null;

    return (
        <>
            {/* -------- mobile view actions -------- */}
            <Row className="d-md-none object-actions">{<ObjectActions />}</Row>

            <Row className="py-4 px-2">
                {/* -------- object history -------- */}
                <Col {...content_cols} className="" id="object_history">
                    <div className="p-0 me-auto d-flex flex-row justify-content-start">
                        <p className="my-auto mb-4">
                            Total objects:{" "}
                            {history_data ? history_data.total_objects_num : 0}
                        </p>
                    </div>
                    {show_paginator && (
                        <Paginator total_pages={total_pages} page={page} />
                    )}
                    <Table
                        responsive
                        hover
                        id="change_list_table"
                        className="mt-4"
                    >
                        <thead>
                            <tr>
                                <th>Date/Time</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>{rows_jsx}</tbody>
                    </Table>
                </Col>

                {/* -------- actions -------- */}
                <Col
                    {...actions_cols}
                    className="d-none d-md-block object-actions"
                >
                    <ObjectActions />
                </Col>
            </Row>
        </>
    );
}
