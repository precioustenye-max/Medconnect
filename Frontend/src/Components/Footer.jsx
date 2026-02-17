import React from "react";
import {
    FaPlus,
    FaFacebook,
    FaWhatsapp,
    FaLinkedin
} from "react-icons/fa"
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "About", path: "/" },
  { label: "Contact", path: "/shop" },
  { label: "FAQs", path: "/FAQs" },
  { label: "Prescription Refills", path: "/Prescription Refills" },
  { label: "Health Resources", path: "/Health Resource" }
];
const CustomerSevice = [
{ label: "Shipping Information", path: "/" },
{ label: "Returns & Refunds", path: "/Returns" },
{ label: "Privacy Policy", path: "/Privacy Policy" },
{ label: "Terms & Conditions", path: "/Terms & Conditions" },
{ label: "Tract Your Order", path: "/Tract Your Order" }
];

const ContactUs = [
{ label: "Shipping Information", path: "/" },
{ label: "Returns & Refunds", path: "/Returns" },
{ label: "Privacy Policy", path: "/Privacy Policy" },
{ label: "Terms & Conditions", path: "/Terms & Conditions" },
{ label: "Tract Your Order", path: "/Tract Your Order" }
];


 const linkClass = ({ isActive }) =>
    `font-semibold text-xl transition-colors ${
      isActive
        ? "text-gray-600"
          : "text-gray-600 hover:text-teal-600"
    }`;


const Footer = ()=> {
    return(
        <footer className="bg-gray-900 text-white px-4  ">
            <div className="flex  px-4 md:px-6  space-x-7 py-10 space-y-6
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
            border-b-1 border-gray-800
             ">

            <div className="" >
              <Link to="/" className=" md:flex flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
            <FaPlus />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl md:flex font-semibold text-white">
              MedConnect
            </h1>
        
          </div>
        </Link>
            <p className="text-sm  md:flex text-gray-400 md:text-base mt-5">
              Your trusted partner in healthcare, providing quality
               medications and health products with 
              exceptional service.
            </ p>

         <button className="flex gap-2 space-x-2 items-center justify-center mt-6">
            <FaFacebook className="text-xl " />
            <FaWhatsapp className="text-xl" />
            <FaLinkedin className="text-xl"/>
         </button>
        </div>
    

        {/* quick links */}
  <div className="flex  flex-col">
   <div>
            <h1 className="text-xl md:text-2xl flex items-center md:flex font-semibold text-white">
              Quick Links
            </h1>
        
          </div>
    <ul className="flex flex-col gap-2 mt-2">
        {navItems.map((item) => (
            <li key = {item.path}>
                <NavLink to = {item.path}  className={linkClass}>
                    {item.label}
                </NavLink>
            </li>
        ))}
    </ul>
  </div>

          {/* quick links */}
  <div className="flex  flex-col">
   <div>
            <h1 className="text-xl md:text-2xl md:flex font-semibold text-white">
              Customer Service
            </h1>
        
          </div>
    <ul className="flex flex-col gap-2 mt-2">
        {CustomerSevice.map((item) => (
            <li key = {item.path}>
                <NavLink to = {item.path}  className={linkClass}>
                    {item.label}
                </NavLink>
            </li>
        ))}
    </ul>
  </div>

          {/* quick links */}
  <div className="flex  flex-col">
   <div>
            <h1 className="text-xl md:text-2xl  md:flex font-semibold text-white">
              HealthPlus Pharmacy
            </h1>
        
          </div>
    <ul className="flex flex-col gap-2 mt-2">
        {navItems.map((item) => (
            <li key = {item.path}>
                <NavLink to = {item.path}  className={linkClass}>
                    {item.label}
                </NavLink>
            </li>
        ))}
    </ul>
  </div>        
            </div>

            {/* send us email section */}

            <div className="px-4 md:px-6 py-6">
                <div>
                    <h1 className="flex items-center text-2xl pb-2 md:pb-3 md:text-3xl">Subscribe to Our Newsletter</h1>
                </div>
                   <section className="border-b-1 border-gray-800 pb-6">
                        <div className=" md:flex flex flex-1 max-w-xl gap-3 mt-3">
                          <div className="relative w-full ">
                            <input
                              type="search"
                              placeholder="Enter your Email ......"
                              className="w-full pl-10 pr-4 py-4 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <button className="bg-gray-950 px-6 py-3 rounded-lg text-xl">Subscribe</button>
                        </div>     
                        <p className="flex text-gray-700 text-base mt-2">Get updates on new products, special offers, and health tips.</p>
                        </section>           
            </div>

            {/*  All rights Preserved*/}

            <div className="flex items-center justify-between py-6 
                        grid grid-cols-1  md:grid-cols-2
            ">
               <span>
                 <p className="text-gray-400 flex items-center justify-center py-2">© 2025 HealthPlus Pharmacy. All rights reserved.</p>
               </span>

               <div className="flex justify-center space-x-3 text-gray-400">
                <span>Licensed & Certified</span>
                <span>HIPAA Compliant</span>
                <span>SSL Secured</span>
               </div>

            </div>
        </footer>
    )
}
export default Footer;