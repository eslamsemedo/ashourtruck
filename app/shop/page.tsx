"use client"
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/state/store";
import { setLanguage } from "@/app/state/lang/langSlice";
import ShopPage from "@/components/shop";

export default function Page() {
  const lang = useSelector((s: RootState) => s.lang.code);
  const dispatch = useDispatch();

  return (
    <>
      {/* <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, margin: "16px 0" }}>
        <button
          onClick={() => dispatch(setLanguage("en"))}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: lang === "en" ? "2px solid #ef4444" : "1px solid #ccc",
            background: lang === "en" ? "#ef4444" : "#fff",
            color: lang === "en" ? "#fff" : "#222",
            fontWeight: lang === "en" ? 700 : 400,
            cursor: "pointer"
          }}
        >
          EN
        </button>
        <button
          onClick={() => dispatch(setLanguage("ar"))}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: lang === "ar" ? "2px solid #ef4444" : "1px solid #ccc",
            background: lang === "ar" ? "#ef4444" : "#fff",
            color: lang === "ar" ? "#fff" : "#222",
            fontWeight: lang === "ar" ? 700 : 400,
            cursor: "pointer"
          }}
        >
          AR
        </button>
      </div> */}
      <ShopPage
        apiUrl="https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/products"
        lang={lang}
      />
    </>
  );
}