import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./style/Loading.css";

function Loading() {
  return (
    <div className="loading-wrapper">
      <div className="loading">
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    </div>
  );
}

export default Loading;
