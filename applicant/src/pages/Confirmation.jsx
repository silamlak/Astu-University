import React, { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import Confirm from '../assets/image/confirm.svg'

const Confirmation = () => {
     const navigate = useNavigate();
     const location = useLocation();
     const state = location.state;
     console.log(state);
  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  return (
    <div className="w-full flex flex-col-reverse gap-10 justify-center items-center p-20">
      <img src={Confirm} className="w-[250px] h-[250px]" />
      <div className="p-4 max-w-4xl bg-green-100 border flex flex-col items-center justify-center border-green-400 text-green-700 rounded">
        <p>
          Hello {state.gender === 'Male'? 'Mr.': 'Ms.'}{' '}{state?.first_name} This is your confirmation code{" "}
          {state?.confirmation_code}
          {". "}
          Please keep this code safe as it will be required for any further
          correspondence or verification related to your submission. Best
          regards, CNAS.
        </p>
      </div>
    </div>
  );
}

export default Confirmation
