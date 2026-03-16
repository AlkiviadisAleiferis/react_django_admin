import { Form as RouterForm } from "react-router-dom";
import { Actions } from "./actions";
import { ListTable } from "./table";

/* 
ListTable uses all the above to render
*/
function List({
    results,
    fields,
    actions,
    list_max_show_all,
    sortable_by,
    extra_data,
    total_objects_num,
    total_pages,
    page
}) {
    // ------- props data structure -------
    // {
    //     "results": serializer.data,
    //     "page": cl.page_num,
    //     "total_pages": cl.paginator.num_pages,
    //     "total_objects_num": cl.paginator.count,
    // }

    return (
        /* 
        Form is placed up here
        because there are inputs
        both at the Actions and ListTable
        */
        <RouterForm
            id="actions_form"
            method="post"
            fluid="true"
            className="p-0 m-0 fade-in"
            encType={"multipart/form-data"}
        >
            <Actions actions={actions} total_objects_num={total_objects_num} />

            <ListTable
                results={results}
                fields={fields}
                list_max_show_all={list_max_show_all}
                total_objects_num={total_objects_num}
                total_pages={total_pages}
                page={page}
                sortable_by={sortable_by}
            />
        </RouterForm>
    );
}

export { List };
