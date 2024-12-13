import React from 'react'

const CardDashboard = ({title, total, children, bgColor}) => {
  let className = bgColor ;
  if(bgColor === "sold") {
    className = "bg-gradient-to-t from-green-50 to-lime-400 ";
  }else if(bgColor === "pending") {
    className = "bg-gradient-to-t from-yellow-50 to-yellow-300 ";
  }else if(bgColor === "canceled") {
    className = "bg-gradient-to-t from-red-50 to-red-400 ";
  }else {
    className = "bg-gradient-to-t from-blue-50 to-blue-300 ";
  }

  return (
    <div className={`rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default ${className} `} >
    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 ">
      {children}
    </div>

    <div className="mt-4 flex items-end justify-between">
      <div>
        <h4 className="text-title-md font-bold text-black ">
          {total}
        </h4>
        <span className="text-sm font-medium">{title}</span>
      </div>

      
    </div>
  </div>
  )
}

export default CardDashboard

