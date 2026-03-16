import { Link } from "react-router-dom";
import { get_input_id, get_input_name, get_related_input_id } from "./field_inputs";
import { AddRelatedModal } from "../addrelated";
import { fields_inputs_map, fields_values_map } from "./mapping";
import { DefaultTextField } from "./field_values";
import { SITE_PATH, ADMIN_SITE_PREFERENCES } from "../../../settings";

export function build_field_input(app, model, field, fieldname, prefix) {
    const input_id = get_input_id(fieldname, prefix);
    const input_name = get_input_name(fieldname, prefix);
    const required = field.required && !prefix;

    if (field.type == "hidden") {
        return (
            <fields_inputs_map.HiddenField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "TimeField") {
        return (
            <fields_inputs_map.TimeField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "DateField") {
        return (
            <fields_inputs_map.DateField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "DateTimeField") {
        return (
            <fields_inputs_map.DateTimeField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "SplitDateTimeField") {
        return (
            <fields_inputs_map.SplitDateTimeField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "SlugField") {
        return (
            <fields_inputs_map.SlugField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "CharField") {
        return (
            <fields_inputs_map.CharField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "UUIDField") {
        return (
            <fields_inputs_map.UUIDField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "TextField") {
        return (
            <fields_inputs_map.TextField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
                rows={field.rows}
                cols={field.cols}
            />
        );
    } else if (field.type == "JSONFormField") {
        return (
            <fields_inputs_map.JSONFormField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
                rows={field.rows}
                cols={field.cols}
            />
        );
    } else if (field.type == "JSONField") {
        return (
            <fields_inputs_map.JSONField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
                rows={field.rows}
                cols={field.cols}
            />
        );
    } else if (field.type == "ArrayField") {
        return (
            <fields_inputs_map.ArrayField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
                rows={field.rows}
                cols={field.cols}
            />
        );
    } else if (field.type == "FileField") {
        return (
            <fields_inputs_map.FileField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "ImageField") {
        return (
            <fields_inputs_map.ImageField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "URLField") {
        return (
            <fields_inputs_map.URLField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "EmailField") {
        return (
            <fields_inputs_map.EmailField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "FloatField") {
        return (
            <fields_inputs_map.FloatField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "ModelChoiceField") {
        const field_id = get_related_input_id(fieldname, app, model, prefix);

        let side_action_view = null;
        let side_action_add = null;

        // view side action

        if (field.permissions.view || field.permissions.change) {
            if (field.initial) {
                side_action_view = (
                    <Link
                        to={SITE_PATH.object_view(field.app, field.model, field.initial.value)}
                        className="ms-3"
                        id={`${field_id}_action_view`}
                        target="_blank"
                    >
                        {ADMIN_SITE_PREFERENCES.object_view_link_icon(
                            `${field_id}_action_view_icon`
                        )}
                    </Link>
                );
            } else {
                side_action_view = (
                    <Link
                        to="javascript:void(0)"
                        className="ms-3"
                        id={`${field_id}_action_view`}
                        target="_blank"
                    >
                        {ADMIN_SITE_PREFERENCES.object_view_link_icon(
                            `${field_id}_action_view_icon`
                        )}
                    </Link>
                );
            }
        }

        // add side action

        if (field.permissions.add) {
            side_action_add = (
                <AddRelatedModal
                    app={app}
                    model={model}
                    fieldname={fieldname}
                    field={field}
                    prefix={prefix}
                />
            );
        }

        let related_field = null;

        if (field.autocomplete) {
            related_field = (
                <fields_inputs_map.AutocompleteField
                    required={required}
                    app={app}
                    model={model}
                    field={field}
                    fieldname={fieldname}
                    prefix={prefix}
                    className="w-75"
                />
            );
        } else {
            related_field = (
                <fields_inputs_map.ModelChoiceField
                    required={required}
                    app={app}
                    model={model}
                    field={field}
                    fieldname={fieldname}
                    prefix={prefix}
                    className="w-75"
                />
            );
        }

        return (
            <>
                <div className="d-flex flex-row align-items-center w-100">
                    <div className="d-flex flex-row align-items-center w-75">{related_field}</div>
                    <div className="d-flex flex-row align-items-center w-25">
                        {side_action_view}
                        {side_action_add}
                    </div>
                </div>
            </>
        );
    } else if (field.type == "ModelMultipleChoiceField") {
        return (
            <fields_inputs_map.ModelMultipleChoiceField
                required={required}
                initial={field.initial}
                choices={field.choices}
                id={input_id}
                name={input_name}
                fieldname={fieldname}
            />
        );
    } else if (field.type == "DecimalField") {
        return (
            <fields_inputs_map.DecimalField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "IntegerField") {
        return (
            <fields_inputs_map.IntegerField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "BooleanField") {
        return (
            <fields_inputs_map.BooleanField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type == "NullBooleanField") {
        return (
            <fields_inputs_map.NullBooleanField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else if (field.type === "ChoiceField") {
        return (
            <fields_inputs_map.ChoiceField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
                fieldname={fieldname}
                choices={field.choices}
            />
        );
    } else if (field.type === "TypedChoiceField") {
        return (
            <fields_inputs_map.TypedChoiceField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
                fieldname={fieldname}
                choices={field.choices}
            />
        );
    } else if (field.type === "InlineForeignKeyField") {
        return (
            <fields_inputs_map.InlineForeignKeyField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    } else {
        return (
            <fields_inputs_map.CharField
                required={required}
                initial={field.initial}
                id={input_id}
                name={input_name}
            />
        );
    }
}

export function build_field_value(field) {
    if (field === null) {
        return <p className="m-0 p-0">{"-"}</p>;
    }

    if (field.type in fields_values_map) {
        const FieldValue = fields_values_map[field.type];
        return <FieldValue field={field} />;
    } else {
        return <DefaultTextField field={field} />;
    }
}
