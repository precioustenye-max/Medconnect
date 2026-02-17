import React  from "react";
import { useState, useMemo } from "react";
import { FaUpload,FaImage,FaCloudUploadAlt } from "react-icons/fa";
import { Upload, FileText, CheckCircle, Clock, X, Download } from 'lucide-react';
import ImageUpload from "../Components/UI/ImageUpload";

const PrescripeSection = () =>{
    return(
        <section className="mt-10 bg-white mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 space-x-3 my-2">


                  <button className=" gap-3 border-1 border-gray-300 p-5 rounded-lg  text-gray-700 shadow-md">
                    <div className="flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                        <h2 className="text-2xl">Upload Your Prescription</h2>
                    </div>
                    <ImageUpload />
        <div className=" space-y-3 mt-5 ">
        <div className="flex flex-col items-start">
        <span className="text-gray-800 font-semibold text-xl">Patient Name</span>
        <input type="text"
        placeholder="Enter Patients Name " 
        className="bg-gray-100 w-full  py-4 text-xl rounded-2xl px-2"/>
        </div>
     <div className="flex flex-col items-start">
        <span className="text-black font-semibold text-xl text-gray-800">Prescribing Doctor</span>
        <input type="text" 
         className="bg-gray-100 w-full py-4 text-xl rounded-2xl px-2 "
         placeholder="Doctor's Name"/>
         </div>
      <div className="flex flex-col items-start">
        <span className="text-black font-semibold text-xl text-gray-800">Additional Notes(Optional)</span>
        <textarea type="text"
         className="bg-gray-100 w-full py-4 rounded-2xl text-base px-2"
         placeholder="Any spacial Instructions or describe your sickness " />
         </div>
      </div>

      <button className="bg-gray-900  w-full py-3 mt-6 rounded-2xl text-white md:text-xl text-base">Submit Prescription</button>
                  </button>


                  {/* card 2 */}

                  <div className="space-y-3">
                  <div className="border-1 border-gray-300 rounded-lg shadow-md py-10 p-5 px-7 text-gray-800">
                    <div>
                        <h2 className="text-3xl capitalize">Important information</h2>

                          <div className="mt-6 space-y-1">
                           <div className="flex items-center gap-4">
                            <CheckCircle className="text-green-600 w-6 h-6"/>
                            <h3 className="text-2xl text-gray-800 capitalize ">Validate Prescription required</h3>
                            </div>
                            <p className="text-gray-700 ml-11">Prescription must be current and signed by a licensed physician</p>
                        </div>

                             <div className="mt-6 space-y-1">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-green-600 w-6 h-6"/>
                            <h3 className="text-2xl text-gray-800 capitalize ">Validate Process</h3>
                                </div>
                            <p className="text-gray-700 ml-11">Prescription must be current and signed by a licensed physician</p>
                        </div>

                             <div className="mt-6 space-y-1">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-green-600 w-6 h-6"/>
                            <h3 className="text-2xl text-gray-800 capitalize ">secure & confidencial</h3>
                                </div>
                            <p className="text-gray-700 ml-11">All prescriptions are stored securely and handled with privacy</p>
                        </div>

                             <div className="mt-6 space-y-1">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="text-green-600 w-6 h-6"/>
                            <h3 className="text-2xl text-gray-800 capitalize ">Automatic Refils available</h3>
                                </div>
                            <p className="text-gray-700 ml-11">Set up automatic refills for your recurring medications</p>
                        </div>
                    </div>
                  </div>
                    
                    <div className="bg-blue-50 p-5  rounded-lg shadow-md border-1 border-blue-200">
                        <h2 className="text-blue-700 text-2xl">Need help?</h2>
                        <p className="text-base md:text-xl text-blue-500 py-2">Our pharmacists are available 24/7 to assist with your prescription needs</p>

                        <button className="bg-white w-full mt-3 py-3 rounded-2xl text-xl border-1 border-gray-200 hover:bg-gray-200">Contact Support</button>
                    </div>

                  </div>

            </div>
        </section>

    )
}

export default PrescripeSection;