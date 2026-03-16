import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LoadingAnimation } from "./loading";
import { List } from "./list/list";
import { ListFilters } from "./list/filters";
import { ACTION_NAME_TO_COMPONENT } from "./actions/mapping";
import { ObjectView } from "./object/objectview";
import { ObjectEdit } from "./object/objectedit";
import { ObjectAdd } from "./object/objectadd";
import { ObjectConfirmDelete } from "./object/objectdelete";
import { ObjectHistory } from "./object/history";
import { PasswordChange } from "./base/change_password";
import BreadCrumbs from "./base/breadcrumbs";
import { Form, useLoaderData, useParams } from "react-router-dom";
import { extra_sections } from "./extra_sections/mapping";

function ListContent(props) {
    const { app_name, model_name } = useParams();
    const { list_data, filters, actions, extra_data, list_max_show_all, sortable_by } =
        useLoaderData();

    let no_data = true;
    let fields = [];

    if (list_data && list_data.results && list_data.results.length > 0) {
        fields = Object.keys(list_data.results[0]);
        no_data = false;
    }

    const AboveListFiltersSection = extra_sections.list.above_list[`${app_name}__${model_name}`];

    return (
        <>
            <BreadCrumbs />

            {AboveListFiltersSection && (
                <AboveListFiltersSection
                    results={list_data.results}
                    fields={fields}
                    no_data={no_data}
                    extra_data={extra_data}
                />
            )}

            <ListFilters filters={filters} />

            <List
                results={list_data.results}
                fields={fields}
                no_data={no_data}
                page={list_data.page}
                total_pages={list_data.total_pages}
                total_objects_num={list_data.total_objects_num}
                list_max_show_all={list_max_show_all}
                sortable_by={sortable_by}
                actions={actions}
                extra_data={extra_data}
            />
        </>
    );
}

function ListActionContent(props) {
    const { app_name, model_name, action_name } = useParams();

    const action_data = useLoaderData();

    /*
    action_data:
        {
            "name": str,
            "description": str,
            ------------------
            **anything**
        }
    */
    if (!action_data) {
        return (
            <>
                <BreadCrumbs />
            </>
        );
    }

    const action_verbose_name = action_data.name;

    /*
    in order to provide you own component
    for each specific action
    user the codenmae: {app_name}_{model_name}_{action_name}
    inside the override.ACTION_NAME_TO_COMPONENT
    */
    let ActionComponent = null;

    if (action_name === "delete_selected") {
        ActionComponent = ACTION_NAME_TO_COMPONENT["delete_selected"];
    }

    const override_action_name = `${app_name}__${model_name}__${action_name}`;

    if (override_action_name in ACTION_NAME_TO_COMPONENT) {
        ActionComponent = ACTION_NAME_TO_COMPONENT[override_action_name];
    } else {
        ActionComponent = ACTION_NAME_TO_COMPONENT["_"];
    }

    return (
        <>
            <BreadCrumbs />

            <Row className="p-5">
                <Col className="p-4 rounded bg-alt">
                    <h5>
                        <b>{action_verbose_name && action_verbose_name}</b>
                    </h5>

                    <Form method="post" id="action_execute_form">
                        <ActionComponent action_data={action_data} />
                    </Form>
                </Col>
            </Row>
        </>
    );
}

function ObjectViewContent(props) {
    const { object_repr, object, fieldsets, permissions, inlines, extra_data } = useLoaderData();

    // -------------- structure --------------
    {
        /* 
        ------------------------------
        object_repr = str
        ------------------------------
        "object": {
            fieldname : {
                type: str, 
                value: ...,
                help_text: str
            },
            ...
        },
        ------------------------------
        fieldsets = [
            [
                "fieldset-name",
                {
                    "fields": [...]
                }
            ]
        ]
        ------------------------------
        "permissions": 
            {
                "view": boolean,
                "change": boolean,
                "delete": boolean,
                "history": boolean,
            }
        ------------------------------
        "inlines": {
            "app":str,
            "model": str,
            "label": str,
            "objects": [object, ...]"
        }
        ------------------------------
        "extra_data": **anything**,
        ------------------------------
    */
    }

    return (
        <>
            <BreadCrumbs object_repr={object_repr} />

            <ObjectView
                object={object}
                fieldsets={fieldsets}
                permissions={permissions}
                inlines={inlines}
                extra_data={extra_data}
            />
        </>
    );
}

function ObjectEditContent(props) {
    const { object_repr, app, model, fieldsets, readonly_fields, fields, inlines, extra_data } =
        useLoaderData();

    // -------------- structure --------------
    {
        /* 
        ------------------------------
        object_repr = str
        ------------------------------
        app = str
        ------------------------------
        model = str
        ------------------------------
        fieldsets = [
            [
                "fieldset-name",
                {
                    "fields": [...]
                }
            ]
        ]
        ------------------------------
        "readonly_fields": {fieldname: field_data, ...},
        ------------------------------
        "fields": {fieldname: field_data, ...},
        ------------------------------
        "inlines": [{
            app: str,
            model: str,
            label: str,
            forms: [formdata]
        }, ...],
        ------------------------------
        "extra_data": **anything**
        ------------------------------
    */
    }

    return (
        <>
            <BreadCrumbs object_repr={"Edit " + object_repr} />

            <ObjectEdit
                app={app}
                model={model}
                fieldsets={fieldsets}
                readonly_fields={readonly_fields}
                fields={fields}
                inlines={inlines}
                extra_data={extra_data}
            />
        </>
    );
}

function ObjectAddContent(props) {
    const { app, model, fieldsets, readonly_fields, fields, inlines, extra_data } = useLoaderData();

    return (
        <>
            <BreadCrumbs object_repr={"Add new record"} />

            <ObjectAdd
                app={app}
                model={model}
                fieldsets={fieldsets}
                readonly_fields={readonly_fields}
                fields={fields}
                inlines={inlines}
                extra_data={extra_data}
            />
        </>
    );
}

function ObjectConfirmDeleteContent(props) {
    const {
        object_repr,
        permissions,
        deleted_objects,
        model_count,
        perms_needed,
        protected_,
        extra_data
    } = useLoaderData();
    return (
        <>
            <BreadCrumbs object_repr={object_repr} />

            <ObjectConfirmDelete
                object_repr={object_repr}
                deleted_objects={deleted_objects}
                model_count={model_count}
                perms_needed={perms_needed}
                protected_={protected_}
                extra_data={extra_data}
            />
        </>
    );
}

function ObjectHistoryContent(props) {
    const { object_repr, history_data } = useLoaderData();
    return (
        <>
            <BreadCrumbs object_repr={object_repr} />

            <ObjectHistory object_repr={object_repr} history_data={history_data} />
        </>
    );
}

function PasswordChangeContent(props) {
    return (
        <>
            <BreadCrumbs />
            <PasswordChange />
        </>
    );
}

function LoaderContent(props) {
    return (
        <Row className="w-100 h-100 align-items-center justify-content-center text-center">
            <Col xs="12" lg="4" xl="2">
                <LoadingAnimation />
            </Col>
        </Row>
    );
}

export {
    ListContent,
    ListActionContent,
    ObjectViewContent,
    ObjectEditContent,
    ObjectAddContent,
    ObjectConfirmDeleteContent,
    PasswordChangeContent,
    ObjectHistoryContent,
    LoaderContent
};
