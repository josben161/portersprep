"use client";
import { useEffect } from "react";

export default function GlobalHotkeys(){
  useEffect(()=>{
    function onKey(e: KeyboardEvent){
      // Basic examples: cmd/ctrl + shift + D = Analyze
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase()==="d"){
        const btn = document.querySelector('[data-hotkey="analyze"]') as HTMLButtonElement | null;
        btn?.click();
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[]);
  return null;
} 