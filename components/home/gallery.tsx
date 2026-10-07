import { MediaFrame } from "@/components/home/media-frame";
import { galleryMoments } from "@/lib/content/home";

export function HomeGallery() {
  return (
    <section
      id="gallery"
      className="club-section club-container"
      aria-labelledby="gallery-title"
    >
      <div className="club-gallery-heading">
        <h2 id="gallery-title">Life at GDGC NITJ.</h2>
        <p>A few moments from our events and community.</p>
      </div>
      <div className="club-gallery-grid">
        {galleryMoments.map((moment, index) => (
          <figure className="club-gallery-moment" key={moment.id}>
            <MediaFrame
              src={moment.image}
              alt={moment.caption}
              label="Community photo"
              className="club-gallery-photo"
              sizes={
                index === 0
                  ? "(max-width: 700px) 100vw, 50vw"
                  : index === 1
                    ? "50vw"
                    : "(max-width: 700px) 50vw, 33vw"
              }
            />
            <figcaption>
              <span>{moment.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
