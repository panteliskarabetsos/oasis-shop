// src/app/(locked)/page.js
import { Suspense } from "react";
import HomeClient from "./HomeClient"; // move your current client content into this file

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  );
}
