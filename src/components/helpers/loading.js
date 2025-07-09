import { LOADING_GIF } from "../../settings";

export function LoadingAnimation({extra_classes}) {
    
    return (
        <img
            src={LOADING_GIF.path}
            className={LOADING_GIF.classes + " " + extra_classes}
            style={{ width: LOADING_GIF.width+"px" }}
            id="loading_gif"
        />
    );
}
