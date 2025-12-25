"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function TwitterPixelTool() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setProcessedImage(null);
        }
    };

    const processImage = () => {
        if (!selectedFile || !canvasRef.current) return;

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d')!;

                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the original image
                ctx.drawImage(img, 0, 0);

                // Inject a pixel with 1% opacity (99% transparency) at (0, 0)
                // Twitter/X checks for transparency to decide whether to convert to JPG.
                // If transparency exists, it often keeps it as PNG.
                // Setting alpha to 1 (out of 255) is roughly 0.4%, which is effectively invisible but technically transparent.
                const imageData = ctx.getImageData(0, 0, 1, 1);
                // data is [r, g, b, a]
                // We keep the color but change alpha.
                // Actually, to ensure it's treated as transparent, we can just set one pixel to be slightly transparent.
                // Let's set the top-left pixel's alpha to 254 (99.6% opacity) or 1 (0.4% opacity).
                // The user requested "99% transparency", which means 1% opacity.
                // 255 * 0.01 = 2.55 -> 3

                // Let's modify the top-left pixel.
                // We'll keep the RGB values but set Alpha to 3 (approx 1%).
                const r = imageData.data[0];
                const g = imageData.data[1];
                const b = imageData.data[2];

                // Create a new pixel data with 1% opacity
                const newPixel = new ImageData(new Uint8ClampedArray([r, g, b, 3]), 1, 1);
                ctx.putImageData(newPixel, 0, 0);

                const dataUrl = canvas.toDataURL('image/png');
                setProcessedImage(dataUrl);
                setIsProcessing(false);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
    };

    const downloadImage = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        // Ensure filename ends with .png
        let filename = selectedFile?.name || 'image.png';
        if (!filename.toLowerCase().endsWith('.png')) {
            filename = filename.replace(/\.[^/.]+$/, "") + ".png";
        }
        link.download = `processed_${filename}`;
        link.href = processedImage;
        link.click();
    };

    const shareImage = async () => {
        if (!processedImage || !selectedFile) return;

        try {
            // Convert data URL to Blob
            const response = await fetch(processedImage);
            const blob = await response.blob();

            // Create File object
            let filename = selectedFile.name || 'image.png';
            if (!filename.toLowerCase().endsWith('.png')) {
                filename = filename.replace(/\.[^/.]+$/, "") + ".png";
            }
            const file = new File([blob], `processed_${filename}`, { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: '트위터 고화질 이미지',
                    text: '트위터 고화질 업로드를 위해 처리된 이미지입니다.',
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
                    <h1 className="text-xl font-bold text-foreground">트위터 이미지 고화질로 업로드</h1>
                </div>

                <div className="bg-card rounded-[24px] p-6 shadow-sm">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-foreground mb-3">
                            이미지 선택
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full py-4 px-4 bg-muted border border-dashed border-border rounded-[16px] flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                                {selectedFile ? (
                                    <span className="text-foreground font-medium truncate px-2">
                                        {selectedFile.name}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                        파일 선택하기
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
                        onClick={processImage}
                        disabled={!selectedFile || isProcessing}
                        className="w-full py-4 bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-bold text-[17px] rounded-[20px] transition-all active:scale-95 mb-4 shadow-sm"
                    >
                        {isProcessing ? '처리 중...' : '투명 픽셀 주입하기'}
                    </button>

                    {processedImage && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-center gap-2 text-[#22c55e] font-bold mb-4 bg-[#22c55e]/10 py-3 rounded-[16px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                <span>처리가 완료되었습니다!</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={downloadImage}
                                    className="flex-1 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-[16px] rounded-[20px] hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                    다운로드
                                </button>
                                <button
                                    onClick={shareImage}
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
                    <li>트위터(X)는 투명도가 포함된 PNG 이미지를 업로드할 때, JPG로 강제 변환하지 않고 형식을 유지하는 특성이 있습니다.</li>
                    <li>이 도구는 이미지에 99% 투명 픽셀을 주입하여 시스템이 투명 이미지로 인식하도록 만듭니다.</li>
                    <li>이를 통해 화질 저하 없이 고화질로 이미지를 업로드할 수 있습니다.</li>
                </ul>
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
