
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function page() {
  return (
    <main className="overflow-hidden">

      
      <section className="relative w-full h-[564px]">
        <img
          src="/feeling-concern-disease_image.png"
          alt="concern about health"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

    
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="px-16 max-w-3xl text-white">
            <h1 className="text-6xl font-serif mb-6 leading-tight drop-shadow-xl">
              Explore How We Can Help
            </h1>
            <p className="text-2xl text-white/90">
              We&apos;re in this together
            </p>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="w-full h-[265.7px] flex items-center justify-center bg-gradient-to-r from-[#063846] to-[#0b5d6b] text-white">
        <div className="max-w-3xl text-center px-6">

          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Health conditions can bring up a lot of questions, concerns and emotions.
          </h2>

          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-teal-400"></div>

          <p className="mt-6 text-lg text-white/90">
            Prakriti leverages AI to streamline documentation, surface critical insights,
            and help clinicians make faster, more confident decisions—without adding complexity.
          </p>

        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="w-full min-h-[600px] py-16 bg-gradient-to-b from-[#eaf3f1] to-[#f7fbfa] dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center">

        <h2 className="text-4xl font-serif text-gray-700 dark:text-white mb-3">
          Recipes & Health Tips
        </h2>

        <p className="text-gray-600 dark:text-slate-400 mb-12 text-center px-4">
          Learn more about maintaining good health and managing your conditions.
        </p>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

          {/* CARD 1 */}
          <div className="text-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-5">
            <img
              src="/vegetablekhichdi.jpg"
              alt="Vegetable Khichdi"
              className="w-full h-[260px] object-cover rounded-xl mb-5"
            />

            <h3 className="text-xl font-serif text-teal-700 underline mb-5">
              Vegetable Khichdi
            </h3>

            <Link href="/Recipefordisease/vegetablekhichdi">
              <button className="px-8 py-3 border-2 border-teal-700 text-teal-700 rounded-full font-medium hover:bg-teal-700 hover:text-white transition-all duration-300">
                GO TO RECIPE
              </button>
            </Link>
          </div>

          {/* CARD 2 */}
          <div className="text-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-5">
            <img
              src="/fruits.jpg"
              alt="Fruits"
              className="w-full h-[260px] object-cover rounded-xl mb-5"
            />

            <h3 className="text-xl font-serif text-teal-700 underline mb-5">
              Fruits
            </h3>

            <Link href="/Recipefordisease/fruits">
              <button className="px-8 py-3 border-2 border-teal-700 text-teal-700 rounded-full font-medium hover:bg-teal-700 hover:text-white transition-all duration-300">
                GO TO RECIPE
              </button>
            </Link>
          </div>

          {/* CARD 3 */}
          <div className="text-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-5">
            <img
              src="/herbalteas.jpg"
              alt="herbal teas"
              className="w-full h-[260px] object-cover rounded-xl mb-5"
            />

            <h3 className="text-xl font-serif text-teal-700 underline mb-5">
              Herbal Teas
            </h3>

            <Link href="/Recipefordisease/herbalteas">
              <button className="px-8 py-3 border-2 border-teal-700 text-teal-700 rounded-full font-medium hover:bg-teal-700 hover:text-white transition-all duration-300">
                GO TO RECIPE
              </button>
            </Link>
          </div>

        </div>
      </section>

    </main>
  )
}
