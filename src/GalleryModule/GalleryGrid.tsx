import React, {
  useState,
  useMemo,
} from "react";
import { usePhotosContext, Image } from "../context/PhotosContext";
import { Gallery } from "react-grid-gallery";
import { createClient } from 'pexels';
import './GalleryStyles.css';
import Lightbox, {
  IconButton,
  createIcon,
  useLightboxState,
  LightboxStateContextType,
} from "yet-another-react-lightbox";
import InfiniteScroll from 'react-infinite-scroller';
import SvgComponent from '../../src/SvgComponent';
import "yet-another-react-lightbox/styles.css";

interface CachedData {
  [page: number]: Image[];
}

const GalleryGrid: React.FC = () => {
  const [index, setIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);
  const { images, setImages }:
    {
      images: Image[], setImages: React.Dispatch<React.SetStateAction<Image[]>>
    } = usePhotosContext();
  const [cachedData, setCachedData] = useState<CachedData>({});
  const apiKey: string = (process.env.REACT_APP_PEXELS_KEY as string);

  const slides: { src: string; width: number; height: number }[] = useMemo(() => {
    return images.map(({ src, width, height }) => ({
      src,
      width,
      height,
    }));
  }, [images]);

  const MyIcon: React.FC = createIcon("MyIcon", <SvgComponent />);

  const MyButton = () => {
    const { currentSlide }: {
      currentSlide: NonNullable<LightboxStateContextType>['currentSlide']
    } = useLightboxState();

    const handleDelete = (): void => {
      if (currentSlide) {
        setImages((prevImages) => {
          const indexToDelete = prevImages.findIndex((image) => image.src === currentSlide.src);
          if (indexToDelete !== -1) {
            const updatedImages = [...prevImages.slice(0, indexToDelete), ...prevImages.slice(indexToDelete + 1)];
            return updatedImages;
          }
          return prevImages;
        });
      }
    };

    return (
      <IconButton
        label="My button"
        icon={MyIcon}
        disabled={!currentSlide}
        onClick={handleDelete}
      />
    );
  };

  const handlePhotoClick = (index: number, item: Image): void => {
    setIndex(index);
  }

  const handleSelect = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].isSelected = !updatedImages[index].isSelected;
      return updatedImages;
    });
  }

  const fetchPhotos = 
    async (): Promise<void> => {
      try {
        if (cachedData[page]) {
          setImages((prevImages) => [...prevImages, ...cachedData[page]]);
          return;
        }
        const client = createClient(apiKey);
        const query: string = 'Nature';
        const response = await client.photos.search({
          query,
          per_page: 31,
          page: page
        });
        if ('photos' in response) {
          const newImages: Image[] = response.photos.map((photo) => ({
            id: photo.id,
            alt: photo.alt ?? 'No Alt',
            photographer: photo.photographer,
            src: photo.src.medium,
            width: photo.width,
            height: photo.height,
            isSelected: false,
            customOverlay: (
              <div className="custom-overlay__photographer">
                <div>{photo.photographer}</div>
              </div>
            ),
          }));

          setCachedData((prevCache) => ({ ...prevCache, [page]: newImages }));
          setImages((prevPhotos) => [...prevPhotos, ...newImages]);
          setPage((prevPage) => prevPage + 1);

        }
      } catch (error: any) {
        console.error('Error fetching photos:', error);
      }
    }

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <InfiniteScroll
        initialLoad={true}
        loadMore={fetchPhotos}
        hasMore={true}
      >
        <Gallery
          images={images}
          onClick={handlePhotoClick}
          enableImageSelection={true}
          onSelect={handleSelect}
        />
        <Lightbox
          slides={slides}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          toolbar={{
            buttons: [<MyButton key="my-button" />, "close"],
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default GalleryGrid;