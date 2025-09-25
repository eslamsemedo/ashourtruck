
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, ClockArrowDown, LogOut, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from '../app/shop/loading';



type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
};

const FloatingActionMenu = ({
  options,
  className,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("fixed bottom-8 right-8", className)}>
      <Button
        onClick={toggleMenu}
        className=" fixed bottom-8 right-8 p-2 px-3 rounded-3xl bg-[#2d2d2d] text-white hover:bg-[#444444] transition-all duration-300 ease-in-out shadow-xl hover:shadow-lg flex items-center justify-center"
      >
        <span className="text-lg font-semibold">Menu</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="fixed bottom-[73px] right-8 mb-2"
          >
            <div className="flex flex-col items-end gap-2">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center gap-2 bg-[#333333] text-white hover:bg-[#444444] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg border-none rounded-xl backdrop-blur-sm"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

async function logout() {
  // setLoading(true)

  try {
    const res = await fetch(`/api/auth/logout`, { method: "POST" });

    if (!res.ok) {
      // If backend/route fails, still force logout on client
      const faild = await res.json()
      console.log(JSON.parse(faild.error))
      console.log(`Logout failed: ${JSON.parse(faild.error).message}`);
    }

    // Either way, clear client state and send user to login
    window.location.href = "/admin/login";
  } catch (err) {
    console.log(`Logout error: ${err}`);
    // still redirect to login (so user isn't stuck)
    window.location.href = "/admin/login";
  } finally {
    // setLoading(true)
  }
}



const Menu = () => {
  const [Loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true)

    try {
      const res = await fetch(`/api/auth/logout`, { method: "POST" });

      if (!res.ok) {
        // If backend/route fails, still force logout on client
        const faild = await res.json()
        console.log(JSON.parse(faild.error))
        console.log(`Logout failed: ${JSON.parse(faild.error).message}`);
      }

      // Either way, clear client state and send user to login
      window.location.href = "/admin/login";
    } catch (err) {
      console.log(`Logout error: ${err}`);
      // still redirect to login (so user isn't stuck)
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <FloatingActionMenu
      className="relative"
      options={[
        {
          label: "Products",
          Icon: <PackageSearch className="w-4 h-4" />,
          onClick: () => window.location.href = "/admin/control/products",
        },

        {
          label: "Transportations",
          Icon: <Car className="w-4 h-4" />,
          onClick: () => window.location.href = "/admin/control/transportations",
        },
        {
          label: "Orders",
          Icon: <ClockArrowDown className="w-4 h-4" />,

          onClick: () => window.location.href = "/admin/control/orders",
        },
        {
          label: Loading ? "Logging out..." : "Logout",
          Icon: <LogOut className="w-4 h-4" />,
          onClick: logout,
        },
      ]}
    />
  )
}



export default Menu;
