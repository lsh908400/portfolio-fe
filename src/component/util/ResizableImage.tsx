import { useState, useRef, useEffect } from 'react';

interface ResizableImageProps {
    src: string;
    alt: string;
    initialWidth?: string | number;
    maxWidth?: string | number;
    className?: string;
    onResize?: (width: number, height: number) => void;
}

const ResizableImage: React.FC<ResizableImageProps> = ({
    src,
    alt,
    initialWidth = '100%',
    maxWidth = '100%',
    className = '',
    onResize
}) => {
    const [width, setWidth] = useState<number | string>(initialWidth);
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    // 리사이징 시작
    const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (imageRef.current) {
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = imageRef.current.offsetWidth;
        }
    };

  // 리사이징 처리
    const handleResize = (e: MouseEvent) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startXRef.current;
        const newWidth = Math.max(100, startWidthRef.current + deltaX); // 최소 100px
        
        setWidth(newWidth);
        
        if (onResize && imageRef.current) {
        onResize(newWidth, imageRef.current.offsetHeight);
        }
    };

  // 리사이징 종료
    const stopResize = () => {
        setIsResizing(false);
    };

    // 이벤트 핸들러 등록 및 제거
    useEffect(() => {
        if (isResizing) {
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', stopResize);
        }
        
        return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing]);

    return (
        <div className="relative inline-block" style={{ maxWidth }}>
        <img 
            ref={imageRef}
            src={src}
            alt={alt}
            className={`${className} ${isResizing ? 'select-none' : ''}`}
            style={{ width, height: 'auto' }}
        />
        
        {/* 우측 리사이징 핸들 */}
        <div 
            className="absolute top-0 right-0 w-4 h-full cursor-ew-resize"
            onMouseDown={startResize}
        />
        
        {/* 우측 하단 리사이징 핸들 */}
        <div 
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize bg-white bg-opacity-50 rounded-full flex items-center justify-center"
            onMouseDown={startResize}
        >
            <svg 
            width="10" 
            height="10" 
            viewBox="0 0 10 10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            >
            <path 
                d="M1 9L9 1M5 9L9 5M9 9L9 9"
                stroke="black" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
            />
            </svg>
        </div>
        </div>
    );
};

export default ResizableImage;