import { useState } from "react";
import SyncLoader from "react-spinners/ClipLoader";

const Loading = ({ color }) => {
  return (
    <div>
      <SyncLoader size={15} color="fff" loading={true} speedMultiplier={1} />
    </div>
  );
};

export default Loading;
