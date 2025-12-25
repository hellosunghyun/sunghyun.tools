"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function TwitterVideoTool() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isConverting, setIsConverting] = useState(false);

    const load = async () => {
        setIsLoading(true);
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            console.log(message);
        });
        ffmpeg.on('progress', ({ progress, time }) => {
            const p = progress * 100;
            if (p >= 0 && p <= 100) {
                setProgress(Math.round(p));
            }
        });
        // toBlobURL is used to bypass CORS issues, urls must be self-hosted if not using unpkg
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
        setIsLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setVideoUrl(null);
            setProgress(0);
        }
    };

    const convertToVideo = async () => {
        if (!selectedFile || !loaded) return;

        setIsConverting(true);
        setProgress(0);
        const ffmpeg = ffmpegRef.current;

        try {
            await ffmpeg.writeFile('input.png', await fetchFile(selectedFile));

            // Command: 
            // -loop 1: Loop the image
            // -i input.png: Input file
            // -c:v libx264: Video codec
            // -t 2: Duration 2 seconds
            // -pix_fmt yuv420p: Pixel format for compatibility
            // -vf scale=...: Fit within 2048x2048, maintain aspect ratio, prevent upscaling, and ensure even dimensions
            await ffmpeg.exec([
                '-loop', '1',
                '-i', 'input.png',
                '-c:v', 'libx264',
                '-t', '2',
                '-pix_fmt', 'yuv420p',
                '-vf', 'scale=2048:2048:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2',
                '-r', '30',
                '-movflags', '+faststart',
                'output.mp4'
            ]);

            const data = await ffmpeg.readFile('output.mp4');
            const uint8Data = data as Uint8Array;

            // Check file size (15MB limit)
            if (uint8Data.byteLength > 15 * 1024 * 1024) {
                alert('생성된 동영상이 15MB를 초과했습니다. 다시 시도해주세요.');
                return;
            }

            const url = URL.createObjectURL(new Blob([uint8Data as unknown as BlobPart], { type: 'video/mp4' }));
            setVideoUrl(url);
        } catch (error) {
            console.error(error);
            alert('변환 중 오류가 발생했습니다.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadVideo = () => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `converted_${selectedFile?.name.split('.')[0] || 'video'}.mp4`;
        link.click();
    };

    const shareVideo = async () => {
        if (!videoUrl || !selectedFile) return;
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const file = new File([blob], `converted_${selectedFile.name.split('.')[0] || 'video'}.mp4`, { type: 'video/mp4' });

            if (navigator.share) {
                await navigator.share({
                    title: '트위터용 동영상',
                    text: '트위터 업로드를 위해 변환된 동영상입니다.',
                    files: [file],
                });
            } else {
                alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center">
            <div className="max-w-md w-full">
                <div className="flex items-center mb-8">
                    <Link href="/" className="mr-4 text-muted-foreground hover:bg-accent p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold text-foreground">트위터용 동영상 변환기</h1>
                </div>

                <div className="bg-card rounded-[24px] p-6 shadow-sm">
                    {!loaded && isLoading && (
                        <div className="mb-6 text-center text-muted-foreground text-sm animate-pulse">
                            변환 엔진을 로딩하고 있습니다...
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-foreground mb-3">
                            이미지 선택
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!loaded}
                            />
                            <div className={`w-full py-4 px-4 bg-muted border border-dashed border-border rounded-[16px] flex items-center justify-center text-muted-foreground transition-colors ${loaded ? 'hover:bg-accent' : 'opacity-50 cursor-wait'}`}>
                                {selectedFile ? (
                                    <span className="text-foreground font-medium truncate px-2">
                                        {selectedFile.name}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                        이미지 선택하기
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedFile && (
                        <div className="mb-6 flex justify-center bg-muted rounded-[16px] p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="max-h-64 rounded-lg object-contain"
                            />
                        </div>
                    )}

                    <button
                        onClick={convertToVideo}
                        disabled={!selectedFile || isConverting || !loaded}
                        className="w-full py-4 bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-bold text-[17px] rounded-[20px] transition-all active:scale-95 mb-4 shadow-sm"
                    >
                        {isConverting ? `변환 중... ${progress}%` : '동영상으로 변환하기'}
                    </button>

                    {videoUrl && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-center gap-2 text-[#22c55e] font-bold mb-4 bg-[#22c55e]/10 py-3 rounded-[16px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                <span>변환이 완료되었습니다!</span>
                            </div>

                            <div className="mb-6 flex justify-center bg-muted rounded-[16px] p-4">
                                <video
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    loop
                                    className="max-h-64 rounded-lg"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={downloadVideo}
                                    className="flex-1 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-[16px] rounded-[20px] hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                    다운로드
                                </button>
                                <button
                                    onClick={shareVideo}
                                    className="flex-1 py-4 bg-[var(--secondary)] text-[var(--secondary-foreground)] font-bold text-[16px] rounded-[20px] hover:opacity-80 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                                    공유하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <ul className="mt-8 px-4 space-y-2 list-disc list-outside text-[14px] text-muted-foreground leading-relaxed pl-4">
                    <li>이미지를 2초 길이의 무음 MP4 동영상으로 변환합니다.</li>
                    <li>트위터(X)에 이미지를 동영상처럼 업로드하고 싶을 때 유용합니다.</li>
                    <li>모든 변환 과정은 브라우저에서 이루어지며, 서버로 이미지가 전송되지 않습니다.</li>
                </ul>
                <p ref={messageRef} className="hidden"></p>
            </div>
        </div>
    );
}
