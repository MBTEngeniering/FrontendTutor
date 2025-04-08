import { Spinner } from "reactstrap";

export default function Loader() {
  return (
      <>
        <Spinner
            color="primary"
            className="m-auto mt-3"
            style={{
              height: '3rem',
              width: '3rem'
            }}
        >
          Loading...
        </Spinner>
      </>
  );
}
