import { GalleryGrid } from "@/components/home/gallery-grid";
import { galleryMoments } from "@/lib/content/home";

export function HomeGallery() {
  return (
    <section
      id="gallery"
      className="club-section club-container"
      aria-labelledby="gallery-title"
    >
      <div className="club-gallery-heading" data-reveal>
        <h2 id="gallery-title">Life at GDGC NITJ.</h2>
        <p>A few moments from our events and community.</p>
      </div>
      <GalleryGrid moments={galleryMoments} />
    </section>
  );
}
