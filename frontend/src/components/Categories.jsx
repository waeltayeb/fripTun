import React from 'react'

function Categories() {
  return (
    <div className="container py-4">
    <h2 className="text-2xl font-semibold text-gray-800 uppercase mb-6 text-center lg:text-left tracking-wide">
      Shop by Category
    </h2>
    <div className="flex lg:justify-center gap-x-6 overflow-x-auto scrollbar-hide py-4 px-4">
      {/* Category 1 */}
      <div className="relative rounded-full overflow-hidden group w-24 h-24 shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src="assets/images/category/category-6.jpg" alt="Kitchen" className="w-full h-full object-cover" />
        <a href="/"
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-sm text-white font-medium uppercase tracking-wide group-hover:bg-opacity-60 transition">Kitchen</a>
      </div>
      {/* Category 2 */}
      <div className="relative rounded-full overflow-hidden group w-24 h-24 shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src="assets/images/category/category-6.jpg" alt="Living Room" className="w-full h-full object-cover" />
        <a href="/"
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-sm text-white font-medium uppercase tracking-wide group-hover:bg-opacity-60 transition">Living Room</a>
      </div>
      {/* Category 3 */}
      <div className="relative rounded-full overflow-hidden group w-24 h-24 shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src="assets/images/category/category-6.jpg" alt="Bedroom" className="w-full h-full object-cover" />
        <a href="/"
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-sm text-white font-medium uppercase tracking-wide group-hover:bg-opacity-60 transition">Bedroom</a>
      </div>
      {/* Category 4 */}
      <div className="relative rounded-full overflow-hidden group w-24 h-24 shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src="assets/images/category/category-6.jpg" alt="Bathroom" className="w-full h-full object-cover" />
        <a href="/"
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-sm text-white font-medium uppercase tracking-wide group-hover:bg-opacity-60 transition">Bathroom</a>
      </div>
      {/* Additional Categories */}
      <div className="relative rounded-full overflow-hidden group w-24 h-24 shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src="assets/images/category/category-6.jpg" alt="Outdoor" className="w-full h-full object-cover" />
        <a href="/"
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-sm text-white font-medium uppercase tracking-wide group-hover:bg-opacity-60 transition">Outdoor</a>
      </div>
    </div>
  </div>
  
  )
}

export default Categories
