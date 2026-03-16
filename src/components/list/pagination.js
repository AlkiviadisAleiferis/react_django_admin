import { Link } from "react-router-dom";

export function Paginator({ total_pages, page }) {
    if (!(total_pages && page)) {
        return null;
    }

    let initial_pages = [...Array(total_pages).keys()];
    let pages;
    let previous_page;
    let previous_page_num;
    let next_page;
    let next_page_num;
    let pages_html;

    if (total_pages > 1) {
        if (total_pages > 6) {
            if (page < 4) {
                pages = [1, 2, 3, 4, null, initial_pages.length];
            } else if (page > initial_pages.length - 2) {
                pages = [
                    1,
                    null,
                    initial_pages.length - 2,
                    initial_pages.length - 1,
                    initial_pages.length
                ];
            } else {
                pages = [1, null, page - 1, page, page + 1, null, initial_pages.length];
            }
        } else {
            pages = initial_pages.map(page => page + 1);
        }

        // find existing parameters in URL
        // to include them in pagination link
        let url_params = new URLSearchParams(window.location.search);
        if (url_params.has("p")) {
            url_params.delete("p");
        }
        let existing_query_string;
        if (url_params.toString()) {
            existing_query_string = "?" + url_params.toString() + "&p=";
        } else {
            existing_query_string = "?p=";
        }

        // previous / next pages html
        if (page == 1) {
            next_page_num = page + 1;

            previous_page = null;
            next_page = (
                <>
                    <li className="page-item next">
                        <Link className="page-link" to={existing_query_string + next_page_num}>
                            »
                        </Link>
                    </li>
                </>
            );
        } else if (page == initial_pages.length) {
            previous_page_num = page - 1;

            previous_page = (
                <>
                    <li className="page-item previous">
                        <Link className="page-link" to={existing_query_string + previous_page_num}>
                            «
                        </Link>
                    </li>
                </>
            );
            next_page = null;
        } else {
            previous_page_num = page - 1;
            next_page_num = page + 1;

            previous_page = (
                <>
                    <li className="page-item previous">
                        <Link className="page-link" to={existing_query_string + previous_page_num}>
                            «
                        </Link>
                    </li>
                </>
            );
            next_page = (
                <>
                    <li className="page-item next">
                        <Link className="page-link" to={existing_query_string + next_page_num}>
                            »
                        </Link>
                    </li>
                </>
            );
        }

        // intermediate pages html
        pages_html = pages.map((item, index) =>
            item ? (
                <li className="page-item" key={"page_" + index}>
                    <Link
                        to={existing_query_string + item}
                        className={item === page ? "page-link active" : "page-link"}
                    >
                        {item}
                    </Link>
                </li>
            ) : (
                <li className="page-item" key={"page_" + index}>
                    <a href={"javascript:void(0);"} className={"page-link"}>
                        ...
                    </a>
                </li>
            )
        );
    }
    return (
        <div id="pagination" className="ms-auto">
            <ul className="pagination pagination-sm m-0 float-right">
                {previous_page}
                {pages_html}
                {next_page}
            </ul>
        </div>
    );
}
