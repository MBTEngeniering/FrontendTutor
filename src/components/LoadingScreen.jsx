import { Spinner } from "reactstrap";
import "../styles/LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <Spinner
          color="primary"
          style={{
            height: '4rem',
            width: '4rem'
          }}
        >
          Loading...
        </Spinner>
        <h3 className="mt-3">Loading fairstudy...</h3>
      </div>
    </div>
  );
}
