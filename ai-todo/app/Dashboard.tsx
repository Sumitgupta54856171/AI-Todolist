'use client';

import { useState } from "react";
function Dashboard() {
const [tad, setTab] = useState(false);
const toggleTab = () => {
  setTab(!tad);
}
  return (
  <>
<main className="w-screen h-screen bg-black border-2 border-white flex flex-col rounded-lg m-2 ">
  <div>

  </div>
</main>
  </>
  )
}
export default Dashboard;