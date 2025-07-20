import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setSelectedFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const handleRemoveFile = useCallback(() => {
        setSelectedFile(null);
        onFileSelect?.(null);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = selectedFile;

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-3 sm:space-y-4 cursor-pointer touch-manipulation">
                    {file ? (
                        <div className="uploader-selected-file animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF6B6B]/20 to-[#4F75FF]/20 rounded-xl flex items-center justify-center border border-[#4F75FF]/30 flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#4F75FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm sm:text-base font-semibold text-white truncate">
                                        {file.name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs sm:text-sm text-[#A5B4C7] font-medium">
                                            {formatSize(file.size)}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                            <span className="text-xs text-green-400 font-medium">Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="p-2 cursor-pointer bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 rounded-xl transition-all duration-200 hover:scale-110 group flex-shrink-0 touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center border border-[#FF6B6B]/20 hover:border-[#FF6B6B]/40" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile();
                                }}
                                aria-label="Remove file"
                            >
                                <svg className="w-4 h-4 text-[#FF6B6B] group-hover:text-[#FF5252] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ): (
                        <div className="text-center py-6 sm:py-8">
                            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#4F75FF]/30 via-[#8B5CF6]/20 to-[#FF6B6B]/30 rounded-3xl flex items-center justify-center mb-6 border border-[#4F75FF]/30 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#4F75FF] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg sm:text-xl text-[#A5B4C7] font-medium">
                                    <span className="font-bold text-white bg-gradient-to-r from-[#4F75FF] to-[#8B5CF6] bg-clip-text text-transparent">
                                        Click to upload
                                    </span> or drag and drop
                                </p>
                                <p className="text-sm sm:text-base text-[#6B7A8F] font-medium">PDF files only • Maximum {formatSize(maxFileSize)}</p>
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-400 font-medium">Secure & encrypted upload</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader