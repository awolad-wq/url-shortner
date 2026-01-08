import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Components/Footer';

const HomeLayout = () => {
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>

      <main className="relative min-h-[66vh] w-full ">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200/50 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-200/50 rounded-full blur-[100px]"></div>
        <div className="absolute left-1/2 right-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-[100px]"></div>

        <div className="relative">

          <Outlet></Outlet>

        </div>
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default HomeLayout;