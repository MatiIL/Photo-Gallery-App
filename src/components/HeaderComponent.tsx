import React,
{
    useState,
    useEffect,
    EffectCallback,
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
                        <div className="text-dark">
                            IZME Photos
                        </div>
                        <div>
                            <span
                                onClick={() => window.location.href = "https://www.pexels.com"}
                                className="text-decoration-none text-dark fs-6"
                            >
                                Photos provided by Pexels
                            </span>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <NavDropdown title="Edit" id="basic-nav-dropdown" className='w-25'>
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
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <AddPhotoModal show={show} setShow={setShow} />
        </>
    );
};

export default HeaderComponent;