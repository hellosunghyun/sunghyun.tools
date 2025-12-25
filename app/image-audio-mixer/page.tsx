"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

export default function ImageAudioMixer() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isConverting, setIsConverting] = useState(false);

    // Audio Options
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [fadeIn, setFadeIn] = useState(0);
    const [fadeOut, setFadeOut] = useState(0);
    const [zoom, setZoom] = useState(0);


    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const regions = useRef<any>(null);

    const load = async () => {
        setIsLoading(true);
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;
        ffmpeg.on('log', ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            console.log(message);
        });
        ffmpeg.on('progress', ({ progress }) => {
            const p = progress * 100;
            if (p >= 0 && p <= 100) {
                setProgress(Math.round(p));
            }
        });
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
        setIsLoading(false);
    };

    useEffect(() => {
        load();
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, []);

    const initWaveSurfer = useCallback((file: File) => {
        if (waveformRef.current) {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }

            const ws = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#E4E4E7',
                progressColor: '#881E1E',
                cursorColor: '#881E1E',
                height: 100,
                normalize: true,
            });

            // Initialize Regions plugin
            const wsRegions = ws.registerPlugin(RegionsPlugin.create());
            regions.current = wsRegions;

            // Enable drag selection
            wsRegions.enableDragSelection({
                color: 'rgba(136, 30, 30, 0.2)',
                handleStyle: {
                    left: {
                        backgroundColor: '#881E1E',
                        width: '4px',
                        opacity: '0.8',
                    },
                    right: {
                        backgroundColor: '#881E1E',
                        width: '4px',
                        opacity: '0.8',
                    }
                }
            } as any);

            ws.loadBlob(file);

            ws.on('ready', () => {
                const dur = ws.getDuration();
                setDuration(dur);
                setStartTime(0);
                setEndTime(dur);

                // Add a region for the whole track by default
                wsRegions.addRegion({
                    start: 0,
                    end: dur,
                    color: 'rgba(136, 30, 30, 0.2)',
                    drag: true,
                    resize: true,
                });

                // Apply initial zoom only when ready (0 means fit to container)
                if (zoom > 0) {
                    ws.zoom(zoom);
                }
            });

            // Ensure only one region exists
            wsRegions.on('region-created', (region: any) => {
                const regionsList = wsRegions.getRegions();
                regionsList.forEach((r: any) => {
                    if (r.id !== region.id) {
                        r.remove();
                    }
                });
                setStartTime(region.start);
                setEndTime(region.end);
            });

            wsRegions.on('region-updated', (region: any) => {
                setStartTime(region.start);
                setEndTime(region.end);
            });

            wavesurfer.current = ws;
        }
    }, []); // Removed zoom from dependency to prevent re-init

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setVideoUrl(null);
        }
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudioFile(file);
            setVideoUrl(null);
            initWaveSurfer(file);
        }
    };

    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newZoom = Number(e.target.value);
        setZoom(newZoom);
        if (wavesurfer.current) {
            wavesurfer.current.zoom(newZoom);
        }
    };

    const playPreviewStart = () => {
        if (wavesurfer.current) {
            wavesurfer.current.play(startTime, Math.min(startTime + 3, endTime));
        }
    };

    const playPreviewEnd = () => {
        if (wavesurfer.current) {
            wavesurfer.current.play(Math.max(startTime, endTime - 3), endTime);
        }
    };

    const convertToVideo = async () => {
        if (!imageFile || !audioFile || !loaded || !ffmpegRef.current) return;

        setIsConverting(true);
        setProgress(0);
        const ffmpeg = ffmpegRef.current;

        try {
            await ffmpeg.writeFile('input.png', await fetchFile(imageFile));
            await ffmpeg.writeFile('input.mp3', await fetchFile(audioFile));

            // Calculate duration of the trimmed audio
            const trimDuration = endTime - startTime;

            // Build audio filter string
            // 1. atrim: trim audio
            // 2. asetpts: reset timestamps
            // 3. afade: fade in
            // 4. afade: fade out
            let af = `atrim=${startTime}:${endTime},asetpts=PTS-STARTPTS`;
            if (fadeIn > 0) {
                af += `,afade=t=in:st=0:d=${fadeIn}`;
            }
            if (fadeOut > 0) {
                // Fade out starts at (duration - fadeOut)
                const fadeOutStart = trimDuration - fadeOut;
                if (fadeOutStart > 0) {
                    af += `,afade=t=out:st=${fadeOutStart}:d=${fadeOut}`;
                }
            }

            await ffmpeg.exec([
                '-loop', '1',
                '-r', '10',
                '-i', 'input.png',
                '-i', 'input.mp3',
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-tune', 'stillimage',
                '-c:a', 'aac',
                '-b:a', '192k',
                '-t', `${trimDuration}`,
                '-pix_fmt', 'yuv420p',
                '-vf', 'scale=2048:2048:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2',
                '-af', af,
                '-shortest',
                '-threads', '0',
                '-movflags', '+faststart',
                'output.mp4'
            ]);

            const data = await ffmpeg.readFile('output.mp4');
            const uint8Data = data as Uint8Array;
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
        link.download = `image_audio_mixer_${Date.now()}.mp4`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center">
            <div className="max-w-2xl w-full">
                <div className="flex items-center mb-8">
                    <Link href="/" className="mr-4 text-muted-foreground hover:bg-accent p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold text-foreground">이미지 오디오 합치기</h1>
                </div>

                <div className="bg-card rounded-[24px] p-6 shadow-sm space-y-8">
                    {!loaded && isLoading && (
                        <div className="text-center text-muted-foreground text-sm animate-pulse">
                            변환 엔진을 로딩하고 있습니다...
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-3">
                            1. 이미지 선택 (결과물은 최대 2048x2048로 자동 조정됨)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!loaded}
                            />
                            <div className={`w-full py-4 px-4 bg-muted border border-dashed border-border rounded-[16px] flex items-center justify-center text-muted-foreground transition-colors ${loaded ? 'hover:bg-accent' : 'opacity-50 cursor-wait'}`}>
                                {imageFile ? (
                                    <span className="text-foreground font-medium truncate px-2">
                                        {imageFile.name}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                        이미지 선택하기
                                    </span>
                                )}
                            </div>
                        </div>
                        {imageFile && (
                            <div className="mt-4 flex justify-center bg-muted rounded-[16px] p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="max-h-48 rounded-lg object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Audio Upload */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-3">
                            2. 오디오 선택
                        </label>
                        <div className="relative mb-4">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleAudioChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!loaded}
                            />
                            <div className={`w-full py-4 px-4 bg-muted border border-dashed border-border rounded-[16px] flex items-center justify-center text-muted-foreground transition-colors ${loaded ? 'hover:bg-accent' : 'opacity-50 cursor-wait'}`}>
                                {audioFile ? (
                                    <span className="text-foreground font-medium truncate px-2">
                                        {audioFile.name}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                                        오디오 선택하기
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Waveform */}
                        <div className={`transition-opacity ${audioFile ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div className="relative w-full mb-4">
                                <div ref={waveformRef} className="w-full bg-muted rounded-[16px] overflow-x-auto" />
                                {/* Custom Handles - positioned based on percentage */}
                                {duration > 0 && (
                                    <>
                                        {/* Start Handle */}
                                        <div
                                            className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex flex-col items-center pointer-events-auto"
                                            style={{ left: `${(startTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const container = waveformRef.current;
                                                if (!container) return;
                                                const onMove = (moveEvent: MouseEvent) => {
                                                    const rect = container.getBoundingClientRect();
                                                    const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                                                    const newTime = (x / rect.width) * duration;
                                                    if (newTime < endTime - 0.1) {
                                                        setStartTime(newTime);
                                                        if (regions.current) {
                                                            const regionsList = regions.current.getRegions();
                                                            if (regionsList.length > 0) {
                                                                regionsList[0].setOptions({ start: newTime });
                                                            }
                                                        }
                                                    }
                                                };
                                                const onUp = () => {
                                                    document.removeEventListener('mousemove', onMove);
                                                    document.removeEventListener('mouseup', onUp);
                                                };
                                                document.addEventListener('mousemove', onMove);
                                                document.addEventListener('mouseup', onUp);
                                            }}
                                        >
                                            <div className="w-[2px] h-full bg-[var(--primary)]" />
                                            <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--primary)] shadow-md border-2 border-white" />
                                        </div>
                                        {/* End Handle */}
                                        <div
                                            className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex flex-col items-center pointer-events-auto"
                                            style={{ left: `${(endTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const container = waveformRef.current;
                                                if (!container) return;
                                                const onMove = (moveEvent: MouseEvent) => {
                                                    const rect = container.getBoundingClientRect();
                                                    const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                                                    const newTime = (x / rect.width) * duration;
                                                    if (newTime > startTime + 0.1) {
                                                        setEndTime(newTime);
                                                        if (regions.current) {
                                                            const regionsList = regions.current.getRegions();
                                                            if (regionsList.length > 0) {
                                                                regionsList[0].setOptions({ end: newTime });
                                                            }
                                                        }
                                                    }
                                                };
                                                const onUp = () => {
                                                    document.removeEventListener('mousemove', onMove);
                                                    document.removeEventListener('mouseup', onUp);
                                                };
                                                document.addEventListener('mousemove', onMove);
                                                document.addEventListener('mouseup', onUp);
                                            }}
                                        >
                                            <div className="w-[2px] h-full bg-[var(--primary)]" />
                                            <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--primary)] shadow-md border-2 border-white" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-medium text-muted-foreground">시작 시간 (초)</label>
                                        <button onClick={playPreviewStart} className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                            미리듣기
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        value={startTime.toFixed(2)}
                                        readOnly
                                        className="w-full bg-muted rounded-lg px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-medium text-muted-foreground">종료 시간 (초)</label>
                                        <button onClick={playPreviewEnd} className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                            미리듣기
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        value={endTime.toFixed(2)}
                                        readOnly
                                        className="w-full bg-muted rounded-lg px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">페이드 인 (초)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.5"
                                        value={fadeIn}
                                        onChange={(e) => setFadeIn(Number(e.target.value))}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">페이드 아웃 (초)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.5"
                                        value={fadeOut}
                                        onChange={(e) => setFadeOut(Number(e.target.value))}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Convert Button */}
                    <button
                        onClick={convertToVideo}
                        disabled={!imageFile || !audioFile || isConverting || !loaded}
                        className="w-full py-4 bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--primary-foreground)] font-bold text-[17px] rounded-[20px] transition-all active:scale-95 shadow-sm"
                    >
                        {isConverting ? `변환 중... ${progress}%` : '동영상 만들기'}
                    </button>

                    {/* Result */}
                    {videoUrl && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-center gap-2 text-[#22c55e] font-bold mb-4 bg-[#22c55e]/10 py-3 rounded-[16px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                <span>완료되었습니다!</span>
                            </div>

                            <div className="mb-6 flex justify-center bg-muted rounded-[16px] p-4">
                                <video
                                    src={videoUrl}
                                    controls
                                    className="max-h-96 rounded-lg w-full"
                                />
                            </div>

                            <button
                                onClick={downloadVideo}
                                className="w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-[16px] rounded-[20px] hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                다운로드
                            </button>
                        </div>
                    )}
                </div>
                <p ref={messageRef} className="hidden"></p>
            </div>
        </div>
    );
}
