"use client";

import { MotionConfig } from "framer-motion";
import { GrandmaScreen } from "../components/screens/GrandmaScreen";

export default function GrandpaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="grandma-page"><GrandmaScreen preferRole="grandfather" /></main>
    </MotionConfig>
  );
}
