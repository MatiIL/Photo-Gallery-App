import React, { useState, Dispatch, SetStateAction } from 'react';
import { usePhotosContext, Image, PhotosContextValue } from '../context/PhotosContext';
import { Modal, Form, Button } from 'react-bootstrap';
import { nanoid } from 'nanoid'

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
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
        setShow(false);
    }

    return (
        <Modal show={show} as="div">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Please enter a link to the photo and press submit</Form.Label>
                        <Form.Control
                            type="text"
                            autoFocus
                            onChange={(e) => setImgUrl(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
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