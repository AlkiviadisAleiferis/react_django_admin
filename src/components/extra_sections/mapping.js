import { above_list_filters } from "./list/above_list_filters";

import { below_object_view_actions } from "./objectview/below_object_actions";
import { below_object_view_form } from "./objectview/below_object_form";

import { below_object_edit_actions } from "./objectedit/below_object_actions";
import { below_object_edit_form } from "./objectedit/below_object_form";

import { below_object_add_actions } from "./objectadd/below_object_actions";
import { below_object_add_form } from "./objectadd/below_object_form";

import { below_object_delete_actions } from "./objectdelete/below_object_actions";
import { below_object_delete_form } from "./objectdelete/below_object_form";

export const extra_sections = {
    list: {
        above_list: {
            ...above_list_filters
        }
    },
    object: {
        view: {
            below_form: {
                ...below_object_view_form
            },
            below_actions: {
                ...below_object_view_actions
            }
        },
        add: {
            below_form: {
                ...below_object_add_form
            },
            below_actions: {
                ...below_object_add_actions
            }
        },
        edit: {
            below_form: {
                ...below_object_edit_form
            },
            below_actions: {
                ...below_object_edit_actions
            }
        },
        delete: {
            below_form: {
                ...below_object_delete_form
            },
            below_actions: {
                ...below_object_delete_actions
            }
        }
    }
};
