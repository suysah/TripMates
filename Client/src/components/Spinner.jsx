import { ClipLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

const Spinner = () => {
  return (
    <div className="sweet-loading h-screen flex justify-center items-center ">
      <ClipLoader
        color="blue"
        loading="true"
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;
