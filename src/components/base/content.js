import { ChangeListTable, ChangeListFilters } from "../list/changelist";
import { ACTION_NAME_TO_COMPONENT } from "../actions/mapping";
import { PreviewObject } from "../object/objectpreview";
import { ObjectEdit } from "../object/objectedit";
import { ObjectAdd } from "../object/objectadd";
import { ObjectConfirmDelete } from "../object/objectdelete";
import { ObjectHistory } from "../object/history";
import { PasswordChange } from "../base/change_password";
import BreadCrumbs from "../base/breadcrumbs";
import { Form, useLoaderData, useParams } from "react-router-dom";
import { getCache } from "../../api/cache";
import {
    check_model_add_permission,
} from "../../utils";
import { get_above_list_filters_section } from "../extra_sections/list";

function ListContent(props) {
    const { app_name, model_name } = useParams();
    const { list_data, filters, actions, list_extra_data } = useLoaderData();

    let no_data = true;
    let fields = [];

    if (list_data && list_data.results && list_data.results.length > 0) {
        fields = Object.keys(list_data.results[0]);
        no_data = false;
    }

    const cached_base_info = getCache("base_info");
    const can_add = check_model_add_permission(cached_base_info, model_name);
    const AboveListFiltersSection = get_above_list_filters_section(app_name, model_name);

    return (
        <>
            <BreadCrumbs can_add={can_add} />

            <AboveListFiltersSection results={list_data.results} fields={fields} no_data={no_data} can_add={can_add} list_extra_data={list_extra_data}/>
            <ChangeListFilters filters={filters} />

            <ChangeListTable
                results={list_data.results}
                fields={fields}
                no_data={no_data}
                page={list_data.page}
                total_pages={list_data.total_pages}
                total_objects_num={list_data.total_objects_num}
                list_max_show_all={list_data.list_max_show_all}
                actions={actions}
            />
        </>
    );
}

function ListActionContent(props) {
    const { app_name, model_name, action_name } = useParams();
    const action_data = useLoaderData();

    if (!action_data) {
        return (
            <>
                <BreadCrumbs />
            </>
        );
    }

    const action_verbose_name = action_data.name;

    const ActionComponent = ACTION_NAME_TO_COMPONENT.hasOwnProperty(action_name)
        ? ACTION_NAME_TO_COMPONENT[action_name]
        : ACTION_NAME_TO_COMPONENT["_"];

    return (
        <>
            <BreadCrumbs />

            <h5>
                <b>{action_verbose_name && action_verbose_name}</b>
            </h5>

            <Form method="post" id="object-delete-form">
                <ActionComponent action_data={action_data} />
            </Form>
        </>
    );
}

function ObjectPreviewContent(props) {
    const { object, object_repr, fieldsets, permissions, inlines } =
        useLoaderData();

    // -------------- structure --------------
    {
        /* 
        messages = []
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
        object_repr = str
        ------------------------------
        "permissions": 
            {
                "view": boolean,
                "change": boolean,
                "delete": boolean,
            }
        ------------------------------
        "inlines": {
            "app":str,
            "model": str,
            "label": str,
            "objects": [object, ...]"
        }
        ------------------------------
    */
    }

    return (
        <>
            <BreadCrumbs object_repr={object_repr} />

            <PreviewObject
                object={object}
                fieldsets={fieldsets}
                permissions={permissions}
                inlines={inlines}
            />
        </>
    );
}

function ObjectEditContent(props) {
    const {
        app,
        model,
        object_repr,
        fieldsets,
        readonly_fields,
        fields,
        inlines,
    } = useLoaderData();

    // -------------- structure --------------
    {
        /* 
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
            />
        </>
    );
}

function ObjectAddContent(props) {
    const { app, model, fieldsets, readonly_fields, fields, inlines } =
        useLoaderData();

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
    } = useLoaderData();
    return (
        <>
            <BreadCrumbs object_repr={object_repr} />

            <ObjectConfirmDelete
                object_repr={object_repr}
                permissions={permissions}
                deleted_objects={deleted_objects}
                model_count={model_count}
                perms_needed={perms_needed}
                protected_={protected_}
            />
        </>
    );
}

function ObjectHistoryContent(props) {
    const {
        object_repr,
        history_data,
    } = useLoaderData();
    return (
        <>
            <BreadCrumbs object_repr={object_repr} />

            <ObjectHistory
                object_repr={object_repr}
                history_data={history_data}
            />
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

/*

function CustomViewContent(props) {
    const { data } = useLoaderData();
    const { custom_view_name } = useParams();
    return (
        <>
            <BreadCrumbs can_add={false} />
            <CustomView data={data} custom_view_name={custom_view_name} />
        </>
    );
}

*/

export {
    ListContent,
    ListActionContent,
    ObjectPreviewContent,
    ObjectEditContent,
    ObjectAddContent,
    ObjectConfirmDeleteContent,
    PasswordChangeContent,
    ObjectHistoryContent
};
