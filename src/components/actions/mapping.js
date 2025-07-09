import { DeleteAction } from "./delete_selected";
import { DefaultPreviewAction } from "./default";
import { ACTION_NAME_TO_COMPONENT_OVERRIDE } from "./overriding";
/* 
This file serves as a mapping
between the action_name
and the corresponding component.

Serves to resolve different structured actions.

A default action template is provided.
*/
export const ACTION_NAME_TO_COMPONENT = {
    delete_selected: DeleteAction,
    _: DefaultPreviewAction,
    ...ACTION_NAME_TO_COMPONENT_OVERRIDE
};
