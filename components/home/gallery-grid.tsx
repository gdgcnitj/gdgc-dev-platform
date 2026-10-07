"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import type { GalleryMoment } from "@/lib/content/home";

function ViewerPhoto({ photo }: { photo: GalleryMoment }) {
  const [stack, setStack] = useState<GalleryMoment[]>([photo]);
  const [shownId, setShownId] = useState(photo.id);

  if (photo.id !== shownId) {
    setShownId(photo.id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStack((current) => {
      if (reduce) return [photo];
      const outgoing = current[current.length - 1];
      return outgoing && outgoing.id !== photo.id ? [outgoing, photo] : [photo];
    });
  }

  useEffect(() => {
    if (stack.length < 2) return;
    const timer = window.setTimeout(() => setStack([stack[stack.length - 1]]), 180);
    return () => window.clearTimeout(timer);
  }, [stack]);

  return (
    <div className="club-viewer-stage">
      {stack.map((item) => {
        const incoming = item.id === photo.id;
        return (
          <div
            key={`${item.id}-${incoming ? "in" : "out"}`}
            className={incoming ? "club-viewer-layer club-viewer-layer-in" : "club-viewer-layer club-viewer-layer-out"}
            aria-hidden={incoming ? undefined : true}
          >
            <MediaFrame
              src={item.image}
              alt={item.caption}
              label="Community photo"
              className="club-viewer-photo"
              sizes="(max-width: 700px) 100vw, 90vw"
              priority={incoming}
              fadeOnLoad={false}
            />
          </div>
        );
      })}
    </div>
  );
}

export function GalleryGrid({ moments }: { moments: GalleryMoment[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isOpen = active !== null;
  const photo = active === null ? undefined : moments[active];

  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const viewer = dialog.current;
    const previousOverflow = document.body.style.overflow;
    viewer.showModal();
    document.body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      viewer.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const move = (direction: number) => {
    setActive((index) => index === null ? null : (index + direction + moments.length) % moments.length);
  };

  return (
    <>
      <div className="club-gallery-grid">
        {moments.map((moment, index) => {
          const frame = (
            <MediaFrame
              src={moment.image}
              alt={moment.caption}
              label="Community photo"
              className="club-gallery-photo"
              sizes={index < 2 ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 33vw"}
            />
          );
          const open = (current: HTMLElement) => {
            opener.current = current;
            setActive(moments.findIndex((item) => item.id === moment.id));
          };
          return (
            <figure className="club-gallery-moment" key={moment.id} data-reveal="card" data-reveal-order={index % 3}>
              {moment.image ? (
                <a
                  href={moment.image}
                  className="club-gallery-open"
                  aria-label={`View photo: ${moment.caption}`}
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    open(event.currentTarget);
                  }}
                >
                  {frame}
                  <span className="club-gallery-expand" aria-hidden="true"><Expand size={18} /></span>
                </a>
              ) : (
                <button
                  type="button"
                  className="club-gallery-open"
                  aria-label={`View photo: ${moment.caption}`}
                  aria-haspopup="dialog"
                  onClick={(event) => open(event.currentTarget)}
                >
                  {frame}
                  <span className="club-gallery-expand" aria-hidden="true"><Expand size={18} /></span>
                </button>
              )}
              <figcaption>{moment.caption}</figcaption>
            </figure>
          );
        })}
      </div>
      {moments.length > 0 && (
        <dialog
          ref={dialog}
          className="club-gallery-viewer"
          aria-label="Community photo viewer"
          aria-describedby="club-viewer-caption"
          onCancel={() => setActive(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
          onKeyDown={(event) => {
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              setActive(event.key === "Home" ? 0 : moments.length - 1);
            }
          }}
        >
          <div className="club-viewer-panel">
            <div className="club-viewer-toolbar">
              <span>Community gallery</span>
              <button ref={closeButton} type="button" className="club-viewer-control" aria-label="Close photo viewer" onClick={() => setActive(null)}>
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            {photo && <ViewerPhoto photo={photo} />}
            <div className="club-viewer-bottom">
              <div id="club-viewer-caption" aria-live="polite" aria-atomic="true">
                <p>{photo?.caption}</p>
                <span>{active === null ? 0 : active + 1} / {moments.length}</span>
              </div>
              {moments.length > 1 && (
                <div className="club-viewer-navigation">
                  <button type="button" className="club-viewer-control" aria-label="Previous photo" onClick={() => move(-1)}>
                    <ArrowLeft size={22} aria-hidden="true" />
                  </button>
                  <button type="button" className="club-viewer-control" aria-label="Next photo" onClick={() => move(1)}>
                    <ArrowRight size={22} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
