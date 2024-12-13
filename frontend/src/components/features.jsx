import React from 'react'

function features() {
  return (
    <div className="container py-8">
        <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto justify-center">
            <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                <img src="assets/images/icons/delivery-van.svg" alt="Delivery" className="w-12 h-12 object-contain" />
                <div>
                    <h4 className="font-medium capitalize text-lg">Fast Shipping</h4>
                    <p className="text-gray-500 text-sm">Order in 24H </p>
                </div>
            </div>
            
            <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                <img src="assets/images/icons/service-hours.svg" alt="Delivery" className="w-12 h-12 object-contain"/>
                <div>
                    <h4 className="font-medium capitalize text-lg">24/7 Support</h4>
                    <p className="text-gray-500 text-sm">Customer support</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default features
