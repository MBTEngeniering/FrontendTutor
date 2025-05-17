import React, { useEffect } from "react";
import { useAuth } from "../context/UseAuth.jsx";

const Abikurs = () => {

  const {user} = useAuth();

  useEffect(() => {
    console.log(user)
  }, [user]);

  return (
      <div className="page">

        <h2>Abikurs</h2>
        <p>Unser spezieller Abikurs hilft dir, dich optimal auf dein Abitur vorzubereiten.</p>
        <p>Jetzt anmelden und durchstarten!</p>
      </div>
  );
}

export default Abikurs;
