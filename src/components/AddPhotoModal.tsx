import React, { useState, Dispatch, SetStateAction } from 'react';
import { usePhotosContext, Image, PhotosContextValue } from '../context/PhotosContext';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { nanoid } from 'nanoid';

interface ModalProps {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
}

const AddPhotoModal: React.FC<ModalProps> = ({ show, setShow }) => {
    const {
        images,
        setImages,
    }: PhotosContextValue = usePhotosContext();
    const [imgUrl, setImgUrl] = useState<string>("");
    const [invalidUrl, setInvalidUrl] = useState<boolean>(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    const isImgUrl = (url: string) => {
        const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
        const imageRegex = new RegExp(`\\.(${imageExtensions.join('|')})$`, 'i');
        return imageRegex.test(url);
    }

    const handleUrl = (e: any) => {
        const urlInput = (e.target.value);
        if (isImgUrl(urlInput)) {
            setInvalidUrl(false);
            setImgUrl(urlInput);
        } else {
            setInvalidUrl(true);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (invalidUrl) return;
        setShowSpinner(true);
        const newImage: Image = {
            id: nanoid(10),
            alt: 'No Alt',
            photographer: "",
            src: imgUrl,
            width: 5000,
            height: 5000,
            isSelected: false,
        }
        setImages([newImage, ...images]);
        setShowSpinner(false);
        setShow(false);
    }

    return (
        <Modal show={show} as="div">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton onClick={() => setShow(false)}>
                    <Modal.Title>Add Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Please enter a link to the photo and press submit</Form.Label>
                        <Form.Control
                            type="text"
                            autoFocus
                            onChange={(e) => handleUrl(e)}
                        />
                    </Form.Group>
                    <p 
                    className={invalidUrl ? 'd-block text-danger' : "d-none"}
                    >
                        Please enter a valid image URL
                        </p>
                </Modal.Body>
                <Modal.Footer>
                    <Spinner
                        animation="grow" variant="primary"
                        className={showSpinner ? 'd-block' : 'd-none'}
                    />
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddPhotoModal;