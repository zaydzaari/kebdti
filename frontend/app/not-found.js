import { BrandMark } from "./components/icons";
import { Button } from "./components/ui";

export default function NotFound() {
  return (
    <main className="k-app">
      <section className="k-screen k-center k-narrow k-lost">
        <BrandMark size={56} />
        <p className="k-eyebrow">404 · A little lost</p>
        <h1 className="k-h1">Let’s get you home.</h1>
        <p className="k-lead">That page isn’t here. Your family’s words are one tap away.</p>
        <Button block href="/" iconEnd="arrowRight">Open Kebdti</Button>
      </section>
    </main>
  );
}
