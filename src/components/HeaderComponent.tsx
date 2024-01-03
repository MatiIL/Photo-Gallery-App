import React,
{
    useState,
    useEffect,
} from 'react';
import { usePhotosContext, PhotosContextValue } from '../context/PhotosContext';
import {
    Navbar,
    Container,
    NavDropdown,
} from 'react-bootstrap';
import AddPhotoModal from './AddPhotoModal';

const HeaderComponent: React.FC = () => {
    const {
        images,
        setImages,
        hasSelected: contextHasSelected,
    }: PhotosContextValue = usePhotosContext();

    const [hasSelected, setHasSelected] = useState<boolean>(contextHasSelected);
    const [hasDeleted, setHasDeleted] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    const handleShow = (): void => setShow(true);

    const handleSelect: () => void = () => {
        const nextImages = images.map((image) => ({
            ...image,
            isSelected: !contextHasSelected,
        }));
        setImages(nextImages);
    };

    useEffect(() => {
        if (contextHasSelected) {
            setHasSelected(contextHasSelected);
        }
    }, [contextHasSelected] as const);

    useEffect(() => {
        if (hasDeleted) {
            const removeSelected = images.filter((image) => !image.isSelected);
            setImages(removeSelected);
            setHasDeleted(false);
        }
    }, [hasDeleted] as const);

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">
                        <div className="app-name text-dark">
                            Infinity Gallery
                        </div>
                        <div>
                            <span
                                onClick={() => window.location.href = "https://www.pexels.com"}
                                className="text-decoration-none text-dark"
                            >
                                Photos provided by Pexels
                            </span>
                        </div>
                    </Navbar.Brand>
                        <NavDropdown title="Edit" id="basic-nav-dropdown" className='w-50'>
                            <NavDropdown.Item onClick={handleSelect}>
                                {contextHasSelected ? 'Clear selection' : 'Select all'}
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => setHasDeleted(true)}
                            >Delete selected
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleShow}>
                                Add photo
                            </NavDropdown.Item>
                        </NavDropdown>
                </Container>
            </Navbar>
            <AddPhotoModal show={show} setShow={setShow} />
        </>
    );
};

export default HeaderComponent;