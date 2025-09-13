import React from 'react'
import { motion } from 'framer-motion'
import { motionConfig } from '../lib/motion'

export default function Hero() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: motionConfig.duration, ease: motionConfig.ease }}
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Elegant shopping. Fast checkout.
          </h1>
          <p className="text-muted-1 max-w-lg mb-6">
            A modern, minimal e-commerce experience — beautiful product pages, smooth animations, and reliable performance.
          </p>
          <div className="flex gap-3">
            <a className="inline-block px-5 py-3 rounded-xl bg-accent text-surface font-semibold shadow-lg hover:scale-[1.02] transform transition-bezier" href="#shop">Shop now</a>
            <a className="inline-block px-5 py-3 rounded-xl border border-white/10 text-muted-1 hover:bg-white/3 transition" href="#about">Learn</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: motionConfig.duration + 0.08, ease: motionConfig.ease }}
          className="relative"
        >
          <div className="card">
            <div className="grid grid-cols-2 gap-3">
              <img src="/demo/product-1.jpg" alt="Demo" className="w-full h-48 object-cover rounded-xl" />
              <div>
                <h3 className="font-semibold mb-2">Featured Collection</h3>
                <p className="text-sm text-muted-1">Curated essentials for everyday comfort.</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/9 transition">View</button>
                  <button className="px-3 py-2 rounded-lg border border-white/6">Wishlist</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
