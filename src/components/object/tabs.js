import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { build_object_fieldsets_tabs } from "./fields/fieldsets";
import { build_inline_tabs } from "./inlines/utils";

import { ReadonlyStackedFieldset } from "./fields/fieldsets";
import { ReadonlyTabularInline } from "./inlines/inlines";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

export function EdititableObjectTabs({
    fieldsets,
    app,
    model,
    fields,
    readonly_fields,
    inlines,
    action_error_data
}) {
    action_error_data = action_error_data || {};

    const error_data = action_error_data.error_data;
    const inlines_error_data = action_error_data.inlines_error_data;

    const fieldsets_tabs_jsx = build_object_fieldsets_tabs(
        fieldsets,
        app,
        model,
        fields,
        readonly_fields,
        error_data
    );

    const inline_tabs_jsx = build_inline_tabs(inlines, inlines_error_data);

    return (
        <Tabs
            transition={true}
            id="object_tabs"
            className={ADMIN_SITE_PREFERENCES.object_tabs_classes}
        >
            {fieldsets_tabs_jsx}
            {inline_tabs_jsx}
        </Tabs>
    );
}

export function ReadonlyObjectTabs({ fieldsets, object, inlines }) {
    const fieldsets_tabs_jsx = fieldsets.map(function (fieldset, index) {
        const tab_title = fieldset[0] || "General";
        const fieldnames = fieldset[1].fields;

        return (
            <Tab eventKey={"fieldset_" + index} title={tab_title} key={"fieldset_" + index}>
                <ReadonlyStackedFieldset fieldnames={fieldnames} object={object} />
            </Tab>
        );
    });

    inlines = inlines || [];

    const inlines_tabs_jsx = inlines.map(function (inline) {
        const tab_title = inline.label;
        const tab_name = tab_title.toLowerCase().replace(" ", "_");

        return (
            <Tab eventKey={"inline_" + tab_name} title={tab_title} key={"inline_" + tab_name}>
                <ReadonlyTabularInline inline={inline} />
            </Tab>
        );
    });

    return (
        <Tabs
            transition={true}
            id="object_view_tabs"
            className={ADMIN_SITE_PREFERENCES.object_tabs_classes}
        >
            {fieldsets_tabs_jsx}
            {inlines_tabs_jsx}
        </Tabs>
    );
}
