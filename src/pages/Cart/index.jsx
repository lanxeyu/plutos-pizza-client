import { useEffect, useState } from 'react';
import { Pizza } from '../../utilities/pizza';
import { CheckoutFooter, EditPizza } from '../../components';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import './script.js'
import './style.css'

function Cart() {

  const [cart, setCart] = useState([]);
  const [show, setShowEditModal] = useState([]);
  const [selectedPizzaIndex, setSelectedPizzaIndex] = useState(null);
  const [buttonText, setButtonText] = useState('Add Pizza');

  const updateButtonText = () => {
    if (window.innerWidth <= 768) {
      setButtonText('+');
    } else {
      setButtonText('Add Pizza');
    }
  };

  useEffect(() => {
    updateButtonText();
    window.addEventListener('resize', updateButtonText);
    return () => {
      window.removeEventListener('resize', updateButtonText);
    };
  }, []);

  const handleAddPizza = () => {
    const pizza = new Pizza();
    setCart((prevCart) => [...prevCart, pizza]);
    setShowEditModal((prevShowEditModal) => [...prevShowEditModal, false]);
  }

  const removeFromCart = (index) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
    setShowEditModal((prevShowEditModal) => {
      const updatedShowEditModal = [...prevShowEditModal];
      updatedShowEditModal.splice(index, 1);
      return updatedShowEditModal;
    });
  }

  const handleClose = () => {
    setShowEditModal((prevShowEditModal) => {
      const updatedShowEditModal = [...prevShowEditModal];
      updatedShowEditModal[selectedPizzaIndex] = false;
      return updatedShowEditModal;
    });
    setSelectedPizzaIndex(null);
  }

  const handleShowEditModal = (index) => {
    setSelectedPizzaIndex(index);
    setShowEditModal((prevShowEditModal) => {
      const updatedShowEditModal = [...prevShowEditModal];
      updatedShowEditModal[index] = true;
      return updatedShowEditModal;
    });
  }

  return (
    <>
      <div className='cart-header'>
        <Button variant='warning' className='add-pizza-btn' onClick={handleAddPizza}>{buttonText}</Button>
      </div>

      {/* Dynamically generate pizza list */}
      <div className='pizza-list col-md-10'>
        {cart.map((pizza, index) => (
          <div className='text-center pizza-item col-lg-3 col-md-4 col-xs-8' key={index} >

            <div className='pizza-name-and-btns'>
              <h3>Pizza {pizza.name}</h3>
              
              {/* Edit pizza modal */}
              <ButtonGroup>
                <Button variant='dark' onClick={() => handleShowEditModal(index)}>Edit</Button>
                <Modal show={show[index]} onHide={handleClose} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
                  <Modal.Body>
                    <EditPizza pizza={pizza}></EditPizza>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={handleClose}>Save</Button>
                  </Modal.Footer>
                </Modal>
                <Button variant='outline-dark' onClick={() => removeFromCart(index)}>X</Button>

              </ButtonGroup>
            </div>

            <div className='pizza-details'>
              <p><b>Size:</b> {pizza.size}</p>
              {pizza.getPizzaDetails().toppings.length > 0 ? (
                  <p><b>Toppings:</b> {pizza.getPizzaDetails().toppings.join(', ')}</p>
                ) : (
                  <p><b>Toppings:</b> No toppings selected</p>
                )}
            </div>

            <div className='pizza-footer'>
              <h5 className='pizza-price'>£{pizza.getPizzaDetails().pizzaPrice}</h5>
            </div>
          </div>
        ))}
      </div>    

      
      <div className='checkoutFooter col-md-10'>
        <CheckoutFooter cart={cart}/>
      </div>
    </>


  );
}

export default Cart;
