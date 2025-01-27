
'use client';


import DashboardCards from './DashboardCards';

const Dashboard = () => {


  return (
    <div className="">
      <div className="flex-1 mt-2">
        <h1 className="text-2xl font-semibold text-custom-green">Dashboard</h1>
       
        <section className="mt-2">
          <DashboardCards/>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
