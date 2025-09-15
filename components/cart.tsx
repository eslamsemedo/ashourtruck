"use client"
import { addItem } from '@/app/state/cart/cartSlice';
import { AppDispatch, RootState } from '@/app/state/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div>
      <button
        onClick={() => dispatch(addItem({ id: Date.now(), name: 'Demo Item', price: 10, qty: 1, image: '', }))}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 mb-6"
      >
        Add Item
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Item {items.length}</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id as any} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h2>
              <p className="text-lg text-green-600 font-medium">${item.price}</p>
              <p className="text-gray-600">Quantity: {item.qty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default cart
