"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import type { EventMedia } from "@/lib/events/schema";

export function EventCarousel({
  slides,
  title,
}: {
  slides: EventMedia[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const photo = slides[active];

  useEffect(() => {
    if (!expanded || !dialog.current) return;
    const viewer = dialog.current;
    const overflow = document.body.style.overflow;
    viewer.showModal();
    document.body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      viewer.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  const select = (index: number) => {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rail.current?.scrollTo({
      left: next * rail.current.clientWidth,
      behavior: reduce || expanded ? "instant" : "smooth",
    });
  };

  if (!photo) return null;

  return (
    <div
      className="event-carousel"
      role="region"
      aria-roledescription={slides.length > 1 ? "carousel" : undefined}
      aria-label={`${title} photos`}
    >
      <div
        ref={rail}
        className="event-carousel-rail"
        tabIndex={slides.length > 1 ? 0 : undefined}
        aria-label={
          slides.length > 1
            ? "Event images. Use the left and right arrow keys to browse."
            : undefined
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            select(active + (event.key === "ArrowLeft" ? -1 : 1));
          }
        }}
        onScroll={(event) => {
          const { scrollLeft, clientWidth } = event.currentTarget;
          if (clientWidth)
            setActive(
              Math.max(
                0,
                Math.min(
                  slides.length - 1,
                  Math.round(scrollLeft / clientWidth),
                ),
              ),
            );
        }}
      >
        {slides.map((slide, index) => (
          <figure
            className={`event-carousel-slide event-media-${slide.kind}`}
            key={slide.id}
            aria-hidden={index !== active}
          >
            <MediaFrame
              src={slide.src}
              alt={slide.alt}
              label="Event photo"
              className="event-carousel-photo"
              sizes="(max-width: 900px) 100vw, 75vw"
              priority={index === 0}
            />
            <button
              type="button"
              className="event-carousel-expand"
              aria-label={`View full image: ${slide.alt}`}
              aria-haspopup="dialog"
              tabIndex={index === active ? 0 : -1}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setExpanded(true);
              }}
            >
              <Expand size={19} aria-hidden="true" />
            </button>
          </figure>
        ))}
      </div>
      <div className="event-carousel-bottom">
        <div
          className="event-carousel-caption"
          aria-live="polite"
          aria-atomic="true"
        >
          {photo.caption && <p>{photo.caption}</p>}
          {slides.length > 1 && (
            <span>
              {active + 1} / {slides.length}
            </span>
          )}
        </div>
        {slides.length > 1 && (
          <div className="event-carousel-controls">
            <button
              type="button"
              className="event-round-button"
              aria-label="Previous image"
              onClick={() => select(active - 1)}
            >
              <ArrowLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="event-round-button"
              aria-label="Next image"
              onClick={() => select(active + 1)}
            >
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {slides.length > 1 && (
        <div className="event-carousel-thumbnails" aria-label="Choose an image">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Image ${index + 1}: ${slide.alt}`}
              aria-pressed={index === active}
              onClick={() => select(index)}
              className={`event-thumbnail event-media-${slide.kind}`}
            >
              <Image src={slide.src} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialog}
        className="club-gallery-viewer"
        aria-label={`${title} photo viewer`}
        aria-describedby="event-viewer-caption"
        onCancel={() => setExpanded(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
        onKeyDown={(event) => {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            select(active + (event.key === "ArrowLeft" ? -1 : 1));
          }
          if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            select(event.key === "Home" ? 0 : slides.length - 1);
          }
        }}
      >
        {expanded && (
          <div className="club-viewer-panel">
            <div className="club-viewer-toolbar">
              <span>{title}</span>
              <button
                ref={closeButton}
                type="button"
                className="club-viewer-control"
                aria-label="Close photo viewer"
                onClick={() => setExpanded(false)}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="club-viewer-stage">
              <MediaFrame
                src={photo.src}
                alt={photo.alt}
                label="Event photo"
                className="club-viewer-photo"
                sizes="90vw"
                fadeOnLoad={false}
              />
            </div>
            <div className="club-viewer-bottom">
              <div
                id="event-viewer-caption"
                aria-live="polite"
                aria-atomic="true"
              >
                {photo.caption && <p>{photo.caption}</p>}
                <span>
                  {active + 1} / {slides.length}
                </span>
              </div>
              {slides.length > 1 && (
                <div className="club-viewer-navigation">
                  <button
                    type="button"
                    className="club-viewer-control"
                    aria-label="Previous photo"
                    onClick={() => select(active - 1)}
                  >
                    <ArrowLeft size={22} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="club-viewer-control"
                    aria-label="Next photo"
                    onClick={() => select(active + 1)}
                  >
                    <ArrowRight size={22} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
