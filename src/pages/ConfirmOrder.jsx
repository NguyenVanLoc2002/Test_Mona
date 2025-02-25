import { motion } from "framer-motion";

const ConfirmOrder = ({ order, onClose, onAccess }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.8 }} 
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] md:w-[500px] text-gray-800"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">🛒 Xác nhận đơn hàng</h2>
        
        {/* Thông tin khách hàng */}
        <div className="bg-gray-100 p-3 rounded-lg">
          <p><strong>👤 Khách hàng:</strong> {order.customer.name}</p>
          <p><strong>📞 Số điện thoại:</strong> {order.customer.phone}</p>
          <p><strong>💳 Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p className="text-lg font-semibold text-red-600">
            <strong>💰 Tổng tiền:</strong> {order.totalAmount.toLocaleString()}đ
          </p>
          
          {order.paymentMethod === "cash" && (
            <div className="mt-2">
              <p><strong>💵 Tiền khách đưa:</strong> {order.customerCash.toLocaleString()}đ</p>
              <p><strong>💲 Tiền thối lại:</strong> {order.changeAmount.toLocaleString()}đ</p>
            </div>
          )}
        </div>

        {/* Giỏ hàng */}
        <h3 className="font-semibold mt-4 text-lg">📦 Giỏ hàng</h3>
        <ul className="list-none border-t border-gray-300 mt-2 pt-2 space-y-2">
          {order.cart.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.quantity} x {item.price.toLocaleString()}đ</span>
            </li>
          ))}
        </ul>

        {/* Nút điều khiển */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            ❌ Đóng
          </button>
          
          <button 
            onClick={onAccess} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
          >
            ✅ Xác nhận
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmOrder;
