"use client";

// A grandparent's phone. /grandma starts as the family's grandma, /grandpa as grandpa; tap the face at the top to switch.
import { MotionConfig } from "framer-motion";
import { GrandmaScreen } from "../components/screens/GrandmaScreen";

export default function GrandmaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="grandma-page"><GrandmaScreen preferRole="grandmother" /></main>
    </MotionConfig>
  );
}
