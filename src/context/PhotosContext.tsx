import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
    Dispatch,
    SetStateAction,
} from "react";

export interface Image {
    id: string | number;
    alt: string;
    photographer: string;
    src: string;
    width: number;
    height: number;
    isSelected: boolean;
}

export interface PhotosContextValue {
    images: Image[];
    setImages: Dispatch<SetStateAction<Image[]>>;
    hasSelected: boolean;
}

export const PhotosContext = createContext<PhotosContextValue | undefined>(undefined);

export const usePhotosContext = (): PhotosContextValue => {
    const context = useContext(PhotosContext);
    if (!context) {
        throw new Error("usePhotosContext must be used within a PhotosContextProvider");
    }
    return context;
};

interface PhotosContextProviderProps {
    children: ReactNode;
}

const PhotosContextProvider: React.FC<PhotosContextProviderProps> = ({ children }) => {
    const [images, setImages] = useState<Image[]>([]);
    const hasSelected = images.some((image) => image.isSelected);

    const contextValue: PhotosContextValue = {
        images,
        setImages,
        hasSelected,
    };

    return <PhotosContext.Provider value={contextValue}>{children}</PhotosContext.Provider>;
};

export default PhotosContextProvider;