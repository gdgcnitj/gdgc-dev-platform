"use client";

import { NextPage } from "next";
import { Inter } from "next/font/google";
import { Skeleton } from "./skeleton";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
});

interface Props {
  title: string;
  description: string;
  tag: string;
  image: string;
  color: string;
}

const FameCard: NextPage<Props> = ({
  title,
  description,
  tag,
  image,
  color,
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <div
      style={{ background: color ? color : "#69A6FC" }}
      className={`text-black ${inter.className} min-w-[25%] max-w-[90%] pb-3 rounded-[60px] flex flex-col`}
    >
      <div className="py-10 px-8 flex flex-col gap-3">
        <div className="flex flex-row justify-between items-center font-bold text-sm">
          {tag ? (
            <p className="border-black border-[1px] bg-white px-1 py-[1px] rounded-full">
              {tag}
            </p>
          ) : (
            <Skeleton className="w-20 h-6" />
          )}
          <button className="p-2 hover:text-black hover:bg-white hover:ring-1 ring-black transition-colors text-white bg-black rounded-full">
            know more..
          </button>
        </div>
        {title ? (
          <h1 className="text-4xl font-bold">{title}</h1>
        ) : (
          <Skeleton className="w-40 h-10" />
        )}
        {description ? (
          <p className="text-sm font-medium">{description}</p>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-[90%] h-3" />
            <Skeleton className="w-[80%] h-3" />
            <Skeleton className="w-[90%] h-3" />
          </div>
        )}
      </div>
      <div className="flex justify-end rounded-[60px]">
        {
          image ?
          (
            <Image
          src={image}
          alt="image"
          className="flex w-full ml-4 border-[1px] border-black rounded-[60px]"
        />
          )
          :
          (
            <Skeleton className="w-full h-50 m-10"/>
          )
        }
      </div>
    </div>
  );
};

export default FameCard;
