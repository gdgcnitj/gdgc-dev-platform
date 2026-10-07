import { GalleryGrid } from "@/components/home/gallery-grid";
import { galleryMoments } from "@/lib/content/home";

export function HomeGallery() {
  return (
    <section
      id="gallery"
      className="club-field club-field-green club-field-slant club-field-slant-reverse"
      aria-labelledby="gallery-title"
    >
      <div className="club-section club-container">
        <div className="club-title-card club-gallery-heading" data-reveal>
          <h2 id="gallery-title">Life at GDGC NITJ.</h2>
          <p>A few moments from our events and community.</p>
        </div>
        <GalleryGrid moments={galleryMoments} />
      </div>
    </section>
  );
}
