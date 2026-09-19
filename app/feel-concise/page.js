
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function page() {
  return (
    <main className="overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative w-full h-[564px]">
        <img
          src="/feeling-concern_picture.png"
          alt="concern about health"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Dark + Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="px-16 text-white max-w-3xl animate-fadeIn">
            <h1 className="text-6xl font-serif mb-4 leading-tight drop-shadow-lg">
              Explore How We Can Help
            </h1>
            <p className="text-2xl text-gray-200">
              We&apos;re in this together
            </p>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="w-full h-[265.7px] flex items-center justify-center bg-gradient-to-br from-[#063846] to-[#0a5668] text-white">
        <div className="max-w-3xl text-center px-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Health conditions can bring up a lot of questions, concerns and emotions.
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal-400"></div>

          <p className="mt-5 text-lg text-gray-200">
            Prakriti leverages AI to streamline documentation, surface critical insights,
            and help clinicians make faster, more confident decisions—without adding complexity.
          </p>
        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="w-full min-h-[600px] py-16 bg-gradient-to-b from-[#eaf3f1] to-white dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center">

        <h2 className="text-4xl font-serif text-gray-800 dark:text-white mb-2">
          Recipes & Health Tips
        </h2>

        <p className="text-gray-600 dark:text-slate-400 mb-12 text-center px-4">
          Learn more about maintaining good health and managing your conditions.
        </p>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

          {/* CARD 1 */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <img
              src="/pomegrante_juice.jpg"
              alt="Pomegranate Juice"
              className="w-full h-[260px] object-cover rounded-t-2xl"
            />

            <div className="p-6 text-center">
              <h3 className="text-xl font-serif text-teal-700 mb-4 group-hover:underline">
                Pomegranate Juice
              </h3>

              <Link href="/Recipeoffeelingconcise/pomegrante">
                <button className="px-6 py-2 rounded-full border-2 border-teal-700 text-teal-700
                  hover:bg-teal-700 hover:text-white transition-all duration-300">
                  GO TO RECIPE
                </button>
              </Link>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <img
              src="/vegetable-millet-khichdi.jpg"
              alt="Vegetable Millet Khichdi"
              className="w-full h-[260px] object-cover rounded-t-2xl"
            />

            <div className="p-6 text-center">
              <h3 className="text-xl font-serif text-teal-700 mb-4 group-hover:underline">
                Vegetable Millet Khichdi
              </h3>

              <Link href="/Recipeoffeelingconcise/milletkhichdi">
                <button className="px-6 py-2 rounded-full border-2 border-teal-700 text-teal-700
                  hover:bg-teal-700 hover:text-white transition-all duration-300">
                  GO TO RECIPE
                </button>
              </Link>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <img
              src="/palak-dal.jpg"
              alt="Palak Dal"
              className="w-full h-[260px] object-cover rounded-t-2xl"
            />

            <div className="p-6 text-center">
              <h3 className="text-xl font-serif text-teal-700 mb-4 group-hover:underline">
                Palak Dal
              </h3>

              <Link href="/Recipeoffeelingconcise/palakdal">
                <button className="px-6 py-2 rounded-full border-2 border-teal-700 text-teal-700
                  hover:bg-teal-700 hover:text-white transition-all duration-300">
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
