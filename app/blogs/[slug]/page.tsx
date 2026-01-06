"use client";

import { useParams } from 'next/navigation';

export default function BlogPage() {
    const params = useParams();
    const { slug } = params;

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <h1 className='text-3xl font-bold'>Blog Page - {slug}</h1>
        </div>
    );
}