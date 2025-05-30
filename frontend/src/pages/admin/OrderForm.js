import React, { useState, useEffect } from "react";
import Delete from "../../assets/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
// import { ReactComponent as Icon } from './assets/icon.svg';
import { useOrdersContext } from "../../hooks/useOrdersContext";
import { useWaitersContext } from "../../hooks/useWaitersContext";

const OrderForm = () => {
  const [tableNumber, setTableNumber] = useState("");
  const [newWaiter, setNewWaiter] = useState("");
  const [selectedWaiter, setSelectedWaiter] = useState("");
  const [errorWaiter, setErrorWaiter] = useState(null);
  const [errorOrder, setErrorOrder] = useState(null);
  const { orders, dispatch } = useOrdersContext();
  const { waiters, dispatchWaiters } = useWaitersContext();

  useEffect(() => {
    const fetchWaiters = async () => {
      const response = await fetch("http://localhost:4000/api/waiters");
      const json = await response.json();

      if (response.ok) {
        dispatchWaiters({ type: "SET_WAITERS", payload: json });
      } else {
        console.log("No data");
      }
    };

    fetchWaiters();
  }, [dispatchWaiters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = { tableNumber, waiterName: selectedWaiter };
    console.log(order);
    const response = await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      body: JSON.stringify(order), // Send the state variable waiter
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (!response.ok) {
      setErrorOrder(json.error);
    }
    if (response.ok) {
      setTableNumber("");
      setErrorOrder(null);
      console.log("new table added", json);
      dispatch({ type: "CREATE_ORDER", payload: json });
    }
  };

  const handleWaiter = async (e) => {
    e.preventDefault();

    const waiter = { waiter: newWaiter }; // Renaming it to avoid conflict
  
    const response = await fetch("http://localhost:4000/api/waiters/", {
      method: "POST",
      body: JSON.stringify(waiter), // Send the state variable waiter
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    console.log(json);

    if (!response.ok) {
      setErrorWaiter(json.error);
    }
    if (response.ok) {
      setNewWaiter("");
      setErrorWaiter(null);
      dispatchWaiters({ type: "CREATE_WAITER", payload: json });
    }
  };


  // DELETE A WAITER
  const deleteWaiter = async (waiter) => {
  
    try {
      const response = await fetch(
        "http://localhost:4000/api/waiters/" + waiter._id,
        {
          method: "DELETE",
        }
      );
      const json = await response.json();

      if (response.ok) {
        console.log("Waiter deleted:", json);
        dispatchWaiters({ type: "DELETE_WAITER", payload: waiter._id });
      }
    } catch (error) {
      console.error("Error deleting waiter:", error);
    }
  };

  return (
    <div className="waiter-forms">
      <form className="order-form" onSubmit={handleSubmit}>
        <h3>Add a New Order</h3>
        <label>Table Number:</label>
        <input
          type="number"
          onChange={(e) => setTableNumber(e.target.value)}
          value={tableNumber}
        />
        <label>Select Waiter:</label>
        {waiters.map((w, index) => (
          <div className="waiters-name" key={w._id}>
            <span className="delete-waiter" onClick={() => deleteWaiter(w)}>
              <img src={Delete} fill="rgb(157, 82, 54, 0.5)" alt="" />
            </span>
            <label className="radio-label">
              <input
                type="radio"
                value={w.waiter}
                checked={selectedWaiter === "option"}
                onChange={(e) => setSelectedWaiter(w.waiter)}
                className="radio-input"
              />
              {w.waiter}
            </label>
          </div>
        ))}

        <p>Selected Waiter: {selectedWaiter}</p>
        <button type="submit" onClick={handleSubmit}>
          Add Order
        </button>
        {errorOrder && <div className="error">{errorOrder}</div>}
      </form>

      {/* ADD WAITER FORM */}
      <form className="add-waiter" onSubmit={handleWaiter}>
        <h3>Add a Waiter</h3>
        <label>Waiter (waitress) Name:</label>
        <input
          type="text"
          onChange={(e) => setNewWaiter(e.target.value)}
          value={newWaiter}
        />
        <button type="submit" onClick={handleWaiter}>
          Add Waiter
        </button>
        {errorWaiter && <div className="error">{errorWaiter}</div>}
      </form>
    </div>
  );
};

export default OrderForm;
