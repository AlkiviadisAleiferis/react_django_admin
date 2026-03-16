import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { augment_query_string, get_query_param_value } from "../../utils";
import { Link, useParams } from "react-router-dom";
import { Headers } from "./headers";
import { ActionSelectRow } from "./actions";
import { Paginator } from "./pagination";
import { SITE_PATH, ADMIN_SITE_PREFERENCES } from "../../settings";

function ShowAll({ list_max_show_all, total_objects_num }) {
    let show_all = false;

    if (list_max_show_all && total_objects_num) {
        show_all = list_max_show_all >= total_objects_num && get_query_param_value("all") === null;
    }

    return show_all ? (
        <Link to={augment_query_string("all", "")} className="btn btn-outline-primary my-auto mx-3">
            Show all
        </Link>
    ) : null;
}

function TableRowValue({ item, fieldname }) {
    return (
        <td>
            <span
                dangerouslySetInnerHTML={{
                    __html: item[fieldname]
                }}
            />
        </td>
    );
}

function ObjectViewLink({ app_name, model_name, pk }) {
    const object_url = SITE_PATH.object_view(app_name, model_name, pk);
    return (
        <td>
            <Link to={object_url} className="link-underline link-underline-opacity-0">
                {ADMIN_SITE_PREFERENCES.object_view_link_icon()}
            </Link>
        </td>
    );
}

function TableRow({ item, fields, app_name, model_name }) {
    return (
        <tr>
            {/* This is the checkbox 
            for the list actions */}
            <ActionSelectRow item={item} />

            {/* Actual data */}
            {fields.map(function (fieldname) {
                return (
                    <TableRowValue
                        item={item}
                        fieldname={fieldname}
                        key={`${fieldname}_${item.pk}`}
                    />
                );
            })}

            {/* View Link */}
            <ObjectViewLink app_name={app_name} model_name={model_name} pk={item.pk} />
        </tr>
    );
}

export function ListTable({
    results,
    fields,
    list_max_show_all,
    total_objects_num,
    total_pages,
    page,
    sortable_by
}) {
    /* 
    results = [
        {"field1": value, "field2": value, ..., "pk": value},
        ...
    ]
    */
    const { app_name, model_name } = useParams();

    // ------- filter out pk -------
    fields = fields ? fields.filter(f => f != "pk") : fields;

    // ------- table -------
    const rows_jsx =
        results && results.length
            ? results.map(item => (
                  <TableRow
                      item={item}
                      fields={fields}
                      app_name={app_name}
                      model_name={model_name}
                      key={"list_item_" + item.pk}
                  />
              ))
            : null;

    return rows_jsx ? (
        <Row className="p-5">
            <Col xs="12" className="mb-3 pt-2 pb-4 rounded shadow border bg-alt">
                <Table responsive hover id="list_table">
                    <thead>
                        <Headers fields={fields} sortable_by={sortable_by} />
                    </thead>
                    <tbody>{rows_jsx}</tbody>
                </Table>
            </Col>

            <Col className="mb-3 d-flex flex-row">
                <div className="p-0 me-auto d-flex flex-row">
                    <p className="my-auto">Total objects: {total_objects_num}</p>
                    <ShowAll
                        list_max_show_all={list_max_show_all}
                        total_objects_num={total_objects_num}
                    />
                </div>
                <Paginator total_pages={total_pages} page={page} />
            </Col>
        </Row>
    ) : (
        <Row className="p-4 w-100 text-center">No data found</Row>
    );
}
