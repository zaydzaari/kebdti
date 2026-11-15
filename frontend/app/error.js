"use client";
import { BrandMark } from "./components/icons";
import { Button } from "./components/ui";

export default function ErrorScreen({ reset }) {
  return (
    <main className="k-app">
      <section className="k-screen k-center k-narrow k-lost">
        <BrandMark size={56} />
        <h1 className="k-h1">Something interrupted your visit.</h1>
        <p className="k-lead">Try opening this screen again. Your saved profile and notes haven’t been cleared.</p>
        <Button block onClick={reset} icon="replay">Try again</Button>
        <a className="k-link" href="/">Back to Kebdti</a>
      </section>
    </main>
  );
}
