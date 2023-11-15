import React, {
  useState,
  useEffect,
  EffectCallback,
  useMemo,
  useCallback,
} from "react";
import debounce from 'lodash/debounce';
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
import SvgComponent from '../../src/SvgComponent';
import "yet-another-react-lightbox/styles.css";

const GalleryGrid: React.FC = () => {
  const [index, setIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);
  const [didUserScroll, setDidUserScroll] = useState<boolean>(false);
  const { images, setImages }:
    {
      images: Image[], setImages: React.Dispatch<React.SetStateAction<Image[]>>
    } = usePhotosContext();

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

  const THRESHOLD: number = 100;

  // const handleScroll = useCallback((): void => {
  //   const { innerHeight } = window;
  //   const { scrollHeight } = document.documentElement;
  //   const windowBottom: number = innerHeight + window.scrollY;

  //   if (windowBottom >= scrollHeight - THRESHOLD) {
  //     setDidUserScroll(true);
  //     setPage((prevPage: number) => prevPage + 1);
  //   } else {
  //     setDidUserScroll(false);
  //   }
  // }, [setDidUserScroll, setPage, didUserScroll]);

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [handleScroll]);

  const debouncedHandleScroll = debounce(() => {
    const { innerHeight } = window;
    const { scrollHeight } = document.documentElement;
    const windowBottom: number = innerHeight + window.scrollY;

    if (windowBottom >= scrollHeight - THRESHOLD) {
      setDidUserScroll(true);
      setPage((prevPage: number) => prevPage + 1);
    } else {
      setDidUserScroll(false);
    }
  }, 10); // Adjust the delay as needed

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [debouncedHandleScroll]);

  const handleSelect = useCallback((index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].isSelected = !updatedImages[index].isSelected;
      return updatedImages;
    });
  }, [setImages]);

  const apiKey: string = (process.env.REACT_APP_PEXELS_KEY as string);

  useEffect(() => {
    const getPhotos = async (signal: AbortSignal): Promise<void> => {
      try {
        const client = createClient(apiKey);
        const query: string = 'Nature';
        const response = await client.photos.search({
          query,
          per_page: 24,
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

          setImages((prevPhotos) => [...prevPhotos, ...newImages]);
          setPage((prevPage) => prevPage + 1);

        }
      } catch (error: any) {
        console.error('Error fetching photos:', error);
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    getPhotos(signal);

    return () => {
      controller.abort();
    };

  }, [didUserScroll] as const);

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  return (
    <div onContextMenu={handleContextMenu}>
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
    </div>
  );
};

export default GalleryGrid;