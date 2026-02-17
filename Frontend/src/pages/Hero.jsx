
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center  justify-between px-4 border-b">

              <button className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 md:w-13 md:h-13 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                   <FaPlus className="" />
                </div>
                
             <div className="hidden sm:block">
              <h1 className="text-2xl md:text-3xl text-teal-600">
                Medconnect
              </h1>
            </div> 
            </button>

              <button
                  variant = "ghost"
                  size ="sm"
                  className="p-2"
                  onClick={()=> setIsMobileMenuOpen(false)}>
                <FaTimes className="w-6 h-6" />
             </button>
          </div>
              </div>
      )}