import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Table, TableHeader, TableRow, TableCell } from "../components/Table";
import ConfirmOrder from "./ConfirmOrder";
import { FaPhoneVolume, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const mockProducts = [
  {
    id: 1,
    name: "Táo đỏ",
    price: 50000,
    image:
      "https://i.pinimg.com/474x/4a/de/37/4ade3729109e48e14e0e3126f49df099.jpg",
  },
  {
    id: 2,
    name: "Cam vàng",
    price: 60000,
    image:
      "https://i.pinimg.com/474x/7a/aa/a5/7aaaa545e00e8a434850e80b8910dd94.jpg",
  },
  {
    id: 3,
    name: "Nho xanh",
    price: 70000,
    image:
      "https://i.pinimg.com/474x/d4/81/b8/d481b8e65d87c5c08c4889348526abd3.jpg",
  },
  {
    id: 4,
    name: "Kiwi",
    price: 80000,
    image:
      "https://i.pinimg.com/474x/d6/6b/25/d66b257fa3fb12c27b3b0e5f9ebf3885.jpg",
  },
];

const discountCodes = {
  TAO10: { type: "percent", value: 10 }, // Giảm 10%
  CAM5000: { type: "fixed", value: 5000 }, // Giảm 5000đ
  NHO15: { type: "percent", value: 15 }, // Giảm 15%
};

const CreateOrder = () => {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    customerCash: "",
  });
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerCash, setCustomerCash] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [discountInput, setDiscountInput] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) return "Tên khách hàng không được để trống";
    if (!/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(name)) return "Tên chỉ được chứa chữ cái";
    return "";
  };

  const validateEmail = (email) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Số điện thoại không được để trống";
    if (!/^(0\d{9,10})$/.test(phone))
      return "Số điện thoại phải bắt đầu bằng 0 và có 10-11 số";
    return "";
  };

  const handleDiscountChange = (id, value) => {
    setDiscountInput((prev) => ({ ...prev, [id]: value }));
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const updateCart = (id, field, value) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      Object.entries(discountInput).forEach(([id, code]) => {
        if (code.trim() !== "") {
          const discount = discountCodes[code];
          setCart((prevCart) =>
            prevCart.map((item) => {
              if (item.id === Number(id)) {
                const discountValue =
                  discount?.type === "percent"
                    ? (item.price * item.quantity * discount.value) / 100
                    : discount?.value || 0;

                return {
                  ...item,
                  discountCode: discount ? code : "",
                  discount: discountValue,
                };
              }
              return item;
            })
          );
        } else {
          setCart((prevCart) =>
            prevCart.map((item) => {
              if (item.id === Number(id)) {
                return {
                  ...item,
                  discountCode: "",
                  discount: 0,
                };
              }
              return item;
            })
          );
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [discountInput, cart]);

  const removeFromCart = (id) => {
    // Đánh dấu sản phẩm là đã xóa
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, isRemoved: true } : item
      )
    );

    setTimeout(() => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }, 500);
  };

  const totalAmount =
    cart && cart.length > 0
      ? cart.reduce(
          (acc, item) => acc + (item.price * item.quantity - item.discount),
          0
        )
      : 0;

  const changeAmount = customerCash - totalAmount;

  const handleChange = (field, value) => {
    setCustomer({ ...customer, [field]: value });

    let errorMessage = "";
    if (field === "name") errorMessage = validateName(value);
    if (field === "email") errorMessage = validateEmail(value);
    if (field === "phone") errorMessage = validatePhone(value);

    if (field === "customerCash" && value < totalAmount) {
      errorMessage = "Số tiền không đủ để thanh toán";
    }

    setErrors({ ...errors, [field]: errorMessage });
  };

  const handleOrderSubmit = () => {
    if (!customer.name || !customer.phone) {
      alert("Vui lòng nhập thông tin khách hàng hợp lệ!");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (totalAmount > customerCash || customerCash < 0) {
      alert("Vui lòng nhập tiền đủ để thanh toán!");
      return;
    }

    const newOrder = {
      customer,
      cart,
      totalAmount,
      paymentMethod,
      customerCash: paymentMethod === "cash" ? customerCash : 0,
      changeAmount: paymentMethod === "cash" ? changeAmount : 0,
      createdAt: new Date().toISOString(),
    };

    setOrderData(newOrder);
    setShowConfirmModal(true);
  };

  const handleAccess = () => {
    alert("Thanh toán thành công!");
    setCustomer({ name: "", email: "", phone: "" });
    setErrors({ name: "", email: "", phone: "" });
    setCart([]);
    setPaymentMethod("cash");
    setCustomerCash(0);
    setOrderData(null);
    setDiscountInput({});
    setShowConfirmModal(false);
  };


  return (
    <div className="w-full mx-auto p-8 bg-gradient-to-br from-green-200 to-green-400 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        🛒 Tạo Đơn Hàng
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <Card className="shadow-md">
            <CardContent>
              <h3 className="font-bold text-2xl mb-3">
                📌 Thông tin khách hàng
              </h3>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser />
                <Input
                  className="border-none"
                  placeholder="Tên khách hàng"
                  value={customer?.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <span className="text-red-500 text-xl">*</span>
              </label>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <label className="input input-bordered flex items-center gap-2">
                <MdEmail size={20} />
                <Input
                  placeholder="Email"
                  value={customer?.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border-none"
                />
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <label className="input input-bordered flex items-center gap-2">
                <FaPhoneVolume size={20} />
                <Input
                  placeholder="Số điện thoại"
                  value={customer?.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="border-none"
                />
                <span className="text-red-500 text-xl">*</span>
              </label>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </CardContent>
          </Card>

          <div>
            <h3 className="font-semibold text-2xl text-gray-800">
              🛍️ Chọn sản phẩm:
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {mockProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-3 rounded-lg shadow-md hover:bg-green-100 transition duration-200 .cart-item"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-cover object-cover rounded-md"
                  />
                  <p className="font-bold text-center mt-2">{product.name}</p>
                  <p className="text-center text-red-600 font-semibold">
                    {product.price.toLocaleString()}đ
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardContent>
              <h3 className="font-bold text-2xl mb-2">🛒 Giỏ hàng</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Giỏ hàng trống</p>
              ) : (
                <Table>
                  <TableHeader className="text-md">
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>SL</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Mã giảm giá</TableCell>
                      <TableCell>Giảm</TableCell>
                      <TableCell>Thành tiền</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {cart.map((item) => (
                      <TableRow
                        key={item.id}
                        className={`cart-item ${
                          item.isRemoved ? "cart-item-remove" : ""
                        }`}
                      >
                        <TableCell className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded"
                          />
                          {item.name}
                        </TableCell>
                        <TableCell className="w-24">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCart(
                                item.id,
                                "quantity",
                                Math.max(1, Number(e.target.value))
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>{item.price.toLocaleString()}đ</TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            value={discountInput[item.id] || ""}
                            onChange={(e) =>
                              handleDiscountChange(item.id, e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>{item.discount.toLocaleString()}đ</TableCell>
                        <TableCell>
                          {(
                            item.quantity * item.price -
                            item.discount
                          ).toLocaleString()}
                          đ
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => removeFromCart(item.id)}>
                            ❌
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent>
              <h3 className="font-bold text-2xl">💰 Thanh toán</h3>

              <div className="flex gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  <span className="text-2xl pb-2">💵</span>Tiền mặt
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="text-3xl pb-3">💳</span>Thẻ
                </label>
              </div>

              <p className="text-xl font-bold text-red-600">
                Tổng: {totalAmount.toLocaleString()}đ
              </p>

              {paymentMethod === "cash" && (
                <div className="flex items-center">
                  <p className="whitespace-nowrap">Tiền khách đưa:</p>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    min={0}
                    value={customerCash}
                    onChange={(e) => {
                      setCustomerCash(e.target.value);
                      handleChange("customerCash", e.target.value);
                    }}
                    className="w-40 ml-3"
                  />
                  {customerCash > totalAmount && (
                    <p className="ml-6 text-green-600 font-semibold">
                      Tiền thừa: {(customerCash - totalAmount).toLocaleString()}
                      đ
                    </p>
                  )}
                </div>
              )}
              {errors.customerCash && (
                <p className="text-red-500 text-sm">{errors.customerCash}</p>
              )}

              <Button
                onClick={handleOrderSubmit}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
              >
                Thanh toán
              </Button>

              {showConfirmModal && (
                <ConfirmOrder
                  order={orderData}
                  onClose={() => setShowConfirmModal(false)}
                  onAccess={handleAccess}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
