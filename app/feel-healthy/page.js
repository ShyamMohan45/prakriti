
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function page() {
  return (
    <main className="overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative w-full h-[564px]">
        <img
          src="/feel-healthy_image.png"
          alt="Feeling healthy"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="px-16 max-w-3xl text-white">
            <h1 className="text-6xl font-serif font-bold leading-tight mb-6 drop-shadow-lg">
              Explore How We Can Help
            </h1>
            <p className="text-2xl opacity-90">
              We&apos;re in this together
            </p>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="w-full h-[265.7px] flex items-center justify-center bg-gradient-to-br from-[#063846] to-[#0b5563] text-white">
        <div className="max-w-3xl text-center px-6">
          <h2 className="text-4xl font-semibold leading-tight">
            Transforming clinical data into clarity — so care comes first.
          </h2>

          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-teal-400"></div>

          <p className="mt-6 text-lg text-white/90">
            Prakriti leverages AI to streamline documentation, surface critical
            insights, and help clinicians make faster, more confident
            decisions—without adding complexity.
          </p>
        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="w-full min-h-[600px] py-16 bg-[#eaf3f1] dark:bg-slate-900/60 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-serif text-gray-800 dark:text-white mb-3">
          Recipes & Health Tips
        </h2>

        <p className="text-gray-600 dark:text-slate-400 mb-14 text-center px-4">
          Learn more about maintaining good health and managing your conditions.
        </p>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

          {/* CARD 1 */}
          <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden text-center">
            <img
              src="/SproutedMoong.jpg"
              alt="Sprouted Moong"
              className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-6">
              <h3 className="text-xl font-serif text-teal-700 underline mb-4">
                Sprouted Moong
              </h3>
              <Link href="/Recipesoffeelgood/sproutedmoong">
                <button className="px-7 py-2 border-2 border-teal-700 text-teal-700 rounded-full hover:bg-teal-700 hover:text-white transition">
                  GO TO RECIPE
                </button>
              </Link>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden text-center">
            <img
              src="/vegetable-salad.jpg"
              alt="Vegetable Salad"
              className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-6">
              <h3 className="text-xl font-serif text-teal-700 underline mb-4">
                Vegetable Salad
              </h3>
              <Link href="/Recipesoffeelgood/vegetablesalad">
                <button className="px-7 py-2 border-2 border-teal-700 text-teal-700 rounded-full hover:bg-teal-700 hover:text-white transition">
                  GO TO RECIPE
                </button>
              </Link>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden text-center">
            <img
              src="/lemon_juice.jpg"
              alt="Lemon Juice"
              className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-6">
              <h3 className="text-xl font-serif text-teal-700 underline mb-4">
                Lemon Juice
              </h3>
              <Link href="/Recipesoffeelgood/lemonjuice">
                <button className="px-7 py-2 border-2 border-teal-700 text-teal-700 rounded-full hover:bg-teal-700 hover:text-white transition">
                  GO TO RECIPE
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
