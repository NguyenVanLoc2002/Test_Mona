import React, { useState } from "react";
import { Modal, Button, Card, Input, Select, Radio } from "antd";

const mockProducts = [
  { id: 1, name: "Táo", price: 50000 },
  { id: 2, name: "Cam", price: 60000 },
  { id: 3, name: "Xoài", price: 70000 },
];

const CreateOrder = () => {
  const [order, setOrder] = useState({
    customerName: "",
    email: "",
    phone: "",
    cart: [],
    paymentMethod: "cash",
    amountReceived: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addProductToCart = (productId) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setOrder((prev) => ({
        ...prev,
        cart: [...prev.cart, { ...product, quantity: 1, discount: 0 }],
      }));
    }
  };

  const updateCart = (index, field, value) => {
    const newCart = [...order.cart];
    newCart[index][field] = value;
    setOrder((prev) => ({ ...prev, cart: newCart }));
  };

  const removeProduct = (index) => {
    setOrder((prev) => ({
      ...prev,
      cart: prev.cart.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return order.cart.reduce(
      (total, item) => total + (item.price - item.discount) * item.quantity,
      0
    );
  };

  const confirmOrder = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="p-4">
      <h2>Tạo Đơn Hàng</h2>
      <Input
        placeholder="Tên khách hàng"
        onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
      />
      <Input
        placeholder="Email"
        onChange={(e) => setOrder({ ...order, email: e.target.value })}
      />
      <Input
        placeholder="Số điện thoại"
        onChange={(e) => setOrder({ ...order, phone: e.target.value })}
      />

      <Select
        placeholder="Chọn sản phẩm"
        onChange={addProductToCart}
        options={mockProducts.map((p) => ({ value: p.id, label: p.name }))}
      />

      <div>
        {order.cart.map((item, index) => (
          <Card key={index} title={item.name}>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateCart(index, "quantity", +e.target.value)}
            />
            <Input
              type="number"
              value={item.price}
              onChange={(e) => updateCart(index, "price", +e.target.value)}
            />
            <Button onClick={() => removeProduct(index)}>Xóa</Button>
          </Card>
        ))}
      </div>

      <Card>
        <h3>Tổng tiền: {calculateTotal()} VND</h3>
        <Radio.Group
          onChange={(e) => setOrder({ ...order, paymentMethod: e.target.value })}
          value={order.paymentMethod}
        >
          <Radio value="cash">Tiền mặt</Radio>
          <Radio value="card">Thẻ</Radio>
        </Radio.Group>
        {order.paymentMethod === "cash" && (
          <Input
            type="number"
            placeholder="Số tiền khách đưa"
            onChange={(e) =>
              setOrder({ ...order, amountReceived: +e.target.value })
            }
          />
        )}
        {order.paymentMethod === "cash" && order.amountReceived > calculateTotal() && (
          <p>Tiền thừa: {order.amountReceived - calculateTotal()} VND</p>
        )}
      </Card>

      <Button onClick={confirmOrder}>Thanh toán</Button>

      <Modal
        title="Xác nhận đơn hàng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
      >
        <p>Tên khách hàng: {order.customerName}</p>
        <p>Email: {order.email}</p>
        <p>Số điện thoại: {order.phone}</p>
        <h4>Giỏ hàng:</h4>
        {order.cart.map((item, index) => (
          <p key={index}>{item.name} - {item.quantity} x {item.price} VND</p>
        ))}
        <h4>Tổng tiền: {calculateTotal()} VND</h4>
        <p>Phương thức thanh toán: {order.paymentMethod}</p>
        {order.paymentMethod === "cash" && <p>Tiền khách đưa: {order.amountReceived} VND</p>}
      </Modal>
    </div>
  );
};

export default CreateOrder;
