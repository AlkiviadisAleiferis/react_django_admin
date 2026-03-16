import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import ObjectActions from "./objectactions";
import { Paginator } from "../list/pagination";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

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
    history_data = history_data || {};

    const total_pages = history_data.total_pages;
    const page = history_data.page;
    const show_paginator = total_pages && page;

    const rows_jsx = history_data.results
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
        <Container fluid className="p-4 fade-in">
            {/* -------- mobile view actions -------- */}
            <Row className="d-md-none object-actions">{<ObjectActions />}</Row>

            <Row className="p-4">
                {/* -------- object history -------- */}
                <Col
                    {...ADMIN_SITE_PREFERENCES.object_content_columns}
                    className={"bg-alt " + ADMIN_SITE_PREFERENCES.object_container_classes}
                    id="object_history"
                >
                    <div className="p-0 me-auto d-flex flex-row justify-content-start">
                        <p className="my-auto mb-4">
                            Total objects: {history_data.total_objects_num || 0}
                        </p>
                    </div>
                    {show_paginator && <Paginator total_pages={total_pages} page={page} />}
                    <Table responsive hover id="list_table" className="mt-4">
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
                    {...ADMIN_SITE_PREFERENCES.object_action_columns}
                    className="d-none d-md-block object-actions"
                >
                    <ObjectActions />
                </Col>
            </Row>
        </Container>
    );
}
